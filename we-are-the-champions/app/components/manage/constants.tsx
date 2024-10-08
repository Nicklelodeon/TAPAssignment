import { UseFormSetError } from "react-hook-form";
import { z } from "zod";

export interface TeamForm {
  TeamName: string;
  RegistrationDate: string;
  GroupNumber: number;
}

export interface MatchForm {
  HomeTeam: string;
  AwayTeam: string;
  HomeTeamGoal: number;
  AwayTeamGoal: number;
}

export interface IFormatValidationFormProps {
  onSubmit: (formData: { inputText: string }) => void;
  textPlaceholder: string;
  schema: Zod.ZodTypeAny;
  inputLineLength: number;
}

export enum FormStatus {
  ADD_BUTTON = "Add Button",
  INITIAL_FORM = "Initial Form",
  PROCESSED_FORM = "Processed Form",
}

export interface IInputValidationFormProps {
  objectArray: TeamForm[] | MatchForm[];
  setFormStatus: (value: FormStatus) => void;
  schema: Zod.ZodTypeAny;
  defaultValue: TeamForm | MatchForm;
  formName: string;
  onSubmitInputValidationForm: (results: {
    teams: TeamForm[] | MatchForm[];
  }, setError: UseFormSetError<any>) => Promise<void>;
}

export const FormatValidationFormSchemaTeams = z.object({
  inputText: z
    .string()
    .min(1, "Input is required")
    .refine(
      (value) => {
        const lines = value.trim().split("\n");
        return lines.every((line) => {
          const parts = line.trim().split(/\s+/);
          return parts.length === 3;
        });
      },
      {
        message:
          "Each line must follow the format: <Team name> <DD/MM> <Group number>, with exactly one space between each part and each team on a new line.",
      }
    ),
});

export const FormatValidationFormSchemaMatches = z.object({
  inputText: z
    .string()
    .min(1, "Input is required")
    .refine(
      (value) => {
        const lines = value.trim().split("\n");
        return lines.every((line) => {
          const parts = line.trim().split(/\s+/);
          return parts.length === 4;
        });
      },
      {
        message:
          "Each line must follow the format: <Home Team name> <Away Team Name> <Home Team Goals Scored> <Away Team Goals Scored> with exactly one space between each part and each match on a new line.",
      }
    ),
});

export const AllInput = (elem: string, field: any) => {
  if (
    elem === "HomeTeamGoal" ||
    elem === "AwayTeamGoal" ||
    elem === "GroupNumber"
  ) {
    return {
      type: "number",
      placeholder: `${elem.replace(/([A-Z])/g, " $1")}`,
      value: field.value === undefined ? "" : field.value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const parsedValue = value === "" ? "" : Number(value);
        field.onChange(parsedValue);
      },
    };
  } else {
    return {
      type: "text",
      placeholder: elem.replace(/([A-Z])/g, " $1"),
    };
  }
};
