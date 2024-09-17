"use client"
import { AddMatchForm } from "./AddMatchForm/AddMatchForm";
import { EditMatchTable } from "./EditMatchTable";
import { useQuery } from "@tanstack/react-query";
import { MatchWithForeignKey } from "@/app/utils/constants";
import toast from "react-hot-toast";
import { CustomisedLoader } from "../../ui/CustomisedLoader";

export const ManageMatches = () => {
  const { data, isLoading, refetch } = useQuery<MatchWithForeignKey[], Error>(
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
    }
  );

  return (
    <div>
      {isLoading ? (   
        <CustomisedLoader/>
      ) : (
        <div>
          <AddMatchForm />

          <EditMatchTable data={data ?? []} refetchMatch={refetch}/>
        </div>
      )}
    </div>
  );
};
