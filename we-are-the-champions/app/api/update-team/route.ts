import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { Logs, Team } from "@prisma/client";
import { checkToken, craftLogMessage, LogType, ObjectType } from "@/app/utils/constants";

export async function PUT(req: NextRequest) {
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
    const team: Team = await req.json();

    const oldTeam = await prisma.team.findUnique({
      where: { id: team.id },
      select: {
        TeamName: true,
        RegistrationDate: true,
      }
    })

    const updateTeam = await prisma.team.update({
      where: { id: team.id },
      data: team,
      select: {
        TeamName: true,
        RegistrationDate: true,
        GroupNumber: true
      }
    });

    const teamNamesArray = [
      {
        OldTeamName: oldTeam?.TeamName ?? "", 
        OldTeamRegistrationDate: oldTeam?.RegistrationDate.toDateString() ?? "",
        NewTeamName: updateTeam.TeamName,
        NewTeamRegistrationDate: updateTeam.RegistrationDate.toDateString() ?? "",
        GroupNumber: String(updateTeam.GroupNumber)
  
      }
    ]

    const currentDate = new Date();
    const logMessage = craftLogMessage(ObjectType.TEAM, LogType.LOG_UPDATE, teamNamesArray, username!, currentDate);
    const logData: Omit<Logs, "id"> = {
      Message: logMessage,
      UserId: userId as string,
      LogType: `${LogType.LOG_UPDATE} ${ObjectType.TEAM}`,
      Date: currentDate

    }

    await prisma.logs.create({
      data: logData
    }
    )

    return NextResponse.json(updateTeam, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
