import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookies";

const Login = () => {
  const url = "http://localhost:3001/accounts/login";

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(url, { username: username, password: password })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          console.log("yea");
          document.cookie = "username=" + username + "; ";
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h3 className="log-form-title">Log In</h3>
        <label className="label-login" htmlFor="username">
          Username
        </label>
        <input
          className="log-input"
          value={username}
          type="text"
          placeholder="someuser123"
          id="username"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="label-login" htmlFor="password">
          Password
        </label>
        <input
          className="log-input"
          value={password}
          type="password"
          placeholder="*********"
          id="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="log-button" type="submit">
          Log In
        </button>
      </form>
      <a className="form-swap-button" href="/register">
        Don't have an account? Register here!
      </a>
    </div>
  );
};

export default Login;
