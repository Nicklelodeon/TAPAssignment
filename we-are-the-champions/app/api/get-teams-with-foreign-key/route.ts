

import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { TeamWithForeignKey } from "@/app/utils/constants";

export async function GET() {
    try {

        const getAllTeams: TeamWithForeignKey[] = await prisma.team.findMany(
            {
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
