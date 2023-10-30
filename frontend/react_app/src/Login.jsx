import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';

import Homepage from './Components/Homepage/Homepage.jsx'

export const Login = (props) => {
    const [email] = useState('');
    const [pass] = useState('');

    const navigate = useNavigate();

    const navigateHome = () => {
        navigate(Homepage);
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
        console.log(pass);
    }

    return (
        <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="email" placeholder="youremail@gmail.com" id="email" name="email"/>
                <label htmlFor="password">Password</label>
                <input type="password" placeholder="********" id="password" name="password"/>
                <button type="submit" onClick={navigateHome}>Log In</button>
            </form>
            <button className= "link-button" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here</button>
        </div>
    )
}