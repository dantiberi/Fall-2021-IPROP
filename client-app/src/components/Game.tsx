import React, { useCallback, useState } from "react";
import _ from "lodash";

import getAzureFunctions from "getAzureFunctions";
import useFetch, { FetchStatus } from "hooks/useFetch";

import GameModel from "models/GameModel";
import { publishStageEvent } from "models/PublishStageEventModel";
import QuestionModel, { isQuestionModel } from "models/QuestionModel";
import StageEndModel from "models/StageEndModel";
import UserSignInResponseModel from "models/UserSignInResponseModel";

import Question from "components/Question";
import Stage from "components/Stage";
import { determineQuestionDiagram } from "questionFormatting";

interface GameProps {
    game: GameModel,
    userData: UserSignInResponseModel,
    courseCode: string,
    onStageFinish: (data: StageEndModel) => void,
    onCourseFinish: () => void
}

// Amount of damage to deal per correct answer
var INFLICTED_HP = 10;

const Game: React.FC<GameProps> = (props) => {
    // Fetch the questions
    const url = new URL(getAzureFunctions().GetQuestionsBySubject);
    url.searchParams.append("subject", props.game.subject_name);
    const fetchResult = useFetch(
        url.toString(),
        (data) => {
            // The Azure function should return the data as an array of QuestionModels
            if (Array.isArray(data) && data.every(isQuestionModel)) {
                return _.shuffle(data);
            }
            return undefined;
        },
        [props.game.subject_name]
    );
    
    // Current question number as a state variable
    const [questionIndex, setQuestionIndex] = useState(0);

    // Callback when question is solved correctly or incorrectly.
    const onQuestionSolve = useCallback(
        (questionData: QuestionModel, correct: number) => {
            if(correct === 0){
                INFLICTED_HP = 0;
            }
            else{
                INFLICTED_HP = 10;
            }

            publishStageEvent({
                stage_id: props.userData.stageId,
                course_id: props.userData.courseId,
                origin_user_id: props.userData.userId, //Null
                question_id: questionData.id,
                inflicted_hp: INFLICTED_HP,
                was_correct: correct, //Needs to be verified 
                event_time: new Date().toISOString().slice(0, 19).replace('T', ' ')
            }).then(() => {
                setQuestionIndex(questionIndex => questionIndex + 1);
            });
            console.log("onQuestionSolve: questionData.solved_correctly = " + correct);
        },
        [props.userData.stageId, props.userData.courseId, props.userData.userId, setQuestionIndex]
    );

    if (fetchResult.status === FetchStatus.Success) {
        if (fetchResult.payload.length === 0) {
            return (
                <p>No questions for this subject.</p>
            );
        } else {
            const question = fetchResult.payload[questionIndex % fetchResult.payload.length];

            const diagram = determineQuestionDiagram(question);

            return (
                <Stage
                    max_hp={props.game.max_hp}
                    stageName={props.game.stage_name}
                    stageId={props.userData.stageId}
                    courseCode={props.courseCode}
                    winMessage={"Congratulations! With the help of your classmates, you've defeated the monster! Moving onto next stage..."}
                    onStageFinish={props.onStageFinish}
                    onCourseFinish={props.onCourseFinish}
                    forceFetchStageEvents={questionIndex}
                    courseId={props.userData.courseId}
                    hideMonster={diagram !== undefined}
                    hideCourseCode={true}
                    hidePlayerCount={true}
                    hideHealthNumber={true}
                >
                    <Question
                        questionData={question}
                        onSolve={onQuestionSolve}
                        questionNumber={questionIndex + 1}
                    />
                    {diagram}
                </Stage>
            );
        }
    } else if (fetchResult.status === FetchStatus.Failure) {
        // Notify user that the questions couldn't be fetched
        return (
            <p>Could not fetch questions! Reason: {fetchResult.reason}</p>
        )
    } else {
        // Notify user that the questions are currently being fetched
        return (
            <p>Fetching questions for subject...</p>
        )
    }
}

export default Game;