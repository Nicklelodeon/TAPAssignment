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





