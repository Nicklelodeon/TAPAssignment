import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { Team } from "@prisma/client";

export async function PUT(req: NextRequest) {
  try {
    const team: Team = await req.json();
    
    const updateTeam = await prisma.team.update({
      where: { id: team.id },
      data: team,
    });

    return NextResponse.json(updateTeam, { status: 200 });
  } catch (error) {
    console.error("Error updating teams:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
