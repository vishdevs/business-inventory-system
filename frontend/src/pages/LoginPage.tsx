// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Demo credentials
  const DEMO_EMAIL = "manager@company.com";
  const DEMO_PASSWORD = "inventory123";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // simple demo check – replace with real auth later
    setTimeout(() => {
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password. Try the demo credentials.");
      }
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="login-root">
      <div className="login-frame">
        {/* Left side – hero content */}
        <section className="login-hero">
          <div className="login-brand">
            <div className="login-logo">
              <span>BI</span>
            </div>
            <div className="login-brand-text">
              <p className="login-brand-title">Business Inventory OS</p>
              <p className="login-brand-sub">Warehouse & retail analytics</p>
            </div>
          </div>

          <div className="login-hero-main">
            <h1 className="login-hero-title">
              Log in to control your inventory in real time.
            </h1>
            <p className="login-hero-body">
              Track stock levels, purchase orders, and sales performance from a
              single clean dashboard designed for busy teams.
            </p>
          </div>

          <div className="login-metrics-row">
            <div className="login-metric-card">
              <p className="login-metric-label">Sync uptime</p>
              <p className="login-metric-value">99.9%</p>
              <p className="login-metric-sub">Across all locations</p>
            </div>
            <div className="login-metric-card">
              <p className="login-metric-label">Items tracked</p>
              <p className="login-metric-value">2.4M+</p>
              <p className="login-metric-sub">Last 30 days</p>
            </div>
            <div className="login-metric-card">
              <p className="login-metric-label">Live snapshots</p>
              <p className="login-metric-value">24/7</p>
              <p className="login-metric-sub">Warehouse visibility</p>
            </div>
          </div>

          <p className="login-security-note">
            • Secure SSO and role-based access for every team member.
          </p>
        </section>

        {/* Right side – sign in panel */}
        <section className="login-panel">
          <p className="login-panel-tag">WELCOME BACK</p>
          <h2 className="login-panel-title">Sign in to</h2>
          <h2 className="login-panel-title highlight">Business Inventory</h2>
          <p className="login-panel-sub">
            Use your work email to access the admin console and branch
            dashboards.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-field-label" htmlFor="email">
              Work email
            </label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">📧</span>
              <input
                id="email"
                type="email"
                className="login-input"
                placeholder="manager@company.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label className="login-field-label" htmlFor="password">
              Password
            </label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">🔒</span>
              <input
                id="password"
                type="password"
                className="login-input"
                placeholder="Use your SSO or demo password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
              type="submit"
              className="login-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>

            

export default LoginPage;
