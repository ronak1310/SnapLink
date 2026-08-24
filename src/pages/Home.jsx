import React from "react";
import {Link} from 'react-router-dom';
import './Home.css';
import InputBox from "../components/InputBox"; 
import Navbar from "../components/Navbar";
function Home(){
    return(
    <div className="home-wrapper">
    <Navbar/>
    <div className="home-container">
        <h1>Make your links Snappy and shareable</h1>
    </div>
    <InputBox />
    </div>
    );
}
export default Home;