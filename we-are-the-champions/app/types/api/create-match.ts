import { Match } from "@prisma/client"


export interface IAPICreateMatchInput {
    matches:  Omit<Match, "id">[]
}

export const checkIAPICreateMatchInput = (payload: IAPICreateMatchInput) => { 
    if (!Array.isArray(payload.matches)) {
        return false;
    }
    for (const match of payload.matches) {
        if (!Object.values(match).every(x => x !== undefined && x >= 0)) {
            return false;
        }
        
    }
    return true;
}