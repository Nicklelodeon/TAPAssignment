"use client";

import { useQuery } from "@tanstack/react-query";
import { ManageMatches } from "./ManageMatches";
import { ManageTeams } from "./Team/ManageTeams";
import { Team } from "@prisma/client";
import { useMemo, useState } from "react";
import { TeamContext } from "@/app/utils/context";
import { Box, Button } from "@chakra-ui/react";

export const Manage = () => {
  const { data, isLoading, refetch } = useQuery<Team[], Error>({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await fetch("/api/get-teams", { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch teams");
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  const [isManageTeam, setIsManageTeam] = useState(true);

  const onChange = (manageTeam: boolean) => {
    if (manageTeam) {
      setIsManageTeam(true);
    } else {
      setIsManageTeam(false);
    }
  };
  const [teamNames, teamNameToId, teamIdToName, teamNameToGroup] = useMemo(() => {
    const teamNameToId = new Map<string, number>();
    const teamIdToName = new Map<number, string>();
    const teamNameToGroup = new Map<NamedCurve, number>();
    data?.forEach((team) => {
        teamNameToId.set(team.TeamName, team.id);
        teamIdToName.set(team.id, team.TeamName);
        teamNameToGroup.set(team.TeamName, team.GroupNumber);
    })
    return [new Set(data?.map((teams) => teams.TeamName)), teamNameToId, teamIdToName, teamNameToGroup];
  }, [data]);

  return (
    <Box>
      <TeamContext.Provider
        value={{
          data: data ?? [],
          teamNames: teamNames,
          refetch: refetch,
          teamNameToId: teamNameToId,
          teamIdToName: teamIdToName,
          teamNameToGroup: teamNameToGroup
        }}
      >
        {isLoading ? (
          <div></div>
        ) : (
          <Box>
            <Button
              onClick={() => {
                return onChange(true);
              }}
            >
              Manage Team
            </Button>
            <Button
              onClick={() => {
                return onChange(false);
              }}
            >
              Manage Matches
            </Button>
            {isManageTeam ? <ManageTeams /> : <ManageMatches />}
          </Box>
        )}
      </TeamContext.Provider>
    </Box>
  );
};
