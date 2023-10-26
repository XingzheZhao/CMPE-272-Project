import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState({
        password: "",
        confirmed_password: "",
        email: location.state.email
    });
    const [err, setErr] = useState("");

    useEffect (() => {
        window.addEventListener('popstate', () => {
            return navigate("/");
        })
    })

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value});
    }

    const handleSubmit = async () => {
        try{
            
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
        <div>
            <h1>Hello World</h1>
        </div>
    );
};

export default ResetPassword;
