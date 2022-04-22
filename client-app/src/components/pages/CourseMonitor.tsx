import React, { useCallback, useEffect, useState } from "react";

import styles from "./Page.module.scss"

import CourseCreationForm from "components/CourseCreationForm";
import Stage from "components/Stage";

import InstructorModel from "models/InstructorModel";
import NewGameResponseModel from "models/NewGameResponseModel";
import StageEndModel from "models/StageEndModel";

import getAzureFunctions from "getAzureFunctions";

import Fade from '@mui/material/Fade';

interface CourseMonitorProps {
    instructorData: InstructorModel
}

const CourseMonitor: React.FC<CourseMonitorProps> = props => {
    const [gameData, setGameData] = useState<NewGameResponseModel | undefined>(undefined);

    const onStageFinish = useCallback(
        (data: StageEndModel) => {
            setGameData(
                oldGameData => {
                    if (oldGameData === undefined)
                        return undefined;
                    
                    return {
                        course_id: oldGameData!.course_id,
                        cname: oldGameData!.cname,
                        code: oldGameData!.code,
                        max_hp: data.new_max_hp,
                        name: data.new_stage_name,
                        stage_id: data.new_stage_id,
                        subject_id: data.new_subject_id,
                        subject_name: data.new_subject_name
                    };
                }
            );
        },
        [setGameData]
    );

    const onCourseFinish = useCallback(
        () => {
            setGameData(undefined);
        },
        [setGameData]
    );

    const endGameRequest = useCallback(
        () => setGameData(oldGameData => {
            if (oldGameData !== undefined) {
                const url = new URL(getAzureFunctions().EndGame);
                url.searchParams.append("courseId", oldGameData.course_id.toString());
                url.searchParams.append("stageId", oldGameData.stage_id.toString());

                const requestInfo: RequestInit = { method: "PUT" };

                fetch(url.toString(), requestInfo)
                    .then(response => response.text())
                    .then(text => {console.log(text);})
                    .catch(err => {console.error(err);});
            }

            return undefined;
        }),
        [setGameData]
    )

    let contents: JSX.Element;

    if (gameData === undefined) {
        contents = (
            <CourseCreationForm instructorData={props.instructorData} onCourseCreated={setGameData}/>
        );
    } else {
        contents = (
            <>
                <Stage
                    max_hp={gameData.max_hp}
                    stageId={gameData.stage_id}
                    stageName={gameData.name}
                    courseCode={gameData.code.toString()}
                    winMessage={"Your brilliant students have defeated the monster! Moving onto next stage..."}
                    onStageFinish={onStageFinish}
                    onCourseFinish={onCourseFinish}
                    courseId={gameData.course_id}
                />
                <button onClick={endGameRequest}>End Game</button>
            </>
        );
    }

    // This effect attaches/detaches the beforeunload event listener if there is a current game
    useEffect(() => {
        if (gameData !== undefined) {
            const listener = (e: BeforeUnloadEvent) => {
                e.preventDefault(); // Shows prompt on Firefox
                e.returnValue = ''; // Shows prompt on Chrome
                endGameRequest();
            };
    
            window.addEventListener('beforeunload', listener);
            return () => {
                window.removeEventListener('beforeunload', listener);
            }
        }
    }, [gameData, endGameRequest])

    // This effect is fired ONLY when the component fully unmounts, ending the current game if it exists
    useEffect(() => () => endGameRequest(), [endGameRequest]);

    return (
        <Fade in={true} timeout={500}>
            <div className={styles.content}>
                <h3>Course Monitor - {props.instructorData.fname} {props.instructorData.lname}</h3>
                {contents}
            </div>
        </Fade>
    );
}

export default CourseMonitor;