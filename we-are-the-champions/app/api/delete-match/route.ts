import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { Logs, Match } from "@prisma/client";
import { calculatePointsForDeletion, checkToken, craftLogMessage, LogType, ObjectType } from "@/app/utils/constants";

export async function DELETE(req: NextRequest) {
  try {
    const token = await checkToken(req);
    if (!token) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }
    const userId = token?.userId;
    const username = token?.username;
    const match: Match = await req.json();

    // for logging
    const teams = await prisma.match.findUnique({
      where: { id: match.id },
      select: {
        HomeTeam: {
          select: { TeamName: true }, // Only get the HomeTeam's name
        },
        AwayTeam: {
          select: { TeamName: true }, // Only get the AwayTeam's name
        },
      },
    });

    const homeTeamName = teams?.HomeTeam.TeamName;
    const awayTeamName = teams?.AwayTeam.TeamName;
    const teamNamesArray = [
      {
        homeTeamName: homeTeamName ?? "",
        awayTeamName: awayTeamName ?? ""
      }
    ]

    const deleteMatch = prisma.match.delete({
      where: { id: match.id },
    });
    const [normalPointsHomeTeam, tieBreakerPointsHomeTeam] =
      calculatePointsForDeletion(match.HomeGoals, match.AwayGoals);
    const [normalPointsAwayTeam, tieBreakerPointsAwayTeam] =
      calculatePointsForDeletion(match.AwayGoals, match.HomeGoals);

    const updateHomeTeam = prisma.team.update({
      where: { id: match.HomeTeamId },
      data: {
        NormalPoints: { increment: normalPointsHomeTeam },
        TieBreakerPoints: { increment: tieBreakerPointsHomeTeam },
        GoalsScored: { decrement: match.HomeGoals },
      },
    });

    const updateAwayTeam = prisma.team.update({
      where: { id: match.AwayTeamId },
      data: {
        NormalPoints: { increment: normalPointsAwayTeam },
        TieBreakerPoints: { increment: tieBreakerPointsAwayTeam },
        GoalsScored: { decrement: match.AwayGoals },
      },
    });

    await Promise.all([deleteMatch, updateHomeTeam, updateAwayTeam]);

    const currentDate = new Date();
    const logMessage = craftLogMessage(ObjectType.MATCH, LogType.LOG_DELETE, teamNamesArray, username!, currentDate);
    const logData: Omit<Logs, "id"> = {
      Message: logMessage,
      UserId: userId as string,
      LogType: `${LogType.LOG_DELETE} ${ObjectType.MATCH}`,
      Date: currentDate

    }

    await prisma.logs.create({
      data: logData
    }
    )


    return NextResponse.json("update successful", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
