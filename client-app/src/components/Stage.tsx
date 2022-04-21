import React, { useCallback, useEffect, useState } from "react";

import styles from "./Game.module.scss";

import monsterHavocGif from "assets/monster_havoc.gif";
import monsterDefeatGif from "assets/monster_defeat_no_loop.gif";

import getAzureFunctions from "getAzureFunctions";

import { isCourseEndModel } from "models/CourseEndModel";
import StageEndModel, { isStageEndModel } from "models/StageEndModel";
import { isStageEventModel } from "models/StageEventModel";

import ProgressBar from "components/ProgressBar";
import { PlayerCount } from "./PlayerCount";

interface StageProps {
    max_hp: number,
    stageName: string,
    stageId: number,
    courseCode: string,
    winMessage: string,
    onStageFinish: (data: StageEndModel) => void,
    onCourseFinish: () => void,
    forceFetchStageEvents?: number,                  // Used to force Stage to re-fetch stage events when set to a new number (hacky!)
    courseId: number,
    hideMonster?: boolean,
    hideCourseCode?: boolean,
    hidePlayerCount?: boolean,
    hideHealthNumber?: boolean,
}

// Time (in milliseconds) between each GetEvents request
const EVENTS_INTERVAL = 2500;
// Time (in milliseconds) between ending a stage and moving on to the next stage
const BETWEEN_STAGE_TIMEOUT = 8000;

const Stage: React.FC<StageProps> = (props) => {
    const hideMonster = (props.hideMonster !== undefined) ? props.hideMonster : false;
    const hideCourseCode = (props.hideCourseCode !== undefined) ? props.hideCourseCode : false;
    const hidePlayerCount = (props.hidePlayerCount !== undefined) ? props.hidePlayerCount : false;
    const hideHealthNumber = (props.hideHealthNumber !== undefined) ? props.hideHealthNumber : false;

    // Current HP of monster as a state variable
    const [monsterHP, setMonsterHP] = useState(props.max_hp);
    // Error message string
    const [eventsErrorMessage, setEventsErrorMessage] = useState<string | undefined>(undefined);
    // Toggle whether or not we should keep pinging
    const [shouldPing, setShouldPing] = useState(true);

    // need to destructure function props since React doesn't like having them in dependency arrays
    const onStageFinish = props.onStageFinish;
    const onCourseFinish = props.onCourseFinish;

    // Callback to fetch stage events
    const fetchStageEvents = useCallback(
        () => {
            if (!shouldPing)
                return;

            if (props.forceFetchStageEvents !== undefined)
                console.log(`Re-fetch force number: ${props.forceFetchStageEvents}`);

            const url = new URL(getAzureFunctions().GetEvents);
            url.searchParams.append("stage", props.stageId.toString());
            url.searchParams.append("course_code", props.courseCode);
            fetch(url.toString())
                .then(response => response.json())
                .then(json => {
                    console.log(json)
                    if (Array.isArray(json) && json.every(isStageEventModel)) {
                        if (json.length > 0) {
                            const newHP = props.max_hp - json.map(stageEvent => stageEvent.inflicted_hp).reduce((hp1, hp2) => hp1 + hp2);
                            setMonsterHP(newHP);
                        } else {
                            setMonsterHP(props.max_hp);
                        }
                        setEventsErrorMessage(undefined);
                    } else if (isStageEndModel(json)) {
                        setShouldPing(false);
                        setMonsterHP(0);
                        setTimeout(() => {setShouldPing(true); onStageFinish(json);}, BETWEEN_STAGE_TIMEOUT);
                    } else if (isCourseEndModel(json)) {
                        onCourseFinish();
                    } else {
                        setEventsErrorMessage("Received unexpected data from the backend. Check console.");
                    }
                })
                .catch(err => {
                    console.log(err);
                    setEventsErrorMessage("Unexpected error occurred while fetching stage events. Check console.");
                });
        },
        [setEventsErrorMessage, setMonsterHP, props.stageId, props.courseCode, props.max_hp, onStageFinish, onCourseFinish, props.forceFetchStageEvents, shouldPing, setShouldPing]
    );

    // Periodically update HP based on stage events
    useEffect(
        () => {
            // Immediately fetch stage events
            fetchStageEvents();
            // Continue to fetch stage events + number of players every EVENTS_INTERVAL milliseconds
            console.log("starting ping interval!");
            const interval = setInterval(fetchStageEvents, EVENTS_INTERVAL);
            return () => {
                console.log("clearing ping interval!");
                clearInterval(interval);
            }
        },
        [fetchStageEvents]
    );

    const hp = Math.max(monsterHP, 0);

    const contents = (
        <>
            {
                (!hideCourseCode)
                    ? <h3 className={styles.code}>Course code: {props.courseCode}</h3>
                    : null
            }
            {
                (!hidePlayerCount)
                    ? <PlayerCount courseId={props.courseId} className={styles.player_count}></PlayerCount>
                    : null
            }
            {
                (!hideMonster)
                    ? <img
                        className={styles.gif}
                        src={(hp > 0) ? monsterHavocGif : monsterDefeatGif}
                        alt="This evil monster is destroying Jebraville! Solve math questions to defeat the monster."
                    />
                    : null
            }
            {
                (!hideHealthNumber)
                    ? <p>{props.stageName}'s Health: {hp} / {props.max_hp}</p>
                    : null
            }
            <ProgressBar alpha={hp / props.max_hp}/>
        </>
    );

    if (eventsErrorMessage !== undefined) {
        return (
            <p>{eventsErrorMessage}</p>
        );
    } else if (hp > 0) {
        return (
            <>
                {contents}
                {props.children} 
            </>
        );
    } else {
        return (
            <>
                {contents}
                <p>{props.winMessage}</p>
            </>
        );
    }
}

export default Stage;