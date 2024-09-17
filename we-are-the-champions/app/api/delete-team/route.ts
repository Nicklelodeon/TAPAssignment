import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const id = await req.json();
    
    const updateTeam = await prisma.team.delete({
      where: { id: id },
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
