import React from "react";
import { useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import axios from "axios";

import "./Auth.css"
import Cookies from "js-cookie";

const RegisterAuth = () => {
    const location = useLocation();
    const [data, setData] = useState({code: ""})
    
    const [hashed_code, setHashedCode] = useState(location.state.code);
    const user = location.state.data;

    const [err, setErr] = useState("");
    const [resent, setResent] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setData({...data, 
                [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const url = "https://cmpe-272-project.onrender.com/accounts/register/auth"
            await axios.post(url, {data: user, code: data.code, hashed_code: hashed_code});
            navigate('/login');
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

    const handleResend = async (e) => {
        e.preventDefault();
        try{
            const url = "https://cmpe-272-project.onrender.com/accounts/send-email"
            const {data: res} = await axios.post(url, {email: user.email});
            setHashedCode(res.code);
            setResent(res.message)
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

    if(location.state === null){
        return <Navigate replace to="/login"/>
    }
    else{
        return(
            <div>
                <div className="auth_container">
                    <p>A verificaiton code has sent to your email address, please enter the code below.
                        If you are not able to see the email, please check Spam.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="auth_field">
                            <TextField
                                name="code"
                                type="number"
                                variant="outlined"
                                required
                                fullWidth
                                onChange={handleChange}
                            />
                        </div>
                        {err && <div className="err_msg">{err}</div>}
                        <div className="resend">
                            <p className="text_email">Did not see the email? </p>
                            <p className="text_email link" onClick={handleResend}>Resend Email</p>
                        </div>
                        {resent && <div className="resent_msg">{resent}</div>}
                        <Button type='submit' variant="contained" color="primary" fullWidth>Verify</Button>
                    </form>
                </div>
            </div>
        )
    }
}

export default RegisterAuth;