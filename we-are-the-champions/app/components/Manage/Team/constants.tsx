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
    });

    export const teamKeys = ["Name",
        "Registration Date",
        "Group",
        "Goals Scored",
        "Normal Points",
        "Tie Breaker Points"];