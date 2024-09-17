"use client";

import { useQuery } from "@tanstack/react-query";
import { ManageMatches } from "./Match/ManageMatches";
import { ManageTeams } from "./Team/ManageTeams";
import { Team } from "@prisma/client";
import { useMemo, useState } from "react";
import { TeamContext } from "@/app/utils/context";
import { Box, Button, Flex } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { CustomisedLoader } from "../ui/CustomisedLoader";

export const Manage = () => {
  const { data, isLoading, refetch } = useQuery<Team[], Error>({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await fetch("/api/get-teams", { method: "GET" });
      if (!response.ok) {
        toast.error("Error getting teams");
        return;
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
          <CustomisedLoader />) : (
          <Box>
            <Flex justifyContent="center" mt={4} mb={4} gap={4}
              top="80px"  >
              <Button
                colorScheme={isManageTeam ? "teal" : "gray"}
                variant={isManageTeam ? "solid" : "outline"}
                onClick={() => onChange(true)}
              >
                Manage Team
              </Button>
              <Button
                colorScheme={!isManageTeam ? "teal" : "gray"}
                variant={!isManageTeam ? "solid" : "outline"}
                onClick={() => onChange(false)}
              >
                Manage Matches
              </Button>
            </Flex>

            {isManageTeam ? <ManageTeams /> : <ManageMatches />}
          </Box>
        )
        }
      </TeamContext.Provider >
    </Box >
  );
};
