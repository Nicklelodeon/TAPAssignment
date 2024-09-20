"use client";
import { Box, Divider } from "@chakra-ui/react";
import { CreateTeamForm } from "./CreateTeamForm";
import { EditTeamTable } from "./EditTeamTable";

export const ManageTeams = () => {
  return (
    <Box>
      <Box>
        <CreateTeamForm/>
        <Divider borderWidth="2px" my={4} />
        <EditTeamTable />
      </Box>
    </Box>
  );
};
