import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { Match } from "@prisma/client";
import { calculatePointsForDeletion } from "@/app/utils/constants";

export async function DELETE(req: NextRequest) {
  try {
    const match: Match = await req.json();

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
        NormalPoints: { increment: normalPointsHomeTeam }, // Add normal points
        TieBreakerPoints: { increment: tieBreakerPointsHomeTeam }, // Add tiebreaker points
        GoalsScored: { decrement: match.HomeGoals }, // Add goals scored by home team
      },
    });

    const updateAwayTeam = prisma.team.update({
      where: { id: match.AwayTeamId },
      data: {
        NormalPoints: { increment: normalPointsAwayTeam }, // Add normal points
        TieBreakerPoints: { increment: tieBreakerPointsAwayTeam }, // Add tiebreaker points
        GoalsScored: { decrement: match.AwayGoals }, // Add goals scored by away team
      },
    });

    await Promise.all([deleteMatch, updateHomeTeam, updateAwayTeam]);
    return NextResponse.json("update successful", { status: 200 });
  } catch (error) {
    console.error("Error updating teams:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
