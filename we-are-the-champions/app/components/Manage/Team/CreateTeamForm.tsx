"use client";

import { useContext, useEffect, useState } from "react";

import { InitialForm } from "../InitialForm";
import { ProcessedForm } from "../ProcessedForm";
import { FormStatus, initialFormSchemaTeam, MatchForm, TeamForm } from "../constants";
import { TeamContext } from "@/app/utils/context";
import toast from "react-hot-toast";
import { multipleTeamSchema, TeamMessage } from "./constants";
import { Box, Button, Flex } from "@chakra-ui/react";

export const CreateTeamForm = () => {
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.ADD_BUTTON);
  const [teams, setTeams] = useState<TeamForm[]>([]);
  const { data, teamNames, refetch } = useContext(TeamContext);
  useEffect(() => {
    if (teams.length > 0) {
      setFormStatus(FormStatus.PROCESSED_FORM)
    }
  }, [teams, setTeams]);
  const onSubmitInitialForm = (data: { inputText: string }) => {
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

  const initialFormSchema = initialFormSchemaTeam;
  const validateFormSchema = multipleTeamSchema(teamNames);
  const defaultValue = { TeamName: "", RegistrationDate: "", GroupNumber: 1 };

  const onSubmitProcessedForm = async (results: { [x: string]: TeamForm[] | MatchForm[] }) => {
    const teamForms = results.teams as TeamForm[];
    try {
      const response = await fetch("/api/create-teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamForms),
      });

      if (!response.ok) {
        toast.error(TeamMessage.ADD_TEAM_FAILURE);
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
        <InitialForm onSubmit={onSubmitInitialForm} textPlaceholder="Enter your teams here..." schema={initialFormSchema} />
      ) : (
        <ProcessedForm
          objectArray={teams}
          setFormStatus={setFormStatus}
          schema={validateFormSchema}
          data={data}
          refetch={refetch}
          defaultValue={defaultValue}
          checkGroupSize={true}
          onSubmitSecondForm={onSubmitProcessedForm}
        />
      )}
    </Box>
  );
};
