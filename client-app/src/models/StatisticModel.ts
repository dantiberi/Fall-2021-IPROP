// Interface for Subject JSON data returned from backend
export default interface StatisticModel {
    id: number,
    email: string,
    game_date: string,
    subject_name: string,
    score: number,
    correct_attempt: number,
    incorrect_attempt: number,
}

// Type guard for validating that data returned from the backend contains the expected fields
export function isStatisticModel(data: any): data is StatisticModel {
    if (typeof data !== "object" || Array.isArray(data) || data === null) {
        return false;
    }

    const statisticData = data as StatisticModel;
    return typeof statisticData.id === "number"
        && typeof statisticData.email === "string"
        && typeof statisticData.game_date === "string"
        && typeof statisticData.subject_name === "string"
        && typeof statisticData.score === "number"
        && typeof statisticData.correct_attempt === "number"
        && typeof statisticData.incorrect_attempt === "number";
}