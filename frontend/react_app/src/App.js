import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';

import Homepage from './Components/Homepage/Homepage'
import ForgetPassword from './Components/ForgetPassword/ForgetPassword';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className='content'>
          <Routes>
            <Route path="/" exact element={<Homepage />}/>
            <Route path="forget-password" exact element={< ForgetPassword/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
