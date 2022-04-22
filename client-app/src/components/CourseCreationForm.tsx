import React, { useCallback, useState } from "react";

import getAzureFunctions from "getAzureFunctions";

import InstructorModel from "models/InstructorModel";
import NewGameResponseModel, { isNewGameResponseModel } from "models/NewGameResponseModel";
import SubjectModel, { isSubjectModel } from "models/SubjectModel";

import useFetch, { FetchStatus } from "hooks/useFetch";
import useForm from "hooks/useForm";

import styles from "components/pages/Page.module.scss";

import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import LoadingAnimation from "./LoadingAnimation";

interface CourseCreationFormProps {
    instructorData: InstructorModel,
    onCourseCreated: (data: NewGameResponseModel) => void,
    subjects: SubjectModel[]
}

interface NewGameFormState {
    subjectIndex: number,
    courseName: string,
    stageHp: number,
    stageName: string
}

const CourseCreationForm: React.FC<CourseCreationFormProps> = props => {
    const initialFormState: NewGameFormState = {
        subjectIndex: 0,
        courseName: "",
        stageHp: 100,
        stageName: ""
    };

    // course creation request pending state
    const [isRequestPending, setIsRequestPending] = useState(false);

    // Course creation error message
    const [newGameErrorMessage, setNewGameErrorMessage] = useState<string | undefined>(undefined);

    // Need to memo-ize the callback since it relies on subjectFetchResult
    const newGameRequest = useCallback(
        (formState: NewGameFormState) => {
            if (formState.courseName.length < 1 || formState.courseName.length > 30) {
                setNewGameErrorMessage("Course name must be between 1 and 30 characters");
                return;
            } else if (formState.stageName.length < 1 || formState.courseName.length > 50) {
                setNewGameErrorMessage("Stage name must be between 1 and 50 characters");
                return;
            } else if (formState.stageHp <= 0) {
                setNewGameErrorMessage("Stage HP must be positive");
                return;
            } else if (props.subjects[formState.subjectIndex] === undefined) {
                setNewGameErrorMessage("Invalid subject index");
                return;
            }

            if (isRequestPending)
                return;
    
            setIsRequestPending(true);
            
            const url = new URL(getAzureFunctions().NewGame);
            url.searchParams.append("subjectName", props.subjects[formState.subjectIndex].subject_name);
            url.searchParams.append("courseName", formState.courseName);
            url.searchParams.append("instructorEmail", props.instructorData.email);
            url.searchParams.append("stageHp", formState.stageHp.toString());
            url.searchParams.append("stageName", formState.stageName);

            const requestInfo: RequestInit = { method: "PUT" };

            fetch(url.toString(), requestInfo)
                .then(response => {
                    setIsRequestPending(false);
                    return response.json();
                })
                .then(json => {
                    console.log(json);
                    if (Array.isArray(json) && json.length > 0 && isNewGameResponseModel(json[0])) {
                        props.onCourseCreated(json[0]);
                    } else {
                        setNewGameErrorMessage("Received unexpected data from backend. Check console.");
                    }
                })
                .catch(err => {
                    setIsRequestPending(false);
                    console.error(err);
                    setNewGameErrorMessage("Error occurred while making NewGame request. Check console.");
                });
        },
        [props, isRequestPending, setIsRequestPending]
    );

    // async callback simply calls memo-ized callback
    async function newGameFormCallback(formState: NewGameFormState) {
        newGameRequest(formState);
    }

    // getting the event handlers from our custom hook
    const [formState, onFormChange, onFormSubmit] = useForm(
        newGameFormCallback,
        initialFormState
    );

    if (!isRequestPending) {
        return (
            <form onSubmit={onFormSubmit}>
                <div>
                    <Select
                        required
                        name="subjectIndex"
                        id="subjectIndex"
                        sx={{ m: 1, width: '24ch' }}
                        label="Subject"
                        value={formState.subjectIndex}
                        onChange={(event) => {onFormChange(event as React.ChangeEvent<{ name: string, value: string }>);}}
                    >
                        {
                            props.subjects.map((subject, index) => (
                                <MenuItem value={index} key={subject.id}>{subject.subject_name}</MenuItem>
                            ))
                        }
                    </Select>
                </div>
                <br/>
                <div>
                    <TextField
                        required
                        name="courseName"
                        id="courseName"
                        sx={{ m: 1, width: '25ch' }}
                        label="Course Name"
                        value={formState.courseName}
                        placeholder="Jebra Course"
                        type="text"
                        onChange={onFormChange}
                    />
                </div>
                <br/>
                <div>                
                    <TextField
                        required
                        name="stageName"
                        id="stageName"
                        sx={{ m: 1, width: '25ch' }}
                        label="Stage Name"
                        value={formState.stageName}
                        placeholder="Jebra Stage"
                        type="text"
                        onChange={onFormChange}
                    />
                </div>
                <br/>
                <div>                
                    <TextField
                        required
                        name="stageHp"
                        id="stageHp"
                        sx={{ m: 1, width: '25ch' }}
                        label="Stage HP"
                        value={formState.stageHp}
                        placeholder="Stage HP"
                        type="number"
                        onChange={onFormChange}
                    />
                </div>
                {
                    (newGameErrorMessage !== undefined)
                        ? <p className={styles.error}>{newGameErrorMessage}</p>
                        : <br/>
                }
                <button name="CreateCourse">Create Course</button>
            </form>
        );
    } else {
        return (
            <>
                <p>Creating course...</p>
                <LoadingAnimation />
            </>
        )
    }
}

export default CourseCreationForm;