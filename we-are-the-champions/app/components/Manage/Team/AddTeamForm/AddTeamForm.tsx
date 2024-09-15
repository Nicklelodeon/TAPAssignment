"use client";

import { useContext, useEffect, useState } from "react";

import { FirstForm } from "../../FirstForm";
import { SecondForm } from "../../SecondForm";
import { FormTeam, multipleTeamSchema } from "../../constants";
import { TeamContext } from "@/app/utils/context";

export const AddTeamForm = () => {
  const [isFirstForm, setIsFirstForm] = useState(true);
  const [teams, setTeams] = useState<FormTeam[]>([]);
  const { data, teamNames, refetch } = useContext(TeamContext);
  useEffect(() => {
    if (teams.length > 0) {
      setIsFirstForm(false);
    }
  }, [teams, setTeams]);
  const onSubmitFirstForm = (data: { inputText: string }) => {
    const rows = data.inputText.trim().split("\n");
    const allTeams: FormTeam[] = [];

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

  const schema = multipleTeamSchema(teamNames);
  const defaultValue = { TeamName: "", RegistrationDate: "", GroupNumber: 1 };

  const onSubmitSecondForm = async (results: { [x: string]: any }) => {
    const response = await fetch("/api/add-teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(results),
    });

    if (!response.ok) {
      return;
    }

    refetch();
    setIsFirstForm(true);
  };
  return (
    <div>
      {isFirstForm ? (
        <FirstForm onSubmit={onSubmitFirstForm} />
      ) : (
        <SecondForm
          objectArray={teams}
          setIsFirstForm={setIsFirstForm}
          schema={schema}
          data={data}
          refetch={refetch}
          defaultValue={defaultValue}
          checkGroupSize={true}
          onSubmitSecondForm={onSubmitSecondForm}
        />
      )}
    </div>
  );
};
