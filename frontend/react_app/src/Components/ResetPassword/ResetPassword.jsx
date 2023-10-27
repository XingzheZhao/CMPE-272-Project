import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import "./ResetPassword.css"
import axios from 'axios';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState({
        password: "",
        confirmed_password: "",
        email: location.state.email
    });
    const [state, setState] = useState({
        minLength: false,
        hasLower: false,
        hasUpper: false,
        hasNumber: false,
        hasSpecial: false
    })
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmed, setShowConfirmed] = useState(false);
    const [err, setErr] = useState("");

    useEffect (() => {
        window.addEventListener('popstate', () => {
            return navigate("/");
        })
    })

    const handleChange = (e) => {
        const newPassword = e.target.value;
        setData({ ...data, [e.target.name]: newPassword });
    
        const minLength = newPassword.length >= 8;
        const hasLower = /[a-z]/.test(newPassword);
        const hasUpper = /[A-Z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        const hasSpecial = /[^a-zA-Z0-9]/.test(newPassword);
    
        setState({ minLength, hasLower, hasUpper, hasNumber, hasSpecial });
    }
    const handleConfirmedChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value }); 
    }
    const handleVisibility = () => {setShowPassword(!showPassword);}
    const handleConfirmedVisibility = () => {setShowConfirmed(!showConfirmed);}

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            if (state.hasLower && state.hasNumber && state.hasSpecial && state.hasUpper && state.minLength){
                const url = "http://localhost:3001/accounts/reset-password"
                await axios.post(url, data)
                navigate("/")
            }
            else{
                setErr("Password requirements not met");
            }
        }
        catch (err){
            if(err.response &&
				err.response.status >= 400 &&
				err.response.status <= 500
            ) {
                setErr(err.response.data.message)
            }
        }
    }

    if (location.state === null){
        return <Navigate replace to="/"/>;
    }

    return (
        <div className='reset_container'>
            <h1 className='header'>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <div className='reset_fields'>
                    <TextField
                        name='password'
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant='outlined'
                        required
                        fullWidth
                        onChange={handleChange}
                        onCopy={(e) => {e.preventDefault()}}
                        onPaste={(e) => {e.preventDefault()}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        onClick={handleVisibility}
                                        onMouseDown={(e) => e.preventDefault()}                                
                                    >
                                    {showPassword ? <Visibility/> : <VisibilityOff/>}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <div className='requirements'>
                    {state.minLength ? <p className='match text top_text'>- Minimum length of 8</p> : <p className='not_match text top_text'>- Minimum length of 8</p>}
                    {state.hasLower ? <p className='match text'>- Has at least 1 lower case letter</p> : <p className='not_match text'>- Has at least 1 lower case letter</p>}
                    {state.hasUpper ? <p className='match text'>- Has at least 1 upper case letter</p> : <p className='not_match text'>- Has at least 1 upper case letter</p>}
                    {state.hasNumber ? <p className='match text'>- Has at least 1 number</p> : <p className='not_match text'>- Has at least 1 number</p>}
                    {state.hasSpecial ? <p className='match text bot_text'>- Has at least 1 special charactor</p> : <p className='not_match text bot_text'>- Has at least 1 special charactor</p>}
                </div>
                <div className='lower reset_fields'>
                    <TextField
                        name='confirmed_password'
                        label="Confirmed Password"
                        type={showConfirmed ? "text" : "password"}
                        variant='outlined'
                        required
                        fullWidth
                        onChange={handleConfirmedChange}
                        onCopy={(e) => {e.preventDefault()}}
                        onPaste={(e) => {e.preventDefault()}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        onClick={handleConfirmedVisibility}
                                        onMouseDown={(e) => e.preventDefault()}                                
                                    >
                                    {showConfirmed ? <Visibility/> : <VisibilityOff/>}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                {err && <div className="err_msg">{err}</div>}
                <Button type='submit' variant="contained" color="primary" fullWidth>Submit</Button>
            </form>
        </div>
    );
};

export default ResetPassword;
