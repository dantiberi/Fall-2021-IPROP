import React, { useState } from "react";

import styles from "./Page.module.scss"
import Fade from '@mui/material/Fade';
import PieCharts from 'components/diagrams/PieCharts'
import { Grid, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import getAzureFunctions from "getAzureFunctions";

const stats = [
    {
        subject: "exponent",
        values: [{ name: "Correct", score: 6 },
            { name: "Incorrect", score: 4 }]
    },
    {
        subject: "geometry",
        values: [{name: "Correct", score: 5 },
                { name: "Incorrect", score: 5 },]
    },
    {
        subject: "trigonometry",
        values: [{name: "Correct", score: 3 },
                { name: "Incorrect", score: 7 },]
    },
];

const students = [
    "Student 1",
    "Student 2",
    "Student 3"
]
const subjects = [
    "exponent",
    "geometry",
    "trigonometry"
]

interface statProps {
    instructor_id : string
}
const StatsPage: React.FC<statProps> = (props) => {
    const url = new URL(getAzureFunctions().GetStatistic);
        // Store course code in a variable since we use it later (and it may change since it's after the PUT request)
    url.searchParams.append("instructor_id", props.instructor_id);

    const requestInfo: RequestInit = { method: "GET" };

    fetch(url.toString(), requestInfo)
        .then(response => {
            console.log(response);
        })
        .then(json => {
            console.log(json);
        })
        .catch(err => {
            console.error(err);
        });
    const [subject, setSubject] = useState("")
    const [student, setStudent] = useState("")

    const handleChangeSubject= (event: SelectChangeEvent) => {
        setSubject(event.target.value);
    };
    const handleChangeStudent= (event: SelectChangeEvent) => {
        setStudent(event.target.value);
    };
    return (
        <div>
            <h3>Options</h3>
            <p>Options will be added soon</p>

            <span>Subject</span>
            <Select
                label="Subject"
                style={{width: 80}}
                onChange={handleChangeSubject}
                >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {subjects.map((subjectItem) =>(
                    <MenuItem value={subjectItem}>{subjectItem}</MenuItem>
                ))}
            </Select>

            <span>Student</span>
            <Select
                label="Student"
                style={{width: 80}}
                onChange={handleChangeStudent}
                >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {students.map((studentItem) =>(
                    <MenuItem value={studentItem}>{studentItem}</MenuItem>
                ))}
            </Select>

            {(student === ""? students : students.filter((studentItem) => studentItem === student)).map((value, index)=>(
                <Grid container>
                <Grid item xs={3}>
                    <p>{value}</p>
                </Grid>
                <Grid item xs={9}>
                    <PieCharts data={subject === ""? stats :stats.filter((subjectItem) => (subjectItem.subject === subject))} name={"name"} value={"score"}/>
                </Grid>

                </Grid>
            ))}

        </div>
    );
};

export default StatsPage;