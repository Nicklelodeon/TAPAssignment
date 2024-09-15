import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { calculatePointsForAddition } from "@/app/utils/constants";

export async function POST(req: NextRequest) {
  try {
    const matches = await req.json();
    if (!Array.isArray(matches)) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    await prisma.match.createMany({
      data: matches,
    });
    const teamUpdates = matches.map((match) => {
      const [normalPointsHomeTeam, tieBreakerPointsHomeTeam] =
        calculatePointsForAddition(match.HomeGoals, match.AwayGoals);
      const [normalPointsAwayTeam, tieBreakerPointsAwayTeam] =
        calculatePointsForAddition(match.AwayGoals, match.HomeGoals);

      const updateHomeTeam = prisma.team.update({
        where: { id: match.HomeTeamId },
        data: {
          NormalPoints: { increment: normalPointsHomeTeam },
          TieBreakerPoints: { increment: tieBreakerPointsHomeTeam }, 
          GoalsScored: { increment: match.HomeGoals }, 
        },
      });

      const updateAwayTeam = prisma.team.update({
        where: { id: match.AwayTeamId },
        data: {
          NormalPoints: { increment: normalPointsAwayTeam }, 
          TieBreakerPoints: { increment: tieBreakerPointsAwayTeam },
          GoalsScored: { increment: match.AwayGoals }, 
        },
      });

      return Promise.all([updateHomeTeam, updateAwayTeam]);
    });

    await Promise.all(teamUpdates);

    return NextResponse.json(
      { message: "Successfully added matches " },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating teams:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
