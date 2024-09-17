"use client";

import { useContext, useEffect, useState } from "react";

import {
  MatchForm,
} from "../../constants";
import { TeamContext } from "@/app/utils/context";
import { FirstForm } from "../../FirstForm";
import { SecondForm } from "../../SecondForm";
import { Match } from "@prisma/client";
import toast from "react-hot-toast";
import { multipleMatchSchema } from "../constants";

export const AddMatchForm = () => {
  const [isFirstForm, setIsFirstForm] = useState(true);
  const [matches, setMatches] = useState<MatchForm[]>([]);
  const { teamNames, refetch, teamNameToId, teamNameToGroup } = useContext(TeamContext);
  useEffect(() => {
    if (matches.length > 0) {
      setIsFirstForm(false);
    }
  }, [matches, setMatches]);
  const onSubmitFirstForm = (data: { inputText: string }) => {
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

  const onSubmitSecondForm = async (results: { [x: string]: any }) => {
    const matches: Omit<Match, "id">[] = results.teams.map((match: MatchForm) => ({
      HomeTeamId: teamNameToId.get(match.HomeTeam) ?? -1,
      AwayTeamId: teamNameToId.get(match.AwayTeam) ?? -1,
      HomeGoals: match.HomeTeamGoal,
      AwayGoals: match.AwayTeamGoal,
    }));
    const response = await fetch("/api/add-match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matches),
    });

    if (!response.ok) {
      toast.error("Error adding match");
      return;
    }
    toast.success("Successfully added match");
    refetch();
    setIsFirstForm(true);
  };

  const schema = multipleMatchSchema(teamNames, teamNameToGroup);

  const defaultValue = {
    HomeTeam: "",
    AwayTeam: "",
    HomeTeamGoal: 0,
    AwayTeamGoal: 0,
  };
  return (
    <div>
      {isFirstForm ? (
        <FirstForm onSubmit={onSubmitFirstForm} textPlaceholder="Enter your matches here..."/>
      ) : (
        <SecondForm
          objectArray={matches}
          setIsFirstForm={setIsFirstForm}
          schema={schema}
          refetch={refetch}
          defaultValue={defaultValue}
          onSubmitSecondForm={onSubmitSecondForm}
        />
      )}
    </div>
  );
};
