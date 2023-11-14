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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Homepage />}/>
      </Routes>
      <div className="App">
        {
          currForm === "login" ? <Login onFormSwitch={toggleForm}/> : <Register onFormSwitch={toggleForm}/>
        }
      </div>
    </BrowserRouter>
  );
}

export default App;
