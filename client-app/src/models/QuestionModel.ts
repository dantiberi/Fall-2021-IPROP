// Interface for Question JSON data returned from backend
export default interface QuestionModel {
    id: number,
    answer_a: number,
    answer_b: number | null,
    question: string,
    subject_name: string
}

// Type guard for validating that data returned from the backend contains the expected fields
// Calling this function with the returned JSON object will subsequently typecheck the JSON as a QuestionData, woo!
export function isQuestionModel(data: any): data is QuestionModel {
    if (typeof data !== "object" || Array.isArray(data) || data === null) {
        return false;
    }

    const questionData = data as QuestionModel;
    return typeof questionData.id === "number"
        && typeof questionData.answer_a === "number"
        && (typeof questionData.answer_b === "number" || questionData.answer_b === null)
        && typeof questionData.question === "string"
        && typeof questionData.subject_name === "string"
}