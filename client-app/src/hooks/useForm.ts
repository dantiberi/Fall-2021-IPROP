import { useState } from "react";

type FormChangeCallback = (event: React.ChangeEvent<HTMLInputElement>) => void;
type FormSubmitCallback = (event: React.FormEvent<HTMLFormElement>) => Promise<void>;

const useForm = function<StateType>(callback: (state: StateType) => Promise<void>, initialState: StateType): [StateType, FormChangeCallback, FormSubmitCallback] {
    const [formState, setFormState] = useState(initialState);

    // onChange
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(formState => ({ ...formState, [event.target.name]: event.target.value }));
    };

    // onSubmit
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await callback(formState); // triggering the callback
    };

    // return values
    return [
        formState,
        onChange,
        onSubmit
    ];
}

// useForm hook
export default useForm;