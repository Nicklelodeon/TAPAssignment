import {NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";


export async function GET() {
    try {

      const getAllTeams = await prisma.match.findMany()
      return NextResponse.json(getAllTeams, { status: 200 });
  
    } catch (error) {
      console.error("Error updating teams:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  }