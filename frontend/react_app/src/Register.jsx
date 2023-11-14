import React, { useState } from 'react'

export const Register = (props) => {

    let email, password, name;

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return(
        <div className='login-form-container'>
            <form className="login-form" onSubmit={handleSubmit}>
                <h3>Sign Up</h3>
                <label for="name">Name</label>
                <input value={name} type="name" placeholder="John Smith" id="name" name="name"/>
                <label for="email">Email</label>
                <input value={email} type="email" placeholder="myemail@abc.com" id="email" name="email"/>
                <label for="password">Password</label>
                <input value={password} type="password" placeholder="*********" id="password" name="password"/>        
                <button type='submit'>Sign Up</button>
            </form>
            <button className="form-swap-button" onClick={() => props.onFormSwitch('login')}>Already have an account? Log in here!</button> 
        </div>
    )
}