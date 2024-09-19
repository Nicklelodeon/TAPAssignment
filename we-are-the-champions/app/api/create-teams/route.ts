import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { TeamForm } from "@/app/components/manage/constants";
import { Logs, Team } from "@prisma/client";
import { checkToken, craftLogMessage, dateParser, LogType, ObjectType } from "@/app/utils/constants";

export async function POST(req: NextRequest) {
  try {
    const token = await checkToken(req);
    if (!token) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }
    const userId = token?.userId;
    const username = token?.username;
    const teams = await req.json();

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
      data: schemaTeams,
    },
    );

    const insertedTeams = await prisma.team.findMany({
      where: {
        TeamName: {
          in: schemaTeams.map(team => team.TeamName),
        },
      },
      select: {
        TeamName: true,
      },
    });

    const currentDate = new Date();
    const logMessage = craftLogMessage(ObjectType.TEAM, LogType.LOG_CREATE, insertedTeams, username!, currentDate);
    const logData: Omit<Logs, "id"> = {
      Message: logMessage,
      UserId: userId as string,
      LogType: `${LogType.LOG_CREATE} ${ObjectType.TEAM}`,
      Date: currentDate

    }

    await prisma.logs.create({
      data: logData
      }
    )


    return NextResponse.json({ message: "Successfully added teams " }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}