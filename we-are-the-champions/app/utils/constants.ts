import { Team } from "@prisma/client";
import { getToken} from "next-auth/jwt";
import { NextRequest } from "next/server";
import { MatchWithForeignKey } from "../components/manage/match/constants";


export interface TeamWithForeignKey extends Team {
    HomeMatches?: MatchWithForeignKey[],
    AwayMatches?: MatchWithForeignKey[]
  }
  
export const calculatePointsForDeletion = (goalsScored: number, goalsConceded: number) => {
    if (goalsScored === goalsConceded) {
        return [-1, -3];
    } else if (goalsScored > goalsConceded) {
        return [-3, -5];
    } else {
        return [0, -1];
    }
}

export const calculatePointsForAddition = (goalsScored: number, goalsConceded: number) => {
    if (goalsScored === goalsConceded) {
        return [1, 3];
    } else if (goalsScored > goalsConceded) {
        return [3, 5];
    } else {
        return [0, 1];
    }
}


export const dateParser = (input: string) => {
    const [day, month] = input.split("/").map(Number);

    if (day < 1 || day > 31 || month < 1 || month > 12) {
        return null;
    }

    return new Date(new Date().getFullYear(), month - 1, day);
};

export const checkToken = async (req: NextRequest) => {
    const token = await getToken({ req });
    if (!token) {
        return null;
    }
    const userId = token?.userId;
    const username = token?.name;
    return { userId, username }
}


export interface LogUpdateTeam {
    OldTeamName: string,
    OldTeamRegistrationDate: string,
    NewTeamName: string,
    NewTeamRegistrationDate: string
}

export interface LogUpdateMatch {
    OldHomeTeam: string,
    OldAwayTeam: string,
    oldHomeTeamGoals: string,
    oldAwayTeamGoals: string,
    newHomeTeam: string,
    newAwayTeam: string,
    newHomeTeamGoals: string,
    newAwayTeamGoals: string
}

export const craftLogMessage = (objectType: ObjectType, logType: LogType, data: { [key: string]: string }[], username: string, date: Date) => {
    // handle update logs separately
    if (logType === LogType.LOG_UPDATE) {
        if (objectType === ObjectType.MATCH) {
            const matchesArray = data.map(({ OldHomeTeam,
                OldAwayTeam,
                OldHomeTeamGoals,
                OldAwayTeamGoals,
                NewHomeTeam,
                NewAwayTeam,
                NewHomeTeamGoals,
                NewAwayTeamGoals }) => {
                return `${OldHomeTeam}: ${OldHomeTeamGoals} vs ${OldAwayTeam}: ${OldAwayTeamGoals} updated to ${NewHomeTeam}: ${NewHomeTeamGoals} vs ${NewAwayTeam}: ${NewAwayTeamGoals}`;
            });
            const matchesString = matchesArray.join(", ");
            return `${objectType}: (${matchesString}) have been ${logType} by ${username} on ${date}`
        } else {
            const teamArray = data.map(({ OldTeamName,
                OldTeamRegistrationDate,
                NewTeamName,
                NewTeamRegistrationDate,
                GroupNumber }) => {
                return `${OldTeamName}: ${OldTeamRegistrationDate} updated to ${NewTeamName}: ${NewTeamRegistrationDate} in group ${GroupNumber}`;
            });
            const teamNames = teamArray.join(", ");
            return `${objectType}: (${teamNames}) have been ${logType} by ${username} on ${date}`
        }
    }
    if (objectType === ObjectType.MATCH) {
        const matchesArray = data.map(({ homeTeamName, awayTeamName }) => {
            return `${homeTeamName} vs ${awayTeamName}`;
        });
        const matchesString = matchesArray.join(", ");
        return `${objectType}: (${matchesString}) have been ${logType} by ${username} on ${date}`
    } else {
        const teamArray = data.map(({ TeamName }) => {
            return `${TeamName}`;
        });
        const teamNames = teamArray.join(", ");
        return `${objectType}: (${teamNames}) have been ${logType} by ${username} on ${date}`
    }


}

export enum ObjectType {
    TEAM = "Team",
    MATCH = "Matches"
}

export enum LogType {
    LOG_CREATE = "CREATED",
    LOG_DELETE = "DELETED",
    LOG_UPDATE = "UPDATED"
}
