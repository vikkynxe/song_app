import React, { useState } from "react";
import "../Style/log_in.css";

const Login = () => {
  const [user_name, setUsername] = useState("");
  const [password, setPassword] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:8000/api/sign_in/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Success:", data);

      localStorage.setItem("isLoggedIn", "true");
      

      // If your backend returns a token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      alert("Login Successful!");
      
      window.location.href = "/HomePage";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Unable to connect to the server.");
  }
};

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="input-group">
          <label>User Name</label>
          <input
            type="text"
            placeholder="Enter your User name"
            value={user_name}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>

        <p className="signup-text">
          Don't have an account? <a href="/create_account">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
