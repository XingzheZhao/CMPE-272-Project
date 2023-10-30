import React from "react";

export const Register = (props) => {
    return (
        <>
            Register Page
            <button onClick={() => props.onFormSwitch('login')}>Already have an account? Log In here</button>
        </>
    )
}