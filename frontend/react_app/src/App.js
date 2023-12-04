import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Auth from './Components/Auth/Auth';
import ForgetPassword from './Components/ForgetPassword/ForgetPassword';
import Homepage from './Components/Homepage/Homepage';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import Navbar from './Components/Navbar/Navbar';
import Error from './Components/Error/Error';
import SearchItem from './Components/SearchItem/SearchItem';
import Item from './Components/Item/Item';
import Login from './Components/Login/Login';
import EditItem from './Components/EditItem/EditItem';
import Report from './Components/Report/Report'
import SellItem from './Components/SellItem/SellItem';
import Register from "./Components/Register/Register";
import Profile from "./Components/Profile/Profile";
import Admin from "./Components/Admin/Admin";
import RegisterAuth from "./Components/Auth/RegisterAuth";


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" exact element={<Homepage />}/>
            <Route path='/items' exact element={<Homepage />}/>
            <Route path="/auth/:id" exact element={<Auth />}/>
            <Route path="/login" exact element={< Login/>}/>
            <Route path="/forget-password" exact element={< ForgetPassword/>}/>
            <Route path="/reset-password" exact element={<ResetPassword/>}/>
            <Route path="/item/:status/:id/edit" exact element={<EditItem/>}/>
            <Route path="/item/:status/:id" exact element={<Item/>}/>
            <Route path="/items/:text" exact element={<SearchItem/>}/>
            <Route path="/item/:status/:id/report" exact element={<Report />}/>
            <Route path='/sell-item' exact element={<SellItem/>}/>
            <Route path="/register/auth/:id" exact element={<RegisterAuth/>}/>
            <Route path="/register" exact element={<Register />} />
            <Route path="/profile" exact element={<Profile />} />
            <Route path="/admin" exact element={<Admin />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
