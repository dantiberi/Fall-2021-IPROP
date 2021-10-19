import Question from "components/Question";
import React, { useState } from "react";
import ProgressBar from "components/ProgressBar";
import useForm from "hooks/useForm";
import styles from "./Page.module.scss"
import gif from '../assets/monster_havoc.gif'

interface ProgressFormState {
    answer: string,
};
const Home: React.FC = () => {
    const initialState: ProgressFormState = {
        answer: ""
    };
 
    const [value, setValue] = useState(0);

    // a submit function that will execute upon form submission
    async function ProgressCallback() {
        // send "values" to database
        // alert('You have submitted the form.')
        if (formState.answer === "1"){
            setValue(value + 1)
        }
        if (value >= 5){
            setValue(0)
        }
    }


    // getting the event handlers from our custom hook
    const [formState, onFormChange, onFormSubmit] = useForm(
        ProgressCallback,
        initialState
    );


    return (
        <div className={styles.content}>
            <h3>Home</h3>
            <img className={styles.gif} src={gif}/>
            <ProgressBar value ={value}/>
            <Question id={4} />
            <form onSubmit={onFormSubmit}>
                <input name="answer" value={formState.answer} placeholder="answer" type="text" onChange={onFormChange} />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default Home;