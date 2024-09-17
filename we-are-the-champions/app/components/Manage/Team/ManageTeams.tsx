"use client";
import { AddTeamForm } from "./AddTeamForm/AddTeamForm";
import { EditTeamTable } from "./EditTeamTable";

export const ManageTeams = () => {
  return (
    <div>
      <div>
        <AddTeamForm/>

        <EditTeamTable />
      </div>
    </div>
  );
};
