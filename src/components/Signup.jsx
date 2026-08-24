import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../components/InputBox.css"; // Wahi purani CSS file use kar rahe hain design ke liye

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Frontend Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    setError("");
    console.log("Signup Data Submitted:", formData);
    
    try {
      const response = await fetch("http://127.0.0.1:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // MISTAKE 1 FIXED: Function ko call kiya aur ek single object bheja
        body: JSON.stringify({ 
          name: formData.username, 
          email: formData.email, 
          pass: formData.password 
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log("Name:", data.name, "Email:", data.email, "Pass:", data.pass);
        alert("Account Created Successfully!");
        
        // MISTAKE 2 FIXED: Form ko submit hone ke baad khali (reset) kar diya
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
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
      
      {/* Simple Navbar Sign Up page ke liye */}
      <nav className="top-nav">
        <Link to="/" className="nav-btn">Home</Link>
        <Link to="/login" className="nav-btn">Log In</Link>
      </nav>

      <div className="Input-Page">
        {/* Neon Light Wrapper */}
        <div className="neon-rotating-box">
          
          {/* White Card Container */}
          <div className="box-inner-content">
            <h2 style={{ color: "#0369a1", textAlign: "center", margin: "0 0 10px 0" }}>
              Create an Account
            </h2>
            
            {/* Error Message Display */}
            {error && <p style={{ color: "red", textAlign: "center", margin: "0" }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              <div>
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit">Sign Up</button>
            </form>

            <p style={{ textAlign: "center", color: "#333", marginTop: "10px" }}>
              Already have an account? <Link to="/login" style={{ color: "#0ea5e9", textDecoration: "none", fontWeight: "bold" }}>Log In</Link>
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;