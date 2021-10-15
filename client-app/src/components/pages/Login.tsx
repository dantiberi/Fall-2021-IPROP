import React from "react";

import useForm from "hooks/useForm";

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

    // getting the event handlers from our custom hook
    const [formState, onFormChange, onFormSubmit] = useForm(
        loginUserCallback,
        initialState
    );

    return (
        <div>
            <h3>Log in</h3>
            <form onSubmit={onFormSubmit}>
                <label>
                    Email:
                    <input name="email" value={formState.email} placeholder="Email" type = "email" onChange={onFormChange} />
                </label>
                <br/>
                <label>
                    Password:
                    <input name="password" value={formState.password} placeholder="Password" type = "password" onChange={onFormChange} />
                </label>
                <br/>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default Login;