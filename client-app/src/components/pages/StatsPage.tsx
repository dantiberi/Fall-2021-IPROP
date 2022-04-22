import React, { useState } from "react";

import PieCharts from 'components/diagrams/PieCharts'
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";

import getAzureFunctions from "getAzureFunctions";
import SubjectModel from "models/SubjectModel";
import useFetch, { FetchStatus } from "hooks/useFetch";
import { isStatisticModel } from "models/StatisticModel";
import LoadingAnimation from "components/LoadingAnimation";

interface statProps {
    instructor_id: number,
    subjects: SubjectModel[]
}

const StatsPage: React.FC<statProps> = (props) => {
    const [subjectName, setSubjectName] = useState("");
    const [studentEmail, setStudentEmail] = useState("");

    const url = new URL(getAzureFunctions().GetStatistics);
    url.searchParams.append("instructor_id", props.instructor_id.toString());
    
    const statsFetchResult = useFetch(
        url.toString(),
        (data) => {
            // The Azure function should return the data as an array of SubjectModels
            if (Array.isArray(data) && data.every(isStatisticModel)) {
                return data;
            }
            return undefined;
        },
        [props.instructor_id]
    );

    const handleChangeSubjectName = (event: SelectChangeEvent) => {
        setSubjectName(event.target.value);
    };
    const handleChangeStudentEmail = (event: SelectChangeEvent) => {
        setStudentEmail(event.target.value);
    };

    if (statsFetchResult.status === FetchStatus.Success) {
        const stats = statsFetchResult.payload;

        const studentEmails = stats
            .map(stat => stat.email)
            .filter((email, index, array) => array.indexOf(email) === index);

        if (studentEmail !== "" && !studentEmails.includes(studentEmail)) {
            setStudentEmail("");
        }

        const statMap = new Map<string, Map<string, [number, number]>>();

        const relevantStats = stats
            .filter(stat => (studentEmail === "") || (stat.email === studentEmail))
            .filter(stat => (subjectName === "") || (stat.subject_name === subjectName))

        relevantStats.forEach(stat => {
            let emailStats = statMap.get(stat.email)

            if (emailStats === undefined) {
                emailStats = new Map<string, [number, number]>();
                statMap.set(stat.email, emailStats);
            }

            const oldValue = emailStats.get(stat.subject_name);
            if (oldValue === undefined) {
                emailStats.set(stat.subject_name, [stat.correct_attempt, stat.incorrect_attempt]);
            } else {
                const [oldCorrect, oldIncorrect] = oldValue;
                emailStats.set(stat.subject_name, [oldCorrect + stat.correct_attempt, oldIncorrect + stat.incorrect_attempt]);
            }
        });

        // const [correct, incorrect] = relevantStats
        //     .map(stat => [stat.correct_attempt, stat.incorrect_attempt])
        //     .reduce(([prev_correct, prev_incorrect], [curr_correct, curr_incorrect]) => [
        //         prev_correct + curr_correct, prev_incorrect + curr_incorrect
        //     ]);

        return (
            <div>
                <span>Subject</span>
                <Select
                    label="Subject"
                    style={{width: 80}}
                    onChange={handleChangeSubjectName}
                    value={subjectName}
                >
                    <MenuItem value={""}>
                        <em>All</em>
                    </MenuItem>
                    {props.subjects.map((subject) =>(
                        <MenuItem value={subject.subject_name} key={subject.id}>{subject.subject_name}</MenuItem>
                    ))}
                </Select>
    
                <span>Student</span>
                <Select
                    label="Student"
                    style={{width: 80}}
                    onChange={handleChangeStudentEmail}
                    value={studentEmail}
                >
                    <MenuItem value="">
                        <em>All</em>
                    </MenuItem>
                    {studentEmails.map((email) =>(
                        <MenuItem value={email}>{email}</MenuItem>
                    ))}
                </Select>
    
                {Array.from(statMap, ([email, emailStats]) => (
                    <Grid container>
                        <Grid item xs={3}>
                            <p>{email}</p>
                        </Grid>
                        <Grid item xs={9}>
                            <PieCharts
                                data={
                                    Array.from(emailStats, ([subjectName, [correct, incorrect]]) => ({
                                        subject: subjectName,
                                        values: [
                                            {
                                                name: "Correct",
                                                score: correct
                                            },
                                            {
                                                name: "Incorrect",
                                                score: incorrect
                                            }
                                        ]
                                    }))
                                }
                                name={"name"}
                                value={"score"}
                            />
                        </Grid>
                    </Grid>
                ))}
            </div>
        );
    } else if (statsFetchResult.status === FetchStatus.InProgress) {
        return (
            <>
                <p>Fetching statistics...</p>
                <LoadingAnimation />
            </>
        );
    } else {
        return (
            <p>Failed to fetch statistics! Reason: {statsFetchResult.reason}</p>
        );
    }
};

export default StatsPage;