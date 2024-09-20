"use client";

import { useContext, useEffect, useState } from "react";

import { FormatValidationForm } from "../FormatValidationForm";
import { InputValidationForm } from "../InputValidationForm";
import {
  FormStatus,
  FormatValidationFormSchemaTeams,
  MatchForm,
  TeamForm,
} from "../constants";
import { TeamContext } from "@/app/utils/context";
import toast from "react-hot-toast";
import { multipleTeamSchema, TeamMessage } from "./constants";
import { Box, Button, Flex } from "@chakra-ui/react";
import { Team } from "@prisma/client";
import { dateParser } from "@/app/utils/constants";
import { IAPICreateTeamInput } from "@/app/types/api/create-team";
import { UseFormSetError } from "react-hook-form";

export const CreateTeamForm = () => {
  const [formStatus, setFormStatus] = useState<FormStatus>(
    FormStatus.ADD_BUTTON
  );
  const [teams, setTeams] = useState<TeamForm[]>([]);
  const { data, teamNames, refetch } = useContext(TeamContext);
  useEffect(() => {
    if (teams.length > 0) {
      setFormStatus(FormStatus.PROCESSED_FORM);
    }
  }, [teams, setTeams]);

  const onSubmitFormatValidationForm = (data: { inputText: string }) => {
    const rows = data.inputText.trim().split("\n");
    const allTeams: TeamForm[] = [];

    for (const row of rows) {
      const parts = row.split(" ");
      for (let i = 0; i < parts.length; i += 3) {
        if (i + 2 < parts.length) {
          allTeams.push({
            TeamName: parts[i],
            RegistrationDate: parts[i + 1],
            GroupNumber: parseInt(parts[i + 2], 10),
          });
        }
      }
    }

    setTeams(allTeams);
  };

  const validateFormSchema = multipleTeamSchema(teamNames);
  const defaultValue = { TeamName: "", RegistrationDate: "", GroupNumber: 1 };

  const onSubmitInputValidationForm = async (
    results: {
      teams: TeamForm[] | MatchForm[];
    },
    setError: UseFormSetError<any>
  ) => {
    const teamData = data as Team[];
    const teamForms = results.teams as TeamForm[];
    const groupOneCount =
      teamData.filter((x) => x.GroupNumber === 1).length +
      teamForms.filter((x: TeamForm) => x.GroupNumber === 1).length;
    const groupTwoCount =
      teamData.filter((x) => x.GroupNumber === 2).length +
      teamForms.filter((x: TeamForm) => x.GroupNumber === 2).length;

    if (groupOneCount > 6) {
      setError("teams", {
        type: "manual",
        message: `Group 1 will have more than 6 teams (${groupOneCount} total)`,
      });
      return;
    }

    if (groupTwoCount > 6) {
      setError("teams", {
        type: "manual",
        message: `Group 2 will have more than 6 teams (${groupTwoCount} total)`,
      });
      return;
    }
    const teams: Omit<Team, "id">[] = teamForms.map((team: TeamForm) => ({
      TeamName: team.TeamName,
      GroupNumber: team.GroupNumber,
      RegistrationDate: dateParser(team.RegistrationDate) ?? new Date(),
      GoalsScored: 0,
      NormalPoints: 0,
      TieBreakerPoints: 0,
    }));
    const payload: IAPICreateTeamInput = {
      teams,
    };
    try {
      const response = await fetch("/api/create-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || TeamMessage.ADD_TEAM_FAILURE);
        return;
      }
      toast.success(TeamMessage.ADD_TEAM_SUCCESS);
      refetch();
      setFormStatus(FormStatus.ADD_BUTTON);
    } catch {
      toast.error(TeamMessage.ADD_TEAM_FAILURE);
    }
  };
  return (
    <Box>
      {formStatus === FormStatus.ADD_BUTTON ? (
        <Flex align="center" justifyContent="center">
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => setFormStatus(FormStatus.INITIAL_FORM)}
          >
            Create Team
          </Button>
        </Flex>
      ) : formStatus === FormStatus.INITIAL_FORM ? (
        <FormatValidationForm
          onSubmit={onSubmitFormatValidationForm}
          textPlaceholder="Enter your teams here..."
          schema={FormatValidationFormSchemaTeams}
          inputLineLength={3}
        />
      ) : (
        <InputValidationForm
          objectArray={teams}
          setFormStatus={setFormStatus}
          schema={validateFormSchema}
          defaultValue={defaultValue}
          formName="Team"
          onSubmitInputValidationForm={onSubmitInputValidationForm}
        />
      )}
    </Box>
  );
};
