import { Team } from "@prisma/client";
import { createContext, useContext } from "react";

interface TeamContextProps {
    data: Team[];
    teamNames: Set<string>;
    refetch: () => void;
    teamNameToId: Map<string, number>;
    teamIdToName: Map<number, string>;
    teamNameToGroup: Map<string, number>;
  };

  export const TeamContext = createContext<TeamContextProps>({
      data: [],
      teamNames: new Set(),
      refetch: function (): void {
          throw new Error("Function not implemented.");
      },
      teamNameToId: new Map(),
      teamIdToName: new Map(),
      teamNameToGroup: new Map(),
  });

  export const useTeamContext = () => {
    const context = useContext(TeamContext);
    if (context === undefined) {
      throw new Error("useTeamContext must be used within a TeamProvider");
    }
    return context;
  };
