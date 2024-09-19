
import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";


export async function GET() {
    try {

        const getAllLogs = await prisma.logs.findMany({
            include: {
                User: {
                    select: {
                        name: true,
                    },
                },
            },
        }); 
        return NextResponse.json(getAllLogs, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}