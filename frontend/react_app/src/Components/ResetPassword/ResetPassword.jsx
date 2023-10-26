import React, { useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect (() => {
        window.addEventListener('popstate', () => {
            return navigate("/");
        })
    })

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
