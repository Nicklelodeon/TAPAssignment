

export interface IUpdateTeam {
    id: number;
    TeamName: string;
    RegistrationDate: Date;
  }


  export interface IAPIUpdateTeamInput {
    team: IUpdateTeam
  }
  
  export const checkIAPIUpdateTeamInput = (payload: IAPIUpdateTeamInput) => {
    const team = payload.team;
    if (!Object.values(team).every(x => x !== undefined)) {
        return false;
    }
    if (team.id < 0) {
      return false;
    }
  
    return true;
  };
