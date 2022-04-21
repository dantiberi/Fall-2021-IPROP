import React, { useCallback, useEffect } from "react";

import styles from "./Page.module.scss";
import playStyles from "./Play.module.scss";

import getAzureFunctions from "getAzureFunctions";
import useFetch, { FetchStatus } from "hooks/useFetch";
import Fade from '@mui/material/Fade';
import { isGameModel } from "models/GameModel";
import StageEndModel from "models/StageEndModel";
import UserSignInResponseModel from "models/UserSignInResponseModel";

import Game from "components/Game";

interface PlayProps {
    userData: UserSignInResponseModel,
    courseCode: string,
    onStageFinish: (data: StageEndModel) => void,
    onCourseFinish: () => void
}

const Play: React.FC<PlayProps> = props => {
    const url = new URL(getAzureFunctions().GetSubjectNameFromStageId);
    url.searchParams.append("stage_id", props.userData.stageId.toString());

    const gameFetchResult = useFetch(
        url.toString(),
        (data) => {
            if (isGameModel(data)) {
                return data;
            }
            return undefined;
        },
        [props.userData.stageId]
    );

    let contents: JSX.Element;

    if (gameFetchResult.status === FetchStatus.Success) {
        contents = (
            <Game
                game={gameFetchResult.payload}
                userData={props.userData}
                courseCode={props.courseCode}
                onStageFinish={props.onStageFinish}
                onCourseFinish={props.onCourseFinish}
            />
        );
    } else if (gameFetchResult.status === FetchStatus.InProgress) {
        contents = (
            <p>Fetching subject name from stage ID...</p>
        );
    } else {
        contents = (
            <p>Failed to fetch subject name from stage ID! Reason: {gameFetchResult.reason}</p>
        );
    }

    // Run DropPlayer az function.
    const removePlayer = useCallback(
        () => {
            console.log("Removing player from game:")

            const url = new URL(getAzureFunctions().DropPlayer);
            url.searchParams.append("userId", props.userData.userId.toString());
            url.searchParams.append("courseId", props.userData.courseId.toString());

            const requestInit: RequestInit = { method: 'DELETE' };

            fetch(url.toString(), requestInit)
                .then(response => console.log(response));
        },
        [props.userData.userId, props.userData.courseId]
    );

    // Attach beforeunload event listener
    useEffect(
        () => {
            const listener = (e: BeforeUnloadEvent) => {
                e.preventDefault(); // Shows prompt on Firefox
                e.returnValue = ''; // Shows prompt on Chrome
                removePlayer();
            };

            window.addEventListener('beforeunload', listener);
            return () => {
                window.removeEventListener('beforeunload', listener);
                removePlayer();
            }
        },
        [removePlayer]
    );

    return (
        <Fade in={true} timeout={500}>
            <div className={`${styles.content} ${playStyles.content}`}>
                {contents}
            </div>
        </Fade>
    );
};

export default Play;