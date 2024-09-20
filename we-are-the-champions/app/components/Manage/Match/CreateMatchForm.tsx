import { useContext, useEffect, useState } from "react";

import {
  FormStatus,
  FormatValidationFormSchemaMatches,
  MatchForm,
  TeamForm,
} from "../constants";
import { TeamContext } from "@/app/utils/context";
import { FormatValidationForm } from "../FormatValidationForm";
import { InputValidationForm } from "../InputValidationForm";
import { Match } from "@prisma/client";
import toast from "react-hot-toast";
import { MatchMessage, multipleMatchSchema } from "./constants";
import { Button, Flex } from "@chakra-ui/react";
import { IAPICreateMatchInput } from "@/app/types/api/create-match";

interface ICreateMatchForm {
  refetchMatch: () => void;
  matchesPlayed: Map<string, Set<string>>
}

export const CreateMatchForm: React.FC<ICreateMatchForm> = ({
  refetchMatch,
  matchesPlayed
}) => {
  const [formStatus, setFormStatus] = useState<FormStatus>(
    FormStatus.ADD_BUTTON
  );
  const [matches, setMatches] = useState<MatchForm[]>([]);
  const { teamNames, teamNameToId, teamNameToGroup, refetch: refetchTeam } = useContext(TeamContext);

  useEffect(() => {
    if (matches.length > 0) {
      setFormStatus(FormStatus.PROCESSED_FORM);
    }
  }, [matches, setMatches]);

  const onSubmitFormatValidationForm = (data: { inputText: string }) => {
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

  const onSubmitInputValidationForm = async (results: {
    teams: TeamForm[] | MatchForm[];
  }) => {
    const matchForms = results.teams as MatchForm[];

    const matches: Omit<Match, "id">[] = matchForms.map((match: MatchForm) => ({
      HomeTeamId: teamNameToId.get(match.HomeTeam) ?? -1,
      AwayTeamId: teamNameToId.get(match.AwayTeam) ?? -1,
      HomeGoals: match.HomeTeamGoal,
      AwayGoals: match.AwayTeamGoal,
    }));
    const payload: IAPICreateMatchInput = {
      matches,
    };
    try {
      const response = await fetch("/api/create-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || MatchMessage.ADD_MATCH_FAILURE);
        return;
      }
      toast.success(MatchMessage.ADD_MATCH_SUCCESS);
      refetchMatch();
      // update team statistics based on changes to match
      refetchTeam();
      setFormStatus(FormStatus.ADD_BUTTON);
    } catch {
      toast.error(MatchMessage.ADD_MATCH_FAILURE);
    }
  };

  const validateFormSchema = multipleMatchSchema(teamNames, teamNameToGroup, matchesPlayed);

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
        <FormatValidationForm
          onSubmit={onSubmitFormatValidationForm}
          textPlaceholder="Enter your matches here..."
          schema={FormatValidationFormSchemaMatches}
          inputLineLength={4}
        />
      ) : (
        <InputValidationForm
          objectArray={matches}
          setFormStatus={setFormStatus}
          schema={validateFormSchema}
          defaultValue={defaultValue}
          formName="Match"
          onSubmitInputValidationForm={onSubmitInputValidationForm}
        />
      )}
    </div>
  );
};
