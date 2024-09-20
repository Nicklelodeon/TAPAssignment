"use client";

import { useQuery } from "@tanstack/react-query";
import { ManageMatches } from "./match/ManageMatches";
import { ManageTeams } from "./team/ManageTeams";
import { useMemo, useState } from "react";
import { TeamContext } from "@/app/utils/context";
import { Box, Button, Flex } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { CustomisedLoader } from "../ui/CustomisedLoader";
import { TeamWithForeignKey } from "@/app/utils/constants";
import { TeamMessage } from "./team/constants";

export const Manage = () => {
  const [isManageTeam, setIsManageTeam] = useState(true);

  const { data, isLoading, isFetching, refetch } = useQuery<
    TeamWithForeignKey[],
    Error
  >({
    queryKey: ["teams"],
    queryFn: async () => {
      // used in edit teams to disable delete button if teams are associated with matches
      try {
        const response = await fetch("/api/get-teams-with-foreign-key", {
          method: "GET",
        });
        if (!response.ok) {
          const error = await response.json();
          toast.error(error.message || TeamMessage.FETCH_TEAM_FAILURE);
          return;
        }
        return response.json();
      } catch {
        // only logs if it fails
        toast.error(TeamMessage.FETCH_TEAM_FAILURE);
      }
    },
    refetchOnWindowFocus: false,
    enabled: isManageTeam === true,
  });

  const onChange = (manageTeam: boolean) => {
    if (manageTeam) {
      setIsManageTeam(true);
    } else {
      setIsManageTeam(false);
    }
  };
  const [teamNames, teamNameToId, teamIdToName, teamNameToGroup] =
    useMemo(() => {
      const teamNameToId = new Map<string, number>();
      const teamIdToName = new Map<number, string>();
      const teamNameToGroup = new Map<NamedCurve, number>();
      data?.forEach((team) => {
        teamNameToId.set(team.TeamName, team.id);
        teamIdToName.set(team.id, team.TeamName);
        teamNameToGroup.set(team.TeamName, team.GroupNumber);
      });
      return [
        new Set(data?.map((teams) => teams.TeamName)),
        teamNameToId,
        teamIdToName,
        teamNameToGroup,
      ];
    }, [data]);

  return (
    <Box>
      <TeamContext.Provider
        value={{
          data: data ?? [],
          teamNames,
          refetch,
          teamNameToId,
          teamIdToName,
          teamNameToGroup,
          isTeamFetching: isFetching,
        }}
      >
        {isLoading ? (
          <CustomisedLoader />
        ) : (
          <Box>
            <Flex justifyContent="center" mt={4} mb={4} gap={4} top="80px">
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

            {isManageTeam ? (
              <ManageTeams />
            ) : (
              <ManageMatches isManageTeam={isManageTeam} />
            )}
          </Box>
        )}
      </TeamContext.Provider>
    </Box>
  );
};
