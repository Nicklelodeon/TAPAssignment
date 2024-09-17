

export const calculatePointsForDeletion = (goalsScored: number, goalsConceded: number) => {
    if (goalsScored === goalsConceded) {
        return [-1, -3];
    } else if (goalsScored > goalsConceded) {
        return [-3, -5];
    } else {
        return [0, -1];
    }
}

export const calculatePointsForAddition = (goalsScored: number, goalsConceded: number) => {
    if (goalsScored === goalsConceded) {
        return [1, 3];
    } else if (goalsScored > goalsConceded) {
        return [3, 5];
    } else {
        return [0, 1];
    }
}

export interface MatchWithForeignKey {
    id: number;
    AwayGoals: number;
    AwayTeamId: number;
    HomeGoals: number;
    HomeTeamId: number;
    HomeTeam: { TeamName: string }; 
    AwayTeam: { TeamName: string };
}

export const dateParser = (input: string) => {
    const [day, month] = input.split("/").map(Number);
  
    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return null;
    }
  
    return new Date(new Date().getFullYear(), month - 1, day);
  };

