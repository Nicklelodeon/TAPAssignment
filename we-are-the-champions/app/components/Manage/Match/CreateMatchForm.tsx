"use client";

import { useContext, useEffect, useState } from "react";

import {
  FormStatus,
  initialFormSchemaMatches,
  MatchForm,
  TeamForm,
} from "../constants";
import { TeamContext } from "@/app/utils/context";
import { InitialForm } from "../InitialForm";
import { ProcessedForm } from "../ProcessedForm";
import { Match } from "@prisma/client";
import toast from "react-hot-toast";
import { MatchMessage, multipleMatchSchema } from "./constants";
import { Button, Flex } from "@chakra-ui/react";

interface ICreateMatchForm {
  refetchMatch: () => void;
}

export const CreateMatchForm: React.FC<ICreateMatchForm> = ({refetchMatch}) => {
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.ADD_BUTTON);
  const [matches, setMatches] = useState<MatchForm[]>([]);
  const { teamNames, teamNameToId, teamNameToGroup } = useContext(TeamContext);


  useEffect(() => {
    if (matches.length > 0) {
      setFormStatus(FormStatus.PROCESSED_FORM)
    }
  }, [matches, setMatches]);

  const onSubmitInitialForm = (data: { inputText: string }) => {

    const rows = data.inputText.trim().split("\n");
    const allMatches: MatchForm[] = [];

    for (const row of rows) {
      const parts = row.split(" ");
      for (let i = 0; i < parts.length; i += 4) {
        if (i + 3 < parts.length) {
          allMatches.push({
            HomeTeam: parts[i],
            AwayTeam: parts[i + 1],
            HomeTeamGoal: parseInt(parts[i + 2], 10),
            AwayTeamGoal: parseInt(parts[i + 3], 10),
          });
        }
      }
    }

    setMatches(allMatches);
  };

  const onSubmitProcessedForm = async (results: { [x: string]: TeamForm[] | MatchForm[]}) => {
    const matchForms = results.teams as MatchForm[];
    const matches: Omit<Match, "id">[] = matchForms.map((match: MatchForm) => ({
      HomeTeamId: teamNameToId.get(match.HomeTeam) ?? -1,
      AwayTeamId: teamNameToId.get(match.AwayTeam) ?? -1,
      HomeGoals: match.HomeTeamGoal,
      AwayGoals: match.AwayTeamGoal,
    }));
    try {
      const response = await fetch("/api/create-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(matches),
      });

      if (!response.ok) {
        toast.error(MatchMessage.ADD_MATCH_FAILURE);
        return;
      }
      toast.success(MatchMessage.ADD_MATCH_SUCCESS);
      refetchMatch();
      setFormStatus(FormStatus.ADD_BUTTON);
    } catch {
      toast.error(MatchMessage.ADD_MATCH_FAILURE);
    }
  };

  const initialFormSchema = initialFormSchemaMatches;
  const validateFormSchema = multipleMatchSchema(teamNames, teamNameToGroup);

  const defaultValue = {
    HomeTeam: "",
    AwayTeam: "",
    HomeTeamGoal: 0,
    AwayTeamGoal: 0,
  };
  return (
    <div>
      {formStatus === FormStatus.ADD_BUTTON ? (
        <Flex align="center" justifyContent="center">
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => setFormStatus(FormStatus.INITIAL_FORM)}
          >
            Create Match
          </Button>
        </Flex>
      ) : formStatus === FormStatus.INITIAL_FORM ? (
        <InitialForm onSubmit={onSubmitInitialForm} textPlaceholder="Enter your matches here..." schema={initialFormSchema} />
      ) : (
        <ProcessedForm
          objectArray={matches}
          setFormStatus={setFormStatus}
          schema={validateFormSchema}
          refetch={refetchMatch}
          defaultValue={defaultValue}
          onSubmitSecondForm={onSubmitProcessedForm}
        />
      )}
    </div>
  );
};
