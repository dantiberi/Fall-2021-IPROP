import React from "react";

import getAzureFunctions from "getAzureFunctions";
import useFetch, { FetchStatus } from "hooks/useFetch";
import useForm from "hooks/useForm";

import { isQuestionModel } from "models/QuestionModel";

// Properties for the Question React component
interface QuestionProperties {
    id: number,
    onSolve: () => void
}

// Interface for answer form
interface AnswerFormState {
    answer: string
}

const Question: React.FC<QuestionProperties> = (props) => {
    // Fetch the question data using the GetQuestion function
    const url = new URL(getAzureFunctions().GetQuestion);
    url.searchParams.append("id", props.id.toString());
    const fetchResult = useFetch(
        url.toString(),
        (data) => {
            // The Azure function should return the data as an array with one QuestionModel object inside it
            if (Array.isArray(data) && isQuestionModel(data[0])) {
                return data[0];
            }
            return undefined;
        },
        [props.id]
    );

    // Callback to be fired when the Submit button is entered
    async function submitAnswerCallback(state: AnswerFormState) {
        if (fetchResult.status === FetchStatus.Success) {
            if (parseInt(state.answer) === fetchResult.payload.answer_a) {
                alert("Bingo!");
                props.onSolve();
            } else {
                alert("Wrong!");
            }
        } else {
            alert("Question isn't determined yet");
        }
    }
    
    // Default state for the Answer form
    const initialState: AnswerFormState = {
        answer: ""
    }
    
    // Create a Form state using the answer submission callback and the default state above
    const [formState, onFormChange, onFormSubmit] = useForm(
        submitAnswerCallback,
        initialState
    );

    if (fetchResult.status === FetchStatus.Success) {
        // Display question if fetching was successful
        const payload = fetchResult.payload;
        return (
            <div>
                <p>Solve: {payload.question}</p>
                <p>Subject: {payload.subject_name}</p>
                <form onSubmit={onFormSubmit}>
                    <label>
                        Enter answer: 
                        <input name="answer" value={formState.answer} type="text" placeholder="Answer" onChange={onFormChange} />
                        <input type="submit" />
                    </label>
                </form>
            </div>
        )
    } else if (fetchResult.status === FetchStatus.Failure) {
        // Notify user that the question couldn't be fetched
        return (
            <p>Could not fetch question!</p>
        )
    } else {
        // Notify user that the question is currently being fetched
        return (
            <p>Fetching question data...</p>
        )
    }
};

export default Question;