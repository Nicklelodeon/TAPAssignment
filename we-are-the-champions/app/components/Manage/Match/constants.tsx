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
  
        HomeTeamGoal: z.number().int().nonnegative(),
        AwayTeamGoal: z.number().int().nonnegative(),
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
    