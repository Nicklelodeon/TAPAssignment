import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import {
  calculatePointsForAddition,
  calculatePointsForDeletion,
} from "@/app/utils/constants";

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
    const match: updateMatch = await req.json();

    await prisma.match.update({
        where: {id: match.id},
        data: {
            HomeTeamId: match.NewHomeTeamId,
            AwayTeamId: match.NewAwayTeamId,
            HomeGoals: match.NewHomeGoals,
            AwayGoals: match.NewAwayGoals
        }
    })

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

    return NextResponse.json("successfully updated", { status: 200 });
  } catch (error) {
    console.error("Error updating teams:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
