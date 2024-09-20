"use client";
import { CreateMatchForm } from "./CreateMatchForm";
import { EditMatchTable } from "./EditMatchTable";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CustomisedLoader } from "../../ui/CustomisedLoader";
import { Divider } from "@chakra-ui/react";
import { useMemo } from "react";
import { MatchMessage, MatchWithForeignKey } from "./constants";

interface IManageMatchesProps {
  isManageTeam: boolean;
}

export const ManageMatches: React.FC<IManageMatchesProps> = ({
  isManageTeam,
}) => {
  const { data, isLoading, isFetching, refetch } = useQuery<
    MatchWithForeignKey[],
    Error
  >({
    queryKey: ["matches"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/get-match", { method: "GET" });
        if (!response.ok) {
          const error = await response.json();
          toast.error(error.message || MatchMessage.FETCH_MATCH_FAILURE);
          return;
        }
        return response.json();
      } catch {
        // only display error
        toast.error(MatchMessage.FETCH_MATCH_FAILURE);
      }
    },
    refetchOnWindowFocus: false,
    enabled: isManageTeam === false,
  });

  const matchesPlayed: Map<string, Set<string>> = useMemo(() => {
    const currentMatches = new Map<string, Set<string>>();

    data?.forEach((match) => {
      
      if (currentMatches.has(match.HomeTeam.TeamName)) {
        currentMatches.get(match.HomeTeam.TeamName)?.add(match.AwayTeam.TeamName);
      } else {
        const newSet = new Set<string>();
        newSet.add(match.AwayTeam.TeamName);
        currentMatches.set(match.HomeTeam.TeamName, newSet);
      }
      if (currentMatches.has(match.AwayTeam.TeamName)) {
        currentMatches.get(match.AwayTeam.TeamName)?.add(match.HomeTeam.TeamName);
      } else {
        const newSet = new Set<string>();
        newSet.add(match.HomeTeam.TeamName);
        currentMatches.set(match.AwayTeam.TeamName, newSet);
      }
    });
    return currentMatches;
  }, [data]);

  return (
    <div>
      {isLoading ? (
        <CustomisedLoader />
      ) : (
        <div>
          <CreateMatchForm refetchMatch={refetch} matchesPlayed={matchesPlayed} />
          <Divider borderWidth="2px" my={4} />

          <EditMatchTable
            data={data ?? []}
            refetchMatch={refetch}
            isMatchFetching={isFetching}
            matchesPlayed={matchesPlayed}
          />
        </div>
      )}
    </div>
  );
};
