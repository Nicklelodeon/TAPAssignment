import { z } from "zod";

export interface FormTeam {
  TeamName: string;
  RegistrationDate: string;
  GroupNumber: number;
}

export interface FormMatch {
  HomeTeam: string;
  AwayTeam: string;
  HomeTeamGoal: number;
  AwayTeamGoal: number;
}

export const AllInput = (elem: string, field: any) => {
  if (elem === "TeamName") {
    return {
      type: "string",
      placeholder: "Team Name",
    };
  } else if (elem === "RegistrationDate") {
    return {
      type: "string",
      placeholder: "DD/MM",
    };
  } else if (elem === "GroupNumber") {
    return {
      type: "string",
      placeholder: "Group Number",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        field.onChange(Number(e.target.value));
      },
    };
  } else if (elem === "FirstTeam") {
    return {
      type: "string",
      placeholder: "First Team",
    };
  } else if (elem === "Second Team") {
    return {
      type: "string",
      placeholder: "Second Team",
    };
  } else if (elem === "FirstTeamGoal") {
    return {
      type: "string",
      placeholder: "First Team Goal",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        field.onChange(Number(e.target.value));
      },
    };
  } else if (elem === "SecondTeamGoal") {
    return {
      type: "string",
      placeholder: "Second Team Goal",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        field.onChange(Number(e.target.value));
      },
    };
  }
};

export const dateParser = (input: string) => {
  const [day, month] = input.split("/").map(Number);

  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return null;
  }

  return new Date(new Date().getFullYear(), month - 1, day);
};

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
      console.log(teamNameToGroup);
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

export const multipleTeamSchema = (teamNames: Set<string>) =>
  z.object({
    teams: z.array(singleTeamSchema(teamNames)),
  });
