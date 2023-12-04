import React from "react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import "./Register.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { SHA256 } from "crypto-js";

const Register = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    userPassword: "",
    confirmed_password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [state, setState] = useState({
    minLength: false,
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false
})

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmed, setShowConfirmed] = useState(false);

  const validateEmail = (email) => {
    const regex = /@sjsu\.edu$/;
    const isValid = regex.test(email);

    console.log(`isvalid: ${isValid}`);

    return isValid;
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("")
  };

  const handleVisibility = () => {setShowPassword(!showPassword);}
  const handleConfirmedVisibility = () => {setShowConfirmed(!showConfirmed);}
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setData({ ...data, [e.target.name]: newPassword });

    const minLength = newPassword.length >= 8;
    const hasLower = /[a-z]/.test(newPassword);
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^a-zA-Z0-9]/.test(newPassword);

    setState({ minLength, hasLower, hasUpper, hasNumber, hasSpecial });
    setError("")
  }
  const handleConfirmedChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value }); 
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validateEmail(data.email)){
      return setError("Invalid Email. Use SJSU Email to register");
    }
    try {
      if (state.hasLower && state.hasNumber && state.hasSpecial && state.hasUpper && state.minLength && data.userPassword === data.confirmed_password){
        const url = "http://localhost:3001/accounts/register";
        const {data: res} = await axios.post(url, data);
        console.log(res.code);
        const hashed = SHA256(res.code);

        navigate(`auth/${hashed}`, {state: {data: data, code: res.code}});
        window.location.reload();
      }
      else{
        setError("Password requirements not met");
      }

      // window.AbortController.reloard();
    } 
    catch (err) {
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
              name='userPassword'
              label="Password"
              type={showPassword ? "text" : "password"}
              variant='outlined'
              required
              fullWidth
              onChange={handlePasswordChange}
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
              }}/>
          </div>

          <div className='requirements'>
            {state.minLength ? <p className='match text top_text'>- Minimum length of 8</p> : <p className='not_match text top_text'>- Minimum length of 8</p>}
            {state.hasLower ? <p className='match text'>- Has at least 1 lower case letter</p> : <p className='not_match text'>- Has at least 1 lower case letter</p>}
            {state.hasUpper ? <p className='match text'>- Has at least 1 upper case letter</p> : <p className='not_match text'>- Has at least 1 upper case letter</p>}
            {state.hasNumber ? <p className='match text'>- Has at least 1 number</p> : <p className='not_match text'>- Has at least 1 number</p>}
            {state.hasSpecial ? <p className='match text bot_text'>- Has at least 1 special charactor</p> : <p className='not_match text bot_text'>- Has at least 1 special charactor</p>}
          </div>

          <div className="register-field">
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
            }}/>
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
