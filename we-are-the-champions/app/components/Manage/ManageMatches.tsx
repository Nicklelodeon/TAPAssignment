import { Match } from "@prisma/client";
import { AddMatchForm } from "./Match/AddMatchForm/AddMatchForm";
import { MatchTable } from "./Match/MatchTable";
import { useQuery } from "@tanstack/react-query";

export const ManageMatches = () => {
  const { data, isLoading, refetch } = useQuery<Match[], Error>(
    {
      queryKey: ["matches"],
      queryFn: async () => {
        const response = await fetch("/api/get-match", { method: "GET" });
        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }
        return response.json();
      },
      refetchOnWindowFocus: false,
    }
  );


  return (
    <div>
      {isLoading ? (
        <></>
      ) : (
        <div>
          <AddMatchForm />

          <MatchTable data={data ?? []} refetchMatch={refetch}/>
        </div>
      )}
    </div>
  );
};
