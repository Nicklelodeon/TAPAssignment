import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { Logs} from "@prisma/client";
import {
  checkToken,
  craftLogMessage,
  LogType,
  ObjectType,
} from "@/app/utils/constants";
import { IAPICreateTeamInput } from "@/app/types/api/create-team";
import { checkIAPICreateTeamInput } from "@/app/types/api/create-team";

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
    const payload: IAPICreateTeamInput = await req.json();
    if (!checkIAPICreateTeamInput(payload)) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }
    const teams = payload.teams;

    await prisma.team.createMany({
      data: teams,
    });

    const insertedTeams = await prisma.team.findMany({
      where: {
        TeamName: {
          in: teams.map((team) => team.TeamName),
        },
      },
      select: {
        TeamName: true,
      },
    });

    const currentDate = new Date();
    const logMessage = craftLogMessage(
      ObjectType.TEAM,
      LogType.LOG_CREATE,
      insertedTeams,
      username!,
      currentDate
    );
    const logData: Omit<Logs, "id"> = {
      Message: logMessage,
      UserId: userId as string,
      LogType: `${LogType.LOG_CREATE} ${ObjectType.TEAM}`,
      Date: currentDate,
    };

    await prisma.logs.create({
      data: logData,
    });

    return NextResponse.json(
      { message: "Successfully added teams " },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
