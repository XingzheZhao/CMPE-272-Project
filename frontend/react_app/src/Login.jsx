import React, { useState } from 'react'

const Login = (props) => {
    
    let email, password;

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return(
        <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h3>Log In</h3>
                <label htmlFor="email">Email</label>
                <input value={email} type="email" placeholder="myemail@abc.com" id="email" name="email"/>
                <label htmlFor="password">Password</label>
                <input value={password} type="password" placeholder="*********" id="password" name="password"/>        
                <button type='submit'>Log In</button>
            </form>
            <button className="form-swap-button" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here!</button>
        </div>
    )
}

export default Login