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
    userPassword: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [isValidEmail, setIsValidEmail] = useState(true);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /@sjsu\.edu$/;

    const isValid = regex.test(email);
    setIsValidEmail(isValid);
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // check email validation first
    if (!isValidEmail) {
      setError("You must use your SJSU EMail Address!");
    } else {
      try {
        const url = "http://localhost:3001/accounts/register";
        const { data: res } = await axios.post(url, data);
        navigate("/login");
        window.AbortController.reloard();
      } catch (err) {
        if (
          err.response &&
          err.response.status >= 400 &&
          err.response.status <= 500
        ) {
          setError(err.response.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading</div>;
  } else {
    return (
      <div className="register_container">
        <h1 className="header">Join Spartan Market</h1>
        <form onSubmit={handleSubmit}>
          <div className="register-field">
            <TextField
              name="username"
              label="Please Enter Your Username Here"
              type="text"
              variant="outlined"
              required
              fullWidth
              onChange={handleChange}
              autoFocus
            />
          </div>
          <div className="register-field">
            <TextField
              name="password"
              label="Please Enter Your Password Here"
              type="text"
              variant="outlined"
              required
              fullWidth
              onChange={handleChange}
              autoFocus
            />
          </div>
          <div className="register-field">
            <TextField
              name="firstName"
              label="Please Enter Your First Name Here"
              type="text"
              variant="outlined"
              required
              fullWidth
              onChange={handleChange}
              autoFocus
            />
          </div>
          <div className="register-field">
            <TextField
              name="lastName"
              label="Please Enter Your Last Name Here"
              type="text"
              variant="outlined"
              required
              fullWidth
              onChange={handleChange}
              autoFocus
            />
          </div>
          <div className="register-field">
            <TextField
              name="email"
              label="Please Enter Your Email Here"
              type="text"
              variant="outlined"
              required
              fullWidth
              onChange={handleChange}
              autoFocus
            />
          </div>
          <div className="register-field">
            <TextField
              name="phoneNumber"
              label="Please Enter Your Phone Number Here"
              type="text"
              variant="outlined"
              fullWidth
              onChange={handleChange}
              autoFocus
            />
          </div>
          {error && <div className="err-msg">{error}</div>}
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
        <div className="back">
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/login"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }
};

export default Register;
