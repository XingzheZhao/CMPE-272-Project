import React from "react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";

import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = "http://localhost:3001/accounts/register";
      const { data: res } = await axios.Axios(url, data);
    } catch (error) {
      if (e.response && e.response.status >= 400 && e.response.status <= 500) {
        setError(e.response.data.message);
      }
    }
  };

  return <div>Register</div>;
};

export default Register;
