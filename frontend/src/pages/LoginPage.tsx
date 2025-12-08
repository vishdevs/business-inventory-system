import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validEmail = "admin@example.com";
    const validPassword = "admin123";

    if (email === validEmail && password === validPassword) {
      setError("");
      navigate("/dashboard");
    } else {
      setError("Wrong email or password");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card animate-login">
        {/* Small brand row */}
        <div className="login-brand">
          <div className="login-logo-dot" />
          <span className="login-brand-text">Business Inventory</span>
        </div>

        {/* Professional heading */}
        <h2 className="login-title">Sign in to your dashboard</h2>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
