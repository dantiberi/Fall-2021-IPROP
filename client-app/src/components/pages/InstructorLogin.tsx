import React, { useState } from "react";

import styles from "./Page.module.scss"
import useForm from "hooks/useForm";

import getAzureFunctions from "getAzureFunctions";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Fade from '@mui/material/Fade';

import InstructorModel, { isInstructorModel } from "models/InstructorModel"; 

interface InstructorLoginProps {
    onLogin: (data: InstructorModel) => void
}

interface InstructorLoginFormState {
    username: string,
    password: string,
};

const InstructorLogin: React.FC<InstructorLoginProps> = props => {
    // login error message state
    const [loginErrorState, setLoginErrorState] = useState<string | undefined>(undefined);

    const initialState: InstructorLoginFormState = {
        username: "",
        password: "",
    };
    const [visible, setVisible] = useState(false);

    // a submit function that will execute upon form submission
    async function loginUserCallback() {
        const url = new URL(getAzureFunctions().InstructorLogin);

        const requestInfo: RequestInit = {
            method: "PUT",
            body: JSON.stringify({
                username: formState.username,
                pass: formState.password
            })
        };

        fetch(url.toString(), requestInfo)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                if (Array.isArray(json) && isInstructorModel(json[0])) {
                    // Fire onLogin callback with the InstructorModel data
                    props.onLogin(json[0]);
                } else {
                    // Data doesn't conform to InstructorModel
                    setLoginErrorState("Unexpected data returned from backend. Check the console.");
                }
            })
            .catch(err => {
                // Error occurred furing PUT request
                console.error(err);
                setLoginErrorState("An error occured during login. Check the console.");
            });
    }

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    // getting the event handlers from our custom hook
    const [formState, onFormChange, onFormSubmit] = useForm(
        loginUserCallback,
        initialState
    );

    return (
        <Fade in={true} timeout={500}>
            <div className={styles.content}>
                <h3>Instructor Log In</h3>
                <form onSubmit={onFormSubmit}>
                    <div>
                        <TextField name="username" sx={{ m: 1, width: '25ch' }} required label="Username" value={formState.username} placeholder="Username" type="text" onChange={onFormChange} />
                    </div>
                    <br/>
                    <div>                
                        <TextField name="password" required label="Password" value={formState.password} placeholder="Password" onChange={onFormChange}
                            type={visible ? 'text' : 'password'} 
                            sx={{ m: 1, width: '25ch' }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={toggleVisibility}>
                                            {visible ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                    <br/>
                    {
                        loginErrorState !== undefined
                            ? <p>{loginErrorState}</p>
                            : null
                    }
                    <input type="submit" value="Submit" />
                </form>
                <p>New to Jebra? <a href="/Signup">Create an account</a></p>
            </div>
        </Fade>
    );
};

export default InstructorLogin;