"use client";

import { useContext, useEffect, useState } from "react";

import { FirstForm } from "../../FirstForm";
import { SecondForm } from "../../SecondForm";
import { TeamForm} from "../../constants";
import { TeamContext } from "@/app/utils/context";
import toast from "react-hot-toast";
import { multipleTeamSchema } from "../constants";

export const AddTeamForm = () => {
  const [isFirstForm, setIsFirstForm] = useState(true);
  const [teams, setTeams] = useState<TeamForm[]>([]);
  const { data, teamNames, refetch } = useContext(TeamContext);
  useEffect(() => {
    if (teams.length > 0) {
      setIsFirstForm(false);
    }
  }, [teams, setTeams]);
  const onSubmitFirstForm = (data: { inputText: string }) => {
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
      toast.error("Error adding team");
      return;
    }
    toast.success("Successfully added teams");
    refetch();
    setIsFirstForm(true);
  };
  return (
    <div>
      {isFirstForm ? (
        <FirstForm onSubmit={onSubmitFirstForm} textPlaceholder="Enter your teams here..."/>
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
