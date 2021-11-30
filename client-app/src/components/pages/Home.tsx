import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Page.module.scss";
import homeStyles from "./Home.module.scss";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";

import equationSubject from "assets/subjectIcons/equationsSymbol.png";
import linearSubject from "assets/subjectIcons/linearSymbol.png";
import polynomialSubject from "assets/subjectIcons/polynomialSymbol.png";
import quadraticSubject from "assets/subjectIcons/quadraticSymbol.png";
import squareSubject from "assets/subjectIcons/SquaresSymbol.png";

import getAzureFunctions from "getAzureFunctions";
import useFetch, { FetchStatus } from "hooks/useFetch";
import { isSubjectModel } from "models/SubjectModel";

const SubjectList: React.FC = () => {
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
            <li key={subject.id} className={homeStyles.subjectContainer}>
                <img
                    className={homeStyles.png}
                    src={equationSubject}
                    alt="An icon to demonstrate the subject."
                />
                <p>{subject.subject_name}</p>
            </li>
        ))
        return (
            <>
                <h4>Available Subjects</h4>
                <ul className={homeStyles.subjectsList}>
                    {subjectListItems}
                </ul>
            </>
        );
    } else if (fetchResult.status === FetchStatus.Failure) {
        // Notify user that the subjects list couldn't be fetched
        return (
            <p>Could not fetch subjects! Reason: {fetchResult.reason}</p>
        )
    } else {
        // Notify user that the subjects list is currently being fetched
        return (
            <p>Fetching subjects list...</p>
        )
    }
}

const Home: React.FC = () => {
    return (
        <div className={styles.content}>
            <h3>Home</h3>
            <div className={homeStyles.columnContainer}>
                <SubjectList />
                <div className={homeStyles.buttonContainer}>
                    <Button className={homeStyles.createButton} href="/instructor" variant="contained" color="primary" startIcon={<CreateIcon />}>Instructor Portal</Button>
                    <Button className={homeStyles.joinButton} href="/student" variant="contained" color="success" startIcon={<AddIcon />}>Student Portal</Button>
                </div>
            </div>
        </div>
    );
};

export default Home;