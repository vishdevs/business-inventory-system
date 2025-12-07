import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);

    // Demo-only: simulate login then go to dashboard
    setTimeout(() => {
      navigate("/dashboard");
    }, 600);
  };

  const handleDemoClick = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 400);
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        {/* LEFT SIDE – brand / description */}
        <div className="login-left">
          <div className="login-left-header">
            <div className="login-logo-mark">BI</div>
            <div className="login-logo-text">
              <span className="login-logo-title">Business Inventory</span>
              <span className="login-logo-subtitle">Admin workspace</span>
            </div>
          </div>

          <div className="login-left-body">
            <h2>Control products, stock and sales in one view.</h2>
            <p>
              A clean, modern inventory dashboard designed as a SaaS-style
              portfolio project. Focused on clarity, speed and everyday use.
            </p>

            <ul>
              <li>• Products, sales and low stock indicators</li>
              <li>• Simple, keyboard-friendly interface</li>
              <li>• Ready to connect to a real backend API</li>
            </ul>

            <div className="login-highlight-card">
              <div>
                <div className="login-highlight-label">Today&apos;s activity</div>
                <div className="login-highlight-value">
                  +18 orders · 6 low stock alerts
                </div>
              </div>
              <div className="login-highlight-badges">
                <span className="login-highlight-pill login-pill-success">
                  ↑ 12% vs yesterday
                </span>
                <span className="login-highlight-pill">Demo environment</span>
              </div>
            </div>
          </div>

          <div className="login-left-footer">
            <span className="login-footer-label">Designed for</span>
            <span className="login-footer-text">
              Small shops, distributors and retail chains.
            </span>
          </div>
        </div>

        {/* RIGHT SIDE – actual form */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-card-header">
              <div className="login-card-logo">BI</div>
              <div>
                <h1>Sign in to dashboard</h1>
                <p>
                  Use the demo credentials or any email and password to explore
                  the interface.
                </p>
              </div>
            </div>

            <div className="login-demo-banner">
              <span className="login-demo-label">Demo credentials</span>
              <span className="login-demo-value">admin@demo.com / admin123</span>
              <span className="login-demo-chip">No real authentication</span>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="●●●●●●●●"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="login-form-footer">
                <label className="login-remember">
                  <input type="checkbox" />
                  <span>Remember for 7 days</span>
                </label>

                <button
                  type="button"
                  className="login-link-button"
                  onClick={() =>
                    alert("Password reset is not connected in this demo.")
                  }
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="login-primary-btn"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>

              <button
                type="button"
                className="login-secondary-btn"
                onClick={handleDemoClick}
                disabled={loading}
              >
                Continue as demo viewer
              </button>

              <div className="login-meta">
                <span>Frontend-only prototype · Authentication not wired.</span>
              </div>
            </form>
          </div>

          <div className="login-right-footer">
            <span>© {new Date().getFullYear()} Business Inventory Dashboard</span>
            <span>Built for portfolio demonstrations</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
