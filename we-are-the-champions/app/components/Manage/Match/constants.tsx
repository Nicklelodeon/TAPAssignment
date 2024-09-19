import { z } from "zod";

export const singleMatchSchema = (
  teamNames: Set<string>,
  teamNameToGroup: Map<string, number>
) =>
  z
    .object({
      HomeTeam: z
        .string()
        .min(1, "Team name is required")
        .refine((value) => teamNames.has(value), {
          message: "There is no existing team with this name",
        }),

      AwayTeam: z
        .string()
        .min(1, "Team name is required")
        .refine((value) => teamNames.has(value), {
          message: "There is no existing team with this name",
        }),

      HomeTeamGoal: z.number().min(0, { message: "Home Team Goal must be a number greater than or equal to 0" }),
      AwayTeamGoal: z.number().min(0, { message: "Away Team Goal must be a number greater than or equal to 0" }),
    })
    .superRefine((data, ctx) => {
      if (data.HomeTeam === data.AwayTeam) {
        ctx.addIssue({
          code: "custom",
          path: ["AwayTeam"],
          message: "HomeTeam and AwayTeam cannot be the same team",
        });
      }
    })
    .superRefine((data, ctx) => {
      if (
        teamNameToGroup.get(data.HomeTeam) !==
        teamNameToGroup.get(data.AwayTeam)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["AwayTeam"],
          message: "HomeTeam and AwayTeam must be in the same group",
        });
      }
    });

export const multipleMatchSchema = (
  teamNames: Set<string>,
  teamNameToGroup: Map<string, number>
) =>
  z.object({
    teams: z.array(singleMatchSchema(teamNames, teamNameToGroup)),
  });

export const matchKeys = [
  "Home Team",
  "Away Team",
  "Home Goals",
  "Away Goals"
]


export interface MatchWithForeignKey {
  id: number;
  AwayGoals: number;
  AwayTeamId: number;
  HomeGoals: number;
  HomeTeamId: number;
  HomeTeam: { TeamName: string };
  AwayTeam: { TeamName: string };
}

export enum MatchMessage {
  ADD_MATCH_SUCCESS = "Successfuly added matches. Please click refetch after 5 seconds",
  ADD_MATCH_FAILURE = "Error adding matches. Please try again.",
  UPDATE_MATCH_SUCCESS = "Successfuly updated match. Please click refetch after 5 seconds",
  UPDATE_MATCH_FAILURE = "Error updating match. Please try again.",
  DELETE_MATCH_SUCCESS = "Successfuly deleted match. Please click refetch after 5 seconds",
  DELETE_MATCH_FAILURE = "Error deleting match. Please try again."

}