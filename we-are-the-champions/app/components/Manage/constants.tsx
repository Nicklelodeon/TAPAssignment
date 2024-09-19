import { Match, Team } from "@prisma/client";
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

export interface IInitialFormProps {
  onSubmit: (formData: { inputText: string }) => void;
  textPlaceholder: string;
  schema: Zod.ZodTypeAny;
}


export enum FormStatus {
  ADD_BUTTON = "Add Button",
  INITIAL_FORM = "Initial Form",
  PROCESSED_FORM = "Processed Form"
}

export interface IProcessedFormProps {
  objectArray: TeamForm[] | MatchForm[];
  setFormStatus: (value: FormStatus) => void;
  refetch: () => void;
  schema: Zod.ZodTypeAny;
  defaultValue: TeamForm | MatchForm;
  checkGroupSize?: boolean;
  data?: Team[] | Match[];
  onSubmitSecondForm: (results: { [x: string]: TeamForm[] | MatchForm[] }) => Promise<void>;
}

export const initialFormSchemaTeam = z.object({
  inputText: z
    .string()
    .min(1, "Input is required")
    .refine((value) => {
      const lines = value.trim().split("\n");
      return lines.every((line) => {
        const parts = line.trim().split(/\s+/);
        return parts.length === 3;
      });
    }, {
      message:
        "Each line must follow the format: <Team name> <DD/MM> <Group number>, with exactly one space between each part and each team on a new line.",
    })
});

export const initialFormSchemaMatches = z.object({
  inputText: z
    .string()
    .min(1, "Input is required")
    .refine((value) => {
      const lines = value.trim().split("\n");
      return lines.every((line) => {
        const parts = line.trim().split(/\s+/);
        return parts.length === 4;
      });
    }, {
      message:
        "Each line must follow the format: <Home Team name> <Away Team Name> <Home Team Goals Scored> <Away Team Goals Scored> with exactly one space between each part and each match on a new line.",
    })
});


export const AllInput = (elem: string, field: any) => {
  if (elem === "HomeTeamGoal" || elem === "AwayTeamGoal" || elem === "GroupNumber") {
    return {
      type: "number",
      placeholder: `${elem.replace(/([A-Z])/g, ' $1')}`,
      value: field.value === undefined || field.value === null ? '' : field.value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsedValue = e.target.value === '' ? undefined : Number(e.target.value);
        field.onChange(parsedValue);
      },
    };
  } else {
    return {
      type: "text",
      placeholder: elem.replace(/([A-Z])/g, ' $1'),
    };
  }
};





