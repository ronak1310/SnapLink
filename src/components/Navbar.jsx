import React from "react";
import {Link} from 'react-router-dom';
import "../pages/Home.css";
import logo from "../assets/logo.png";
function Navbar() {
  // Browser ki memory se username nikal rahe hain
  const username = localStorage.getItem("username");
  return (
    <nav className="top-nav" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

     {/* Left Side: Website ka Logo aur Naam */}
      <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "24px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px" }}>
        
        {/* NAYI LINE: Logo Image */}
        <img src={logo} alt="SnapLink Logo" style={{ width: "70px", height: "70px", objectFit: "contain", borderRadius: "8px", backgroundColor: "white", padding: "2px" }} />
        
        SnapLink
      </Link>
      
      {/* Right Side: Login Check */}
      <div>
        {username ? (
          // Jab user Login hoga toh ye dikhega
          <div style={{ color: "white", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
            Hi, {username} 
            <div style={{ width: "35px", height: "35px", borderRadius: "50%", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
              👤
            </div>
          </div>
        ) : (
          // Jab user Login NAHI hoga toh ye dikhega (Aapke purane buttons)
          <div style={{ display: "flex", gap: "15px" }}>
            <Link to="/login" className="nav-btn">Log In</Link>
            <Link to="/signup" className="nav-btn">Sign Up</Link>
          </div>
        )}
      </div>

    </nav>
  );
}

export default Navbar;