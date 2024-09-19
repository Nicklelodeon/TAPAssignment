import { Logs, User } from "@prisma/client";


export interface LogsWithForeignKey extends Logs {
    User: User
}

export const logKeys = [
    "User Name",
    "Message",
    "Date",
    "LogType"
]

