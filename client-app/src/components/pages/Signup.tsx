import React from "react";

import useForm from "hooks/useForm";

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
        <div>
            <h3>Sign up</h3>
            <form onSubmit={onFormSubmit}>
                <label>
                    First Name: 
                    <input name="fname" value={formState.fname} placeholder="First name" type="text" onChange={onFormChange} />
                </label>
                <br/>
                <label>
                    Last Name: 
                    <input name="lname" value={formState.lname} placeholder="Last name" type="text" onChange={onFormChange} />
                </label>
                <br/>
                <label>
                    Email: 
                    <input name="email" value={formState.email} placeholder="Email" type="email" onChange={onFormChange} />
                </label>
                <br/>
                <label>
                    Username: 
                    <input name="username" value={formState.username} placeholder="Username" type="text" onChange={onFormChange} />
                </label>
                <br/>
                <label>
                    Password: 
                    <input name="password" value={formState.password} placeholder="Password" type="password" onChange={onFormChange} />
                </label>
                <br/>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default Signup;