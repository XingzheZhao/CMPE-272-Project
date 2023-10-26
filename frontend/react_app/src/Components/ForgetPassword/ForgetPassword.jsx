import React from "react"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, TextField } from "@mui/material";

import "./ForgetPassword.css"

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: "",
        username: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const url = "http://localhost:3001/accounts/forget-password";
            const {data: res, code: valiCode} = await axios.post(url, data);
            console.log(res, valiCode);
            navigate("/reset-password", );
            window.location.reload();
        }
        catch (e) {
            if (e.response && e.response.status >= 400 && e.response.status <= 500){
                setError(e.response.data.message);
            }
		}
    }

    return (
        <div className="forget_container">
            <h1 className="header">Enter Email and Username</h1>
            <form onSubmit={handleSubmit}>
                <div className="forget-field">
                    <TextField
                        name="email"
                        label="Email"
                        type="text"
                        variant="outlined"
                        required
                        fullWidth
                        onChange={handleChange}
                        autoFocus
                    />
                </div>
                <div className="forget-field">
                    <TextField
                        name="username"
                        label="Username"
                        type="text"
                        variant="outlined"
                        required
                        fullWidth
                        onChange={handleChange}
                        autoFocus
                    />
                </div>
                {error && <div className="err-msg">{error}</div>}
                <Button type="submit" variant="contained" color="primary" fullWidth>Submit</Button>
            </form>
        </div>
    )
}

export default ForgetPassword;