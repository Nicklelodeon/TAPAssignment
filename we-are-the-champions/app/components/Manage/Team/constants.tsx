import { dateParser } from "@/app/utils/constants";
import { z } from "zod";


// used to restrict editing of group number for edits
export const singleTeamSchemaWithoutGroupNumber = (teamNames: Set<string>) =>
  z.object({
    TeamName: z
      .string()
      .min(1, "Team name is required")
      .refine((value) => !teamNames.has(value), {
        message: "There is an existing team with this name",
      }),
    RegistrationDate: z
      .string()
      .regex(/^\d{2}\/\d{2}$/, "Date must be in DD/MM format")
      .refine((value) => dateParser(value) !== null, {
        message: "Date is invalid",
      })
      .refine((value) => dateParser(value)! < new Date(), {
        message: "Date cannot be greater than todays date",
      }),
  });


export const singleTeamSchema = (teamNames: Set<string>) =>
  z.object({
    TeamName: z
      .string()
      .min(1, "Team name is required")
      .refine((value) => !teamNames.has(value), {
        message: "There is an existing team with this name",
      }),
    RegistrationDate: z
      .string()
      .regex(/^\d{2}\/\d{2}$/, "Date must be in DD/MM format")
      .refine((value) => dateParser(value) !== null, {
        message: "Date is invalid",
      })
      .refine((value) => dateParser(value)! < new Date(), {
        message: "Date cannot be greater than todays date",
      }),
    GroupNumber: z
      .number()
      .int()
      .positive()
      .refine((value) => value <= 2 && value > 0, {
        message: "Group Number can only be 1 or 2",
      }),
  });

export const multipleTeamSchema = (teamNames: Set<string>) =>
  z.object({
    teams: z.array(singleTeamSchema(teamNames)),
  })
    .superRefine((data, ctx) => {
      const teamNamesInInput = new Set<string>();

      data.teams.forEach((team, index) => {
        if (teamNamesInInput.has(team.TeamName)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Team names submitted must be unique",
            path: ["teams", index, "TeamName"],
          });
        }
        teamNamesInInput.add(team.TeamName);
      })
    }
    );


export const teamKeys = [
  "Ranking",
  "Name",
  "Registration Date",
  "Group",
  "Normal Points",
  "Goals Scored",
  "Tie Breaker Points"];

export enum TeamMessage {
  ADD_TEAM_SUCCESS = "Successfuly added teams. Please click refetch after 5 seconds",
  ADD_TEAM_FAILURE = "Error adding team. Please try again.",
  UPDATE_TEAM_SUCCESS = "Successfuly updated team. Please click refetch after 5 seconds",
  UPDATE_TEAM_FAILURE = "Error updating team. Please try again.",
  DELETE_TEAM_SUCCESS = "Successfuly deleted team. Please click refetch after 5 seconds",
  DELETE_TEAM_FAILURE = "Error deleting team. Please try again."

}