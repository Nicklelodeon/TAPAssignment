export interface IUpdateMatch {
  id: number;
  HomeTeamId: number;
  AwayTeamId: number;
  HomeGoals: number;
  AwayGoals: number;
  NewHomeTeamId: number;
  NewAwayTeamId: number;
  NewHomeGoals: number;
  NewAwayGoals: number;
}

export interface IAPIUpdateMatchInput {
  match: IUpdateMatch;
}

export const checkIAPIUpdateMatchInput = (payload: IAPIUpdateMatchInput) => {
  if (!payload.match) {
    return false;
  }
  const match = payload.match;
  if (!Object.values(match).every((x) => x !== undefined && x >= 0)) {
    return false;
  }

  return true;
};
