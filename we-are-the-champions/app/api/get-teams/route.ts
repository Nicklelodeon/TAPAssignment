import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";

export async function GET() {
    try {

      const getAllTeams = await prisma.team.findMany(
        {
          orderBy: [
            {
              NormalPoints: 'desc', 
            },
            {
              GoalsScored: 'desc',
            },
            {
              TieBreakerPoints: 'desc', 
            },
            {
              RegistrationDate: 'asc', 
            },
          ],
        }
      )
      return NextResponse.json(getAllTeams, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }