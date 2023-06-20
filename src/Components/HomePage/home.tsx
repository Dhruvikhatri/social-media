import React from "react";
import NavBar from "../NavBar/NavBar";
import './home.css';
import Main from "../MainContent/Main";

const Home: React.FC = () => {
  return (
    <>
      <NavBar />
      <Main />
    </>
  );
}

export default Home;