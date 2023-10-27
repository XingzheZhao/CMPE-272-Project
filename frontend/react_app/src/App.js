import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';

import Auth from './Components/Auth/Auth';
import ForgetPassword from './Components/ForgetPassword/ForgetPassword';
import Homepage from './Components/Homepage/Homepage';
import ResetPassword from './Components/ResetPassword/ResetPassword';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className='content'>
          <Routes>
            <Route path="/" exact element={<Homepage />}/>
            <Route path="/auth/:id" exact element={<Auth />}/>
            <Route path="/forget-password" exact element={< ForgetPassword/>}/>
            <Route path="/reset-password" exact element={<ResetPassword/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
