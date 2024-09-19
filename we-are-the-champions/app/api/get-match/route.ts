import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";


export async function GET() {
  try {

    const getAllTeams = await prisma.match.findMany({
      orderBy: [
        {
          id: 'desc', 
        },
      ],
      include: {
        AwayTeam: {
          select: {
            TeamName: true,
          },
        },
        HomeTeam: {
          select: {
            TeamName: true, 
          },
        },
      },
    }); return NextResponse.json(getAllTeams, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}