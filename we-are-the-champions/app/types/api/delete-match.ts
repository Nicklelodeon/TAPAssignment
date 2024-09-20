import { MatchWithForeignKey } from "@/app/components/manage/match/constants";

export interface IAPIDeleteMatchInput {
  match: MatchWithForeignKey;
}

export const checkIAPIDeleteMatchInput = (payload: IAPIDeleteMatchInput) => {
  if (!payload.match) {
    return false;
  }
  const match = payload.match;
  if (!Object.values(match).every((x) => x !== undefined)) {
    return false;
  }

  if (match.id < 0 || match.AwayGoals < 0 || match.AwayTeamId < 0 || match.HomeGoals < 0 || match.HomeTeamId < 0) {
    return false;
  }

  return true;
};
