"use client";
import { AddTeamForm } from "./AddTeamForm/AddTeamForm";
import { TeamTable } from "./TeamTable";

export const ManageTeams = () => {
  return (
    <div>
      <div>
        <AddTeamForm/>

        <TeamTable />
      </div>
    </div>
  );
};
