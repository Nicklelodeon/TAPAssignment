
export interface IAPIDeleteTeamInput {
  teamId: number
}

export const checkIAPIDeleteTeamInput = (payload: IAPIDeleteTeamInput) => {
  if (payload.teamId === undefined || payload.teamId < 0) {
    return false;
  }

  return true;
};
