import React, { useState } from "react";
import _ from "lodash";

import styles from "./Page.module.scss";
import monsterGif from "assets/monster_havoc.gif"

import getAzureFunctions from "getAzureFunctions";
import useFetch, { FetchStatus } from "hooks/useFetch";

import { isQuestionModel } from "models/QuestionModel";
import { isSubjectModel } from "models/SubjectModel";
import Question from "components/Question";
import ProgressBar from "components/ProgressBar";

const NQUESTIONS = 5;

const SubjectSelector: React.FC<{callback: (name: string) => void}> = (props) => {
    // Fetch the subjects
    const fetchResult = useFetch(
        getAzureFunctions().GetSubjects,
        (data) => {
            // The Azure function should return the data as an array of SubjectModels
            if (Array.isArray(data) && data.every(isSubjectModel)) {
                return data;
            }
            return undefined;
        },
        []
    );

    if (fetchResult.status === FetchStatus.Success) {
        const subjectListItems = fetchResult.payload.map((subject) => (
            <li key={subject.id}>
                <button onClick={() => {props.callback(subject.subject_name)}}>{subject.subject_name}</button>
            </li>
        ))
        return (
            <ul>
                {subjectListItems}
            </ul>
        );
    } else if (fetchResult.status === FetchStatus.Failure) {
        // Notify user that the subjects list couldn't be fetched
        return (
            <p>Could not fetch subjects!</p>
        )
    } else {
        // Notify user that the subjects list is currently being fetched
        return (
            <p>Fetching subjects list...</p>
        )
    }
}

const Game: React.FC<{subjectName: string}> = (props) => {
    // Fetch the questions
    const url = new URL(getAzureFunctions().GetQuestionsBySubject);
    url.searchParams.append("subject", props.subjectName);
    const fetchResult = useFetch(
        url.toString(),
        (data) => {
            // The Azure function should return the data as an array of QuestionModels
            if (Array.isArray(data) && data.every(isQuestionModel)) {
                return _.sampleSize(data, NQUESTIONS);
            }
            return undefined;
        },
        [props.subjectName]
    );

    // Current question number as a state variable
    const [questionIndex, setQuestionIndex] = useState(0);

    if (fetchResult.status === FetchStatus.Success) {
        if (fetchResult.payload.length === 0) {
            return (
                <p>No questions for this subject.</p>
            );
        } else if (questionIndex < fetchResult.payload.length) {
            return (
                <>
                    <img
                        className={styles.gif}
                        src={monsterGif}
                        alt="Evil monster is destroying Jebraville! Solve math questions to kill the monster."
                    />
                    <ProgressBar alpha={1 - questionIndex / fetchResult.payload.length}/>
                    <p>Question #{questionIndex + 1}:</p>
                    <Question
                        id={fetchResult.payload[questionIndex].id}
                        onSolve={() => {setQuestionIndex((questionIndex) => questionIndex + 1);}}
                    />
                </>
            );
        } else {
            return (
                <>
                    <img
                        className={styles.gif}
                        src={monsterGif}
                        alt="Evil monster is destroying Jebraville! Solve math questions to kill the monster."
                    />
                    <ProgressBar alpha={0}/>
                    <p>Congratulations, you won!</p>
                </>
            );
        }
    } else if (fetchResult.status === FetchStatus.Failure) {
        // Notify user that the questions couldn't be fetched
        return (
            <p>Could not fetch questions!</p>
        )
    } else {
        // Notify user that the questions are currently being fetched
        return (
            <p>Fetching questions for subject...</p>
        )
    }
}

const Play: React.FC = () => {
    const [subjectName, setSubjectName] = useState<string | undefined>(undefined);

    return (
        <div className={styles.content}>
            <h3>Play</h3>
            {
                (subjectName === undefined)
                    ? <SubjectSelector callback={setSubjectName} />
                    : <Game subjectName={subjectName} />
            }
        </div>
    );
};

export default Play;