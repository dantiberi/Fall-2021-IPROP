import React, { useCallback, useEffect, useReducer, useState } from "react";

import styles from "./Game.module.scss";

import monsterHavocGif from "assets/monster_havoc.gif";
import monsterDefeatGif from "assets/monster_defeat_no_loop.gif";

import getAzureFunctions from "getAzureFunctions";

import { isCourseEndModel } from "models/CourseEndModel";
import StageEndModel, { isStageEndModel } from "models/StageEndModel";
import { isStageEventModel } from "models/StageEventModel";

import ProgressBar from "components/ProgressBar";

import SoundSystem, {playMonsterSoundEffect} from "components/pages/SoundSystem";

interface StageProps {
    max_hp: number,
    stageName: string,
    stageId: number,
    courseCode: string,
    winMessage: string,
    onStageFinish: (data: StageEndModel) => void,
    onCourseFinish: () => void,
    forceFetchStageEvents?: number                  // Used to force Stage to re-fetch stage events when set to a new number (hacky!)
}

// Time (in milliseconds) between each GetEvents request
const EVENTS_INTERVAL = 2500;
// Time (in milliseconds) between ending a stage and moving on to the next stage
const BETWEEN_STAGE_TIMEOUT = 8000;

const Stage: React.FC<StageProps> = (props) => {
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
                    //console.log(json)
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
                    setEventsErrorMessage("Unexpected error occured while fetching stage events. Check console.");
                });
        },
        [setEventsErrorMessage, setMonsterHP, props.stageId, props.courseCode, props.max_hp, onStageFinish, onCourseFinish, props.forceFetchStageEvents, shouldPing, setShouldPing]
    );

    // Periodically update HP based on stage events
    useEffect(
        () => {
            // Immediately fetch stage events
            fetchStageEvents();
            // Continue to fetch stage events every EVENTS_INTERVAL milliseconds
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

    //Sound effect code below - Dan Tiberi
    //Setup timer interval
    //https://itnext.io/how-to-work-with-intervals-in-react-hooks-f29892d650f2
    //Define reducer to use with useReducer hook
    const soundEffectFrequency: number = 2500; //ms

    const reducer = (state: number, action: { type: any; }) => {
        switch (action.type) {
            case "tick"://Run this code every time the timer goes off
                playMonsterSoundEffect('dino1');
                return state;//Could be used to return altered state. Not needed for the sound effect system.
            default:
                return state;
        }
    } 

    const [timer, dispatchTimer] = useReducer(reducer, 0);//We wont use the timer variable. It's just here to tie the state together. We could use this setup to pass the state of timer around consistently.
    const [useSoundEffects, setUseSoundEffects] = useState(true); //True = enable sound effects by default.

    useEffect(() => {
        const soundEffectInterval = setInterval(() => {
            if(useSoundEffects){
                dispatchTimer({ type: "tick" });
            }
        }, soundEffectFrequency);
        return () => {
            console.log("Clearing sound effect interval!");
            clearInterval(soundEffectInterval);
        }
    }, [useSoundEffects]);
    //Sound effect code above

    const contents = (
        <>
            <SoundSystem></SoundSystem>
            <p>Course code: {props.courseCode}</p>
            <img
                className={styles.gif}
                src={(hp > 0) ? monsterHavocGif : monsterDefeatGif}
                alt="This evil monster is destroying Jebraville! Solve math questions to defeat the monster."
            />
            <p>{props.stageName}'s Health: {hp} / {props.max_hp}</p>
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