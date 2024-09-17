import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { TeamForm } from "@/app/components/Manage/constants";
import { Team } from "@prisma/client";
import { dateParser } from "@/app/utils/constants";

export async function POST(req: NextRequest) {
    try {
      const {teams} = await req.json();
      
      const schemaTeams: Team[] = teams.map((team: TeamForm) => (
        {
            TeamName: team.TeamName,
            GroupNumber: team.GroupNumber,
            RegistrationDate: dateParser(team.RegistrationDate),
            GoalsScored: 0,
            NormalPoints: 0,
            TieBreakerPoints: 0
        }
      ))

      if (!Array.isArray(schemaTeams)) {
        return NextResponse.json({ message: "Invalid data format" }, { status: 400 });
      }
      
      await prisma.team.createMany({
        data: schemaTeams
      })
      
      return NextResponse.json({ message: "Successfully added teams " }, { status: 200 });
  
    } catch (error) {
      console.error("Error updating teams:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }