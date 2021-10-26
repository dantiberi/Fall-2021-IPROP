import React, { useState } from "react";

import styles from "./Page.module.scss"
import useForm from "hooks/useForm";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface LoginFormState {
    email: string,
    password: string,
};

const Login: React.FC = () => {
    const initialState: LoginFormState = {
        email: "",
        password: ""
    };

    // a submit function that will execute upon form submission
    async function loginUserCallback() {
        // send "values" to database
        alert('You have submitted the form.')
    }

    const [visible, setVisible] = useState(false);
    const toggleVisibility = () => {
        setVisible(!visible);
    };
    // getting the event handlers from our custom hook
    const [formState, onFormChange, onFormSubmit] = useForm(
        loginUserCallback,
        initialState
    );

    return (
        <div className={styles.content}>
            <h3>Log in</h3>
            <form onSubmit={onFormSubmit}>
                <div>
                    <TextField name="email" required label="Email" value={formState.email} placeholder="Email" type="email" onChange={onFormChange} />
                </div>
                <br/>
                <div>                
                    <TextField name="password" required label="Password" value={formState.password} placeholder="Password" onChange={onFormChange}
                    type={visible ? 'text' : 'password'} 
                    InputProps={{
                        endAdornment: (
                         <InputAdornment position="end">
                          <IconButton onClick={toggleVisibility}>
                           {visible ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                         </InputAdornment>
                        )
                       }}/>
                </div>
                <br/>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default Login;