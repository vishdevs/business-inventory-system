import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const DEMO_EMAIL = "manager@company.com";
const DEMO_PASSWORD = "inventory123";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Frontend-only demo check (credentials NOT shown in UI)
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } else {
      setError("Invalid email or password");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-shell">
        {/* LEFT PANEL */}
        <section className="login-panel login-panel-left">
          <header className="login-brand">
            <div className="login-logo-circle">BI</div>
            <div className="login-brand-text">
              <span className="login-brand-title">Business Inventory OS</span>
              <span className="login-brand-subtitle">
                Control stock, orders & revenue in real time.
              </span>
            </div>
          </header>

          <div className="login-main-copy">
            <h1 className="login-hero-heading">
              Log in to control your inventory in real time.
            </h1>
            <p className="login-hero-subtext">
              Track stock levels, purchase orders, sales and locations from a
              single clean dashboard designed for busy teams.
            </p>
          </div>

          <div className="login-stats-row">
            <div className="login-stat-card">
              <div className="login-stat-label">Uptime</div>
              <div className="login-stat-value">99.9%</div>
              <div className="login-stat-foot">Across all branches</div>
            </div>
            <div className="login-stat-card">
              <div className="login-stat-label">Items tracked</div>
              <div className="login-stat-value">2.4M+</div>
              <div className="login-stat-foot">Last 50 days</div>
            </div>
            <div className="login-stat-card">
              <div className="login-stat-label">Snapshots</div>
              <div className="login-stat-value">Live</div>
              <div className="login-stat-foot">Warehouse view</div>
            </div>
          </div>

          <div className="login-bullets">
            <div className="login-bullet">
              <span className="login-bullet-dot" />
              <span>Secure SSO-ready architecture</span>
            </div>
            <div className="login-bullet">
              <span className="login-bullet-dot" />
              <span>Role-based access for all staff accounts</span>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="login-panel login-panel-right">
          <div className="login-card">
            <p className="login-pill">WELCOME BACK</p>
            <h2 className="login-card-heading">
              Sign in to Business Inventory
            </h2>
            <p className="login-card-subtext">
              Use your work email to access the admin console and branch
              dashboards.
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="login-field-label" htmlFor="email">
                Work email
              </label>
              <div className="login-input-wrapper">
                <span className="login-input-icon" aria-hidden="true">
                  📧
                </span>
                <input
                  id="email"
                  type="email"
                  className="login-input"
                  placeholder="you@company.com"
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
                <span className="login-input-icon" aria-hidden="true">
                  🔒
                </span>
                <input
                  id="password"
                  type="password"
                  className="login-input"
                  placeholder="Enter your password"
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
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
