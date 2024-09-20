import { Team } from "@prisma/client";


export interface IAPICreateTeamInput {
    teams:  Omit<Team, "id">[]
}

export const checkIAPICreateTeamInput = (payload: IAPICreateTeamInput) => { 
    if (!Array.isArray(payload.teams)) {
        return false;
    }
    for (const team of payload.teams) {
        if (!Object.values(team).every(x => x !== undefined)) {
            return false;
        }
        if (team.GoalsScored < 0 || team.GroupNumber <= 0 || team.GroupNumber > 2 || team.NormalPoints < 0 || team.TieBreakerPoints < 0) {
            return false;
        }
    }
    return true;
}