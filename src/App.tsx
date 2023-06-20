import React from 'react';
import './App.css';
import Home from './Components/HomePage/home';
import LoginPage  from './Components/LoginPage/LoginPage';
import SignUpPage from './Components/SignupPage/signup'
import Profile from './Components/Profile/Profile'
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/signup" element={<SignUpPage/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/" element={<LoginPage/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
