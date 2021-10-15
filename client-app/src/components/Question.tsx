import React, { useEffect, useState } from "react";

import azureFunctions from "azureFunctions";

// Properties for the Question React component
interface QuestionProperties {
    id: number
}

// Interface for Question JSON data returned from backend
interface QuestionData {
    id: number,
    answer_a: number,
    answer_b: number | null,
    question: string,
    subject_name: string
}

// Type guard for validating that data returned from the backend contains the expected fields
// Calling this function with the returned JSON object will subsequently typecheck the JSON as a QuestionData, woo!
function isQuestionData(data: any): data is QuestionData {
    if (typeof data !== "object" || Array.isArray(data) || data === null) {
        return false;
    }

    const questionData = data as QuestionData;
    return typeof questionData.id === "number"
        && typeof questionData.answer_a === "number"
        && (typeof questionData.answer_b === "number" || questionData.answer_b === null)
        && typeof questionData.question === "string"
        && typeof questionData.subject_name === "string"
}

// Different statuses for question fetch operation
enum FetchQuestionStatus {
    Success,            // Successfully fetched question with expected data fields
    Failure,            // Received malformed data from the backend
    InProgress          // Fetch operation still in progress
}

// Interface for successful question fetch state
interface FetchQuestionSuccess {
    status: FetchQuestionStatus.Success,
    payload: QuestionData
}

// Interface for failed question fetch state
interface FetchQuestionFailure {
    status: FetchQuestionStatus.Failure
}

// Interface for in-progress question fetch state
interface FetchQuestionInProgress {
    status: FetchQuestionStatus.InProgress
}

// Full type for the fetched question result state
type FetchQuestionResult = FetchQuestionSuccess | FetchQuestionFailure | FetchQuestionInProgress;

const Question: React.FC<QuestionProperties> = (props) => {
    // Create a stateful variable fetchResult of type FetchQuestionResult, with default value as FetchQuestionInProgress (it hasn't fetched the question yet!)
    const [fetchResult, setFetchResult] = useState<FetchQuestionResult>({status: FetchQuestionStatus.InProgress});

    // Fetch the question data using an effect
    useEffect(() => {
        setFetchResult({status: FetchQuestionStatus.InProgress});

        const fetchData = async () => {
            var request = azureFunctions.GetQuestion + "&id=" + props.id;
            const response = await fetch(request);
            const json = await response.json();
            console.log(json);
            
            // The 'json' variable will be an array with a QuestionData object inside it if successful
            if (Array.isArray(json) && isQuestionData(json[0])) {
                setFetchResult({
                    status: FetchQuestionStatus.Success,
                    payload: json[0]
                });
            } else {
                setFetchResult({
                    status: FetchQuestionStatus.Failure
                });
            }
        }
        fetchData();
    }, [props.id]); // <-- This is an array of values upon which this effect depends on! This is important so that the effect doesn't repeat and overload the backend with requests

    if (fetchResult.status === FetchQuestionStatus.Success) {
        // Display question if fetching was successful
        const payload = fetchResult.payload;
        return (
            <div>
                <p>Solve: {payload.question}</p>
                <p>
                    {
                        (payload.answer_b === null)
                            ? `Answer: ${payload.answer_a}`
                            : `Answers: ${payload.answer_a}, ${payload.answer_b}`
                    }
                </p>
                <p>Subject: {payload.subject_name}</p>
            </div>
        )
    } else if (fetchResult.status === FetchQuestionStatus.Failure) {
        return (
            <p>Could not fetch question!</p>
        )
    } else {
        return (
            <p>Fetching question data...</p>
        )
    }
};

export default Question;