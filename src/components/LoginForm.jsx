import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../components/InputBox.css"; // Design ke liye same CSS use karenge
import {useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation check
    if (!formData.email || !formData.password) {
      setError("Please fill in both fields.");
      return;
    }
    
    setError("");
    console.log("Login Data Submitted:", formData);
    
    // Future me yahan Flask Backend API ko call karenge
    // fetch('http://localhost:5000/login', { ... })
    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // MISTAKE 1 FIXED: Function ko call kiya aur ek single object bheja
        body: JSON.stringify({ 
          email: formData.email, 
          pass: formData.password
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log("Email:", data.email, "Pass:", data.pass);
        localStorage.setItem("username", data.username);// browser localstorage me ham save kr rhe h user ka name 
        alert("Logged in Successfully!");
        
        // MISTAKE 2 FIXED: Form ko submit hone ke baad khali (reset) kar diya
        setFormData({
          email: "",
          password: "",
        });
        navigate("/");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.log("connection failed", error);
      alert("Backend not working");
    }
  };

  return (
    <div className="home-wrapper"> {/* Sky Blue Background ke liye */}
      
      {/* Simple Navbar Login page ke liye */}
      <nav className="top-nav">
        <Link to="/" className="nav-btn">Home</Link>
        <Link to="/signup" className="nav-btn">Sign Up</Link>
      </nav>

      <div className="Input-Page">
        {/* Neon Light Wrapper */}
        <div className="neon-rotating-box">
          
          {/* White Card Container */}
          <div className="box-inner-content">
            <h2 style={{ color: "#0369a1", textAlign: "center", margin: "0 0 10px 0" }}>
              Welcome Back 👋
            </h2>
            
            {/* Error Message Display */}
            {error && <p style={{ color: "red", textAlign: "center", margin: "0" }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit">Log In</button>
            </form>

            <p style={{ textAlign: "center", color: "#333", marginTop: "10px" }}>
              Don't have an account? <Link to="/signup" style={{ color: "#0ea5e9", textDecoration: "none", fontWeight: "bold" }}>Sign Up</Link>
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;