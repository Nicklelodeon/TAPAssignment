import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import {
  calculatePointsForAddition,
  calculatePointsForDeletion,
  checkToken,
  craftLogMessage,
  LogType,
  ObjectType,
} from "@/app/utils/constants";
import { Logs } from "@prisma/client";

interface updateMatch {
  id: number;
  HomeTeamId: number;
  AwayTeamId: number;
  HomeGoals: number;
  AwayGoals: number;
  NewHomeTeamId: number;
  NewAwayTeamId: number;
  NewHomeGoals: number;
  NewAwayGoals: number;
}

export async function PUT(req: NextRequest) {
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
    const match: updateMatch = await req.json();

    const oldMatchData = await prisma.match.findUnique({
      where: { id: match.id },
      select: {
        HomeTeam: {
          select: { TeamName: true },
        },
        AwayTeam: {
          select: { TeamName: true },
        },
        HomeGoals: true,
        AwayGoals: true,
      },
    });

    await prisma.match.update({
      where: { id: match.id },
      data: {
        HomeTeamId: match.NewHomeTeamId,
        AwayTeamId: match.NewAwayTeamId,
        HomeGoals: match.NewHomeGoals,
        AwayGoals: match.NewAwayGoals
      }
    })

    const newMatchData = await prisma.match.findUnique({
      where: { id: match.id },
      select: {
        HomeTeam: {
          select: { TeamName: true },
        },
        AwayTeam: {
          select: { TeamName: true },
        },
        HomeGoals: true,
        AwayGoals: true,
      },
    });

    const updateMatchesArray = [
      {
        OldHomeTeam: oldMatchData?.HomeTeam.TeamName ?? "",
        OldAwayTeam: oldMatchData?.AwayTeam.TeamName ?? "",
        OldHomeTeamGoals: String(oldMatchData?.HomeGoals),
        OldAwayTeamGoals: String(oldMatchData?.AwayGoals),
        NewHomeTeam: newMatchData?.HomeTeam.TeamName ?? "",
        NewAwayTeam: newMatchData?.AwayTeam.TeamName ?? "",
        NewHomeTeamGoals: String(newMatchData?.HomeGoals),
        NewAwayTeamGoals: String(newMatchData?.AwayGoals)
      }
    ];

    //remove original
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
      select: {
        TeamName: true,
      }
    });

    const updateAwayTeam = prisma.team.update({
      where: { id: match.AwayTeamId },
      data: {
        NormalPoints: { increment: normalPointsAwayTeam },
        TieBreakerPoints: { increment: tieBreakerPointsAwayTeam },
        GoalsScored: { decrement: match.AwayGoals },
      },
    });

    await Promise.all([updateHomeTeam, updateAwayTeam]);

    //add new
    const [normalPointsNewHomeTeam, tieBreakerPointsNewHomeTeam] =
      calculatePointsForAddition(match.NewHomeGoals, match.NewAwayGoals);
    const [normalPointsNewAwayTeam, tieBreakerPointsNewAwayTeam] =
      calculatePointsForAddition(match.NewAwayGoals, match.NewHomeGoals);
    const updateNewHomeTeam = prisma.team.update({
      where: { id: match.NewHomeTeamId },
      data: {
        NormalPoints: { increment: normalPointsNewHomeTeam },
        TieBreakerPoints: { increment: tieBreakerPointsNewHomeTeam },
        GoalsScored: { increment: match.NewHomeGoals },
      },
    });

    const updateNewAwayTeam = prisma.team.update({
      where: { id: match.NewAwayTeamId },
      data: {
        NormalPoints: { increment: normalPointsNewAwayTeam },
        TieBreakerPoints: { increment: tieBreakerPointsNewAwayTeam },
        GoalsScored: { increment: match.NewAwayGoals },
      },
    });
    await Promise.all([updateNewHomeTeam, updateNewAwayTeam]);

    const currentDate = new Date();
    const logMessage = craftLogMessage(ObjectType.MATCH, LogType.LOG_UPDATE, updateMatchesArray, username!, currentDate);
    const logData: Omit<Logs, "id"> = {
      Message: logMessage,
      UserId: userId as string,
      LogType: `${LogType.LOG_UPDATE} ${ObjectType.MATCH}`,
      Date: currentDate

    }

    await prisma.logs.create({
      data: logData
    }
    )

    return NextResponse.json("successfully updated", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
