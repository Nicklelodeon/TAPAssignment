

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