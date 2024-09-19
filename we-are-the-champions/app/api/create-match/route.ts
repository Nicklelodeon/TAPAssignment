import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { calculatePointsForAddition, checkToken, craftLogMessage, LogType, ObjectType } from "@/app/utils/constants";
import { Logs, Match } from "@prisma/client";

export async function POST(req: NextRequest) {
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
    const matches: Omit<Match, "id"> = await req.json();
    if (!Array.isArray(matches)) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    await prisma.match.createMany({
      data: matches,
    });
    const teamUpdatesPromises = matches.map(async (match) => {
      const [normalPointsHomeTeam, tieBreakerPointsHomeTeam] =
        calculatePointsForAddition(match.HomeGoals, match.AwayGoals);
      const [normalPointsAwayTeam, tieBreakerPointsAwayTeam] =
        calculatePointsForAddition(match.AwayGoals, match.HomeGoals);

      const [homeTeam, awayTeam] = await Promise.all([
        prisma.team.update({
          where: { id: match.HomeTeamId },
          data: {
            NormalPoints: { increment: normalPointsHomeTeam },
            TieBreakerPoints: { increment: tieBreakerPointsHomeTeam },
            GoalsScored: { increment: match.HomeGoals },
          },
          select: { TeamName: true },
        }),
        prisma.team.update({
          where: { id: match.AwayTeamId },
          data: {
            NormalPoints: { increment: normalPointsAwayTeam },
            TieBreakerPoints: { increment: tieBreakerPointsAwayTeam },
            GoalsScored: { increment: match.AwayGoals },
          },
          select: { TeamName: true },
        }),
      ]);

      return { homeTeamName: homeTeam.TeamName, awayTeamName: awayTeam.TeamName };
    });

    const teamNamesArray = await Promise.all(teamUpdatesPromises);
    const currentDate = new Date();
    const logMessage = craftLogMessage(ObjectType.MATCH, LogType.LOG_CREATE, teamNamesArray, username!, currentDate);
    const logData: Omit<Logs, "id"> = {
      Message: logMessage,
      UserId: userId as string,
      LogType: `${LogType.LOG_CREATE} ${ObjectType.MATCH}`,
      Date: currentDate

    }

    await prisma.logs.create({
      data: logData
    }
    )

    return NextResponse.json(
      { message: "Successfully added matches " },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
