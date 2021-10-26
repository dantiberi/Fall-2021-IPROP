import React, { useState } from "react";

import pageStyles from "./Page.module.scss"
import useForm from "hooks/useForm";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface SignupFormState {
    fname: string,
    lname: string,
    email: string,
    username: string,
    password: string,
};

const Signup: React.FC = () => {
    const initialState: SignupFormState = {
        fname: "",
        lname: "",
        email: "",
        username: "",
        password: "",
    };

    const [visible, setVisible] = useState(false);
    const toggleVisibility = () => {
        setVisible(!visible);
    };
    // a submit function that will execute upon form submission
    async function signupUserCallback() {
        // send "values" to database
        alert('You have submitted the form.')
    }

    // getting the event handlers from our custom hook
    const [formState, onFormChange, onFormSubmit] = useForm(
        signupUserCallback,
        initialState
    );

    return (
        <div className={pageStyles.content}>
            <h3>Sign up</h3>
            <form onSubmit={onFormSubmit}>
                <div>
                    <TextField name="fname" required label="First name" value={formState.fname} placeholder="First name" type="text" onChange={onFormChange} />
                </div>
                <br/>
                <div>
                    <TextField name="lname" required label="Last name" value={formState.lname} placeholder="Last name" type="text" onChange={onFormChange} />
                </div>
                <br/>
                <div>
                    <TextField name="email" required label="Email" value={formState.email} placeholder="Email" type="email" onChange={onFormChange} />
                </div>
                <br/>
                <div>
                    <TextField name="username" required label="Username" value={formState.username} placeholder="Username" type="text" onChange={onFormChange} />
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

export default Signup;