import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { checkToken, craftLogMessage, LogType, ObjectType } from "@/app/utils/constants";
import { Logs } from "@prisma/client";

export async function DELETE(req: NextRequest) {
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
    const id = await req.json();

    const teamName = await prisma.team.findUnique({
      where: {id: id},
      select: {
        TeamName: true
      }
    });

    const teamNamesArray = [teamName ?? {TeamName: ""}]

    const updateTeam = await prisma.team.delete({
      where: { id: id },
    });

    const currentDate = new Date();
    const logMessage = craftLogMessage(ObjectType.TEAM, LogType.LOG_DELETE, teamNamesArray, username!, currentDate);
    const logData: Omit<Logs, "id"> = {
      Message: logMessage,
      UserId: userId as string,
      LogType: `${LogType.LOG_DELETE} ${ObjectType.TEAM}`,
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
