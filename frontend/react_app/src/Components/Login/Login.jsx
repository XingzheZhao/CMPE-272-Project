import React, { useState } from 'react'
import './Login.css'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookies";

const Login = () => {
    
    const url = "http://localhost:3001/accounts/login"

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(url, {username: username, password: password})
        .then(res => {
            console.log(res)
            if(res.status === 200){
                document.cookie = "username=" + username + "; ";
                navigate('/')
            }
        }).catch(err => console.log(err));
    }

    const handleLogout = (e) => {
        e.preventDefault();
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/")
    }

    return(
        <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h3>Log In</h3>
                <label htmlFor="username">Username</label>
                <input value={username} type="text" placeholder="someuser123" id="username" name="username" onChange={e => setUsername(e.target.value)}/>
                <label htmlFor="password">Password</label>
                <input value={password} type="password" placeholder="*********" id="password" name="password" onChange={e => setPassword(e.target.value)}/>        
                <button type='submit'>Log In</button>
            </form>
            <a className="form-swap-button" href='/register'>Don't have an account? Register here!</a>
            <form className="login-form" onSubmit={handleLogout}>
                <h3>Log Out</h3>
                <label>Wish to log out?</label>
                <button type='submit'>Log out</button>
            </form>
            <a className="form-swap-button" href='/'>Don't wish to logout? Go to homepage!</a>
        </div>
    )
}

export default Login;