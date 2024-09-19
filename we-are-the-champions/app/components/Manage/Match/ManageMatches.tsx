"use client"
import { CreateMatchForm } from "./CreateMatchForm";
import { EditMatchTable } from "./EditMatchTable";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CustomisedLoader } from "../../ui/CustomisedLoader";
import { MatchWithForeignKey } from "./constants";
import { Divider } from "@chakra-ui/react";

interface IManageMatchesProps {
  isManageTeam: boolean;
}

export const ManageMatches:React.FC<IManageMatchesProps> = ({isManageTeam}) => {
  const { data, isLoading, isFetching, refetch } = useQuery<MatchWithForeignKey[], Error>(
    {
      queryKey: ["matches"],
      queryFn: async () => {
        const response = await fetch("/api/get-match", { method: "GET" });
        if (!response.ok) {
          toast.error("Error fetching matches")
          return;
        }
        return response.json();
      },
      refetchOnWindowFocus: false,
      enabled: isManageTeam === false
    }
  );

  return (
    <div>
      {isLoading ? (
        <CustomisedLoader />
      ) : (
        <div>
          <CreateMatchForm refetchMatch={refetch}/>
          <Divider borderWidth="2px" my={4} />

          <EditMatchTable data={data ?? []} refetchMatch={refetch} isMatchFetching={isFetching} />
        </div>
      )}
    </div>
  );
};
