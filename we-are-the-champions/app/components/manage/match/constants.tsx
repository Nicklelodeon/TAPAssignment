import { z } from "zod";

export const singleMatchSchema = (
  teamNames: Set<string>,
  teamNameToGroup: Map<string, number>,
  matchesPlayed: Map<string, Set<string>>
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

      HomeTeamGoal: z.number().min(0, {
        message: "Home Team Goal must be a number greater than or equal to 0",
      }),
      AwayTeamGoal: z.number().min(0, {
        message: "Away Team Goal must be a number greater than or equal to 0",
      }),
    })
    .superRefine((data, ctx) => {
      if (data.HomeTeam === data.AwayTeam) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
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
          code: z.ZodIssueCode.custom,
          path: ["AwayTeam"],
          message: "HomeTeam and AwayTeam must be in the same group",
        });
      }
    })
    .superRefine((data, ctx) => {
      if (
        matchesPlayed.has(data.HomeTeam) && matchesPlayed.get(data.HomeTeam)?.has(data.AwayTeam) 
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["AwayTeam"],
          message: "There is an existing match between these two teams",
        });
      }
    });

export const multipleMatchSchema = (
  teamNames: Set<string>,
  teamNameToGroup: Map<string, number>,
  matchesPlayed: Map<string, Set<string>>
) =>
  z
    .object({
      teams: z.array(singleMatchSchema(teamNames, teamNameToGroup, matchesPlayed)),
    })
    .superRefine((data, ctx) => {
      const currentMatches = new Map<string, Set<string>>();
      data.teams.forEach((match, index) => {
        if (
          currentMatches.has(match.HomeTeam) &&
          currentMatches.get(match.HomeTeam)?.has(match.AwayTeam) || 
          matchesPlayed.has(match.HomeTeam) && 
          matchesPlayed.get(match.HomeTeam)?.has(match.AwayTeam)

        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "There is an existing match between these two teams",
            path: ["teams", index, "AwayTeam"],
          });
        }
        
        if (currentMatches.has(match.HomeTeam)) {
          currentMatches.get(match.HomeTeam)?.add(match.AwayTeam);
        } else {
          const newSet = new Set<string>();
          newSet.add(match.AwayTeam);
          currentMatches.set(match.HomeTeam, newSet);
        }
        if (currentMatches.has(match.AwayTeam)) {
          currentMatches.get(match.AwayTeam)?.add(match.HomeTeam);
        } else {
          const newSet = new Set<string>();
          newSet.add(match.HomeTeam);
          currentMatches.set(match.AwayTeam, newSet);
        }
      });
    })
    ;

export const matchKeys = ["Home Team", "Away Team", "Home Goals", "Away Goals"];

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
  ADD_MATCH_SUCCESS = "Successfuly added matches. Please click refetch after 5 seconds if table is not updated.",
  ADD_MATCH_FAILURE = "Error adding matches. Please try again.",
  UPDATE_MATCH_SUCCESS = "Successfuly updated match. Please click refetch after 5 seconds if table is not updated",
  UPDATE_MATCH_FAILURE = "Error updating match. Please try again.",
  DELETE_MATCH_SUCCESS = "Successfuly deleted match. Please click refetch after 5 seconds if table is not updated",
  DELETE_MATCH_FAILURE = "Error deleting match. Please try again.",
  FETCH_MATCH_SUCCESS = "Successfully fetched matches",
  FETCH_MATCH_FAILURE = "Error fetching matches",
}
