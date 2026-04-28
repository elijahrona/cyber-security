import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const CORRECT_PASSWORD = "cyberSecurityPassword123@!";

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  // 1. Password Entry Screen
  if (!isAuthenticated) {
    return (
      <div className="admin-wrapper">
        <div className="login-card">
          <div className="lock-icon">🔐</div>
          <h2>Admin Access</h2>
          <p>Please enter the security key to view stats.</p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter Password"
              className="password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div className="error-message">
                ❌ Incorrect Password. Please try again.
              </div>
            )}

            <button type="submit" className="btn-primary">
              Verify Identity
            </button>
          </form>

          <button
            className="btn-secondary"
            style={{ background: "none", border: "none", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Go back Home
          </button>
        </div>
      </div>
    );
  }

  // 2. The Real Admin Content (Correct Password)
  return (
    <div
      className="admin-wrapper"
      style={{ alignItems: "flex-start", padding: "40px" }}
    >
      <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
        <header
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "20px",
            marginBottom: "30px",
          }}
        >
          <h1 style={{ fontSize: "2rem", color: "#22d3ee" }}>
            Command Center Dashboard
          </h1>
          <p style={{ color: "#94a3b8" }}>
            Welcome back, Administrator. System status: Secure.
          </p>
        </header>

        {/* You can fill this area with your stats and tables later */}
        <div
          style={{
            padding: "100px",
            textAlign: "center",
            border: "2px dashed rgba(255,255,255,0.05)",
            borderRadius: "20px",
          }}
        >
          <p style={{ color: "#475569" }}>
            Stats and User Management modules will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Admin;
