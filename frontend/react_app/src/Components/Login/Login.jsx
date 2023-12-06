import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookies";

const Login = () => {
  const url = "https://cmpe-272-project.onrender.com/accounts/login";

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const result = await axios.post(
        url,
        { username: username, password: password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(result.data[0]);
        document.cookie = "username=" + username + "; ";
        Cookies.setItem("id", result.data[0].user_id);
        if (result.data[0].is_admin) {
          Cookies.setItem("role", "admin");
        } else {
          Cookies.setItem("role", "user");
        }
      navigate("/");
    }
    catch(err){
      console.log(err);
      setErr(err.response.data.message)
    }
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
        <p
          className="to_forgetpassword"
          onClick={() => {
            navigate("/forget-password");
          }}
        >
          Forget Password?
        </p>
        {err && <div className="err_msg">{err}</div>}
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
