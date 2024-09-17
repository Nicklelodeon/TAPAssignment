import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/app/utils/prisma";
import { Match } from '@prisma/client';

export interface TeamOutput {
  id: number;
  GoalsScored: number;
  GroupNumber: number;
  NormalPoints: number;
  RegistrationDate: Date;
  TeamName: string;
  TieBreakerPoints: number;
  HomeMatches: Match[],
  AwayMatches: Match[]
}

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const teamId = searchParams.get("teamId");
  
    try {
      const teamIdNumber = Number(teamId);
  
      const team = await prisma.team.findUnique({
        where: { id: teamIdNumber },
        include: {
          HomeMatches: {
            include: {
              HomeTeam: true, 
              AwayTeam: true, 
            },
          },
          AwayMatches: {
            include: {
              HomeTeam: true, 
              AwayTeam: true,
            },
          },
        },
      });   

  
      if (!team) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 });
      }
        
      return NextResponse.json(team, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }