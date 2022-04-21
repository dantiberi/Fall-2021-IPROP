import React, { useEffect, useState } from "react";

import styles from "./Question.module.scss";

import QuestionModel from "models/QuestionModel";
import { determineQuestionStatement } from "questionFormatting";
import NumPad from "components/input/numpad";
import Fade from '@mui/material/Fade';

// Properties for the Question React component
interface QuestionProperties {
    questionData: QuestionModel,
    onSolve: (questionData: QuestionModel, correct: number) => void,
    questionNumber?: number
}

enum AnswerResult {
    Correct,
    Incorrect,
    NoAnswersYet
}

const Question: React.FC<QuestionProperties> = (props) => {
    // Result of last question answered as a state variable
    const [lastAnswerResult, setLastAnswerResult] = useState(AnswerResult.NoAnswersYet);
    const [resultTimeout, setResultTimeout] = useState<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => () => {
        if (resultTimeout) {
            clearTimeout(resultTimeout);
        }
    }, [resultTimeout]);

    const showResult = (wasCorrect: boolean) => {
        setLastAnswerResult(wasCorrect ? AnswerResult.Correct : AnswerResult.Incorrect);
        setResultTimeout(oldTimeout => {
            if (oldTimeout) {
                clearTimeout(oldTimeout);
            }
            return setTimeout(() => {
                setLastAnswerResult(AnswerResult.NoAnswersYet);
            }, 1000);
        });
    };

    async function submitAnswer(answer: string) {
        if (answer === props.questionData.answer_a || answer === props.questionData.answer_b) { //If correct answer
            showResult(true);
            props.onSolve(props.questionData, 1);
        } else { //If not correct answer
            showResult(false);
            props.onSolve(props.questionData, 0);
        }
    }

    const questionNumberLabel = (props.questionNumber !== undefined) ? `(${props.questionNumber})` : null;

    const questionStatement = determineQuestionStatement(props.questionData);

    return (
        <>
            <div style={{gridArea: "question"}}>
                <p>{questionNumberLabel} {questionStatement}</p>
            </div>
            <NumPad
                onSubmit={submitAnswer}
            />
            {
                (lastAnswerResult === AnswerResult.Correct)
                    ? <Fade in={true} timeout={500}>
                        <p className={styles.correct}>That was correct!</p>
                    </Fade>
                    : (lastAnswerResult === AnswerResult.Incorrect)
                        ? <Fade in={true} timeout={500}>
                            <p className={styles.incorrect}>That was incorrect. Try again.</p>
                        </Fade>
                        : null
            }
        </>
    )
};

export default Question;