import React, { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import Login from "./Login";
import { Register } from "./Register";

import Homepage from './Components/Homepage/Homepage.jsx'

function App() {
  const [currForm, setCurrForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrForm(formName);
  }

  let comp 

  switch (window.location.pathname) {
    case "/":
      currForm === "login" ? comp = <Login onFormSwitch={toggleForm}/> : comp = <Register onFormSwitch={toggleForm}/>
      break
    case "/login":
      currForm === "login" ? comp = <Login onFormSwitch={toggleForm}/> : comp = <Register onFormSwitch={toggleForm}/>
      break
    case "/homepage":
      comp = <Homepage />
      break
    default:
      break
  }

  return (
      <div className="App">
        {
          comp
        }
      </div>
  );
}

export default App;
