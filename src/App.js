import './App.css';
import { lazy } from "react";
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
          <Route exact path="/login" element={<LoginPage/>}/>
          <Route exact path="/home" element={<Home/>}/>
          <Route exact path="/signup" element={<SignUpPage/>}/>
          <Route exact path="/profile" element={<Profile/>}/>
          <Route path="/" element={<LoginPage/>} />
      </Routes>
      </BrowserRouter>
      {/* <LoginPage/> */}
    </div>
  );
}

export default App;
