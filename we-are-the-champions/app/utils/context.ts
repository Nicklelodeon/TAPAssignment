import { createContext, useContext } from "react";
import { TeamWithForeignKey } from "./constants";


interface TeamContextProps {
    data: TeamWithForeignKey[];
    teamNames: Set<string>;
    refetch: () => void;
    teamNameToId: Map<string, number>;
    teamIdToName: Map<number, string>;
    teamNameToGroup: Map<string, number>;
    isTeamFetching: boolean;
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
      isTeamFetching: false
  });

  export const useTeamContext = () => {
    const context = useContext(TeamContext);
    if (context === undefined) {
      throw new Error("useTeamContext must be used within a TeamProvider");
    }
    return context;
  };
