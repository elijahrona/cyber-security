import React, { useState, useEffect } from "react";

function TaskTwo({ onComplete, onNext }) {
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [metrics, setMetrics] = useState({ score: 0, risk: 0, time: 0 });

  const forbiddenWords = ["password", "123456", "admin", "qwerty", "welcome"];
  const powerUps = ["@!", "#$", "789", "Uppercase", "Length > 10"];

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length > 8) score += 20;
    if (pwd.length > 12) score += 20;
    if (/[A-Z]/.test(pwd)) score += 15;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 30;

    // Penalty for forbidden words
    forbiddenWords.forEach((word) => {
      if (pwd.toLowerCase().includes(word)) score -= 50;
    });

    return Math.max(0, Math.min(100, score));
  };

  const getCrackTime = (score) => {
    if (score < 30) return "Instantly ⚡";
    if (score < 50) return "2 Minutes 🕒";
    if (score < 80) return "4 Months 📅";
    return "100+ Years 🔐";
  };

  const handleSubmit = () => {
    const finalScore = calculateStrength(password);
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);

    const taskMetrics = {
      score: finalScore,
      risk: 100 - finalScore,
      time: timeTaken,
    };

    setMetrics(taskMetrics);
    setSubmitted(true);
    onComplete(taskMetrics);
  };

  const strength = calculateStrength(password);

  return (
    <div className="task-content">
      <h2 style={{ color: "#22d3ee", marginBottom: "10px" }}>
        🛡️ Scenario 2: Fortress Password
      </h2>

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto 20px auto",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#e2e8f0",
            fontSize: "1.1rem",
            fontWeight: "500",
            marginBottom: "8px",
          }}
        >
          Mission: Create an Unbreakable Code
        </p>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.5" }}>
          Hackers use <strong>Brute Force</strong> attacks to guess thousands of
          passwords per second. Your mission is to construct a password that
          would take a supercomputer decades to crack.
        </p>
      </div>

      {/* Educational Power-ups */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
          margin: "20px 0",
        }}
      >
        {powerUps.map((item) => (
          <span
            key={item}
            style={{
              background: "rgba(34, 211, 238, 0.1)",
              color: "#22d3ee",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: "600",
              border: "1px solid rgba(34, 211, 238, 0.3)",
            }}
          >
            ⚡ {item}
          </span>
        ))}
      </div>

      {/* Password Input & Real-time Feedback */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          padding: "30px",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
          marginTop: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Type your strong password here..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={submitted}
          className="password-input"
          style={{
            marginBottom: "20px",
            textAlign: "center",
            fontSize: "1.2rem",
            letterSpacing: "2px",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
            fontSize: "0.9rem",
          }}
        >
          <span style={{ color: "#94a3b8" }}>Strength Meter: {strength}%</span>
          <span style={{ color: strength > 70 ? "#4ade80" : "#fb7185" }}>
            Cracking Time: {getCrackTime(strength)}
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div
          style={{
            width: "100%",
            height: "8px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${strength}%`,
              height: "100%",
              background:
                strength > 70
                  ? "#4ade80"
                  : strength > 40
                    ? "#fbbf24"
                    : "#fb7185",
              transition: "width 0.5s ease",
            }}
          />
        </div>

        <p style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "15px" }}>
          🚫 Avoid: {forbiddenWords.join(", ")}
        </p>
      </div>

      {/* Action Section */}
      {!submitted ? (
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            gap: "15px",
            justifyContent: "center",
          }}
        >
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!password}
          >
            Submit Password
          </button>
          <button
            className="btn-secondary"
            onClick={() => setPassword("")}
            style={{
              background: "none",
              border: "1px solid #94a3b8",
              color: "#94a3b8",
              padding: "10px 20px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      ) : (
        <div className="results-banner">
          <h3>Security Assessment Complete!</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "around",
              margin: "15px 0",
              gap: "20px",
            }}
          >
            <div>
              <strong>Final Grade:</strong> {metrics.score}%
            </div>
            <div>
              <strong>Residual Risk:</strong> {metrics.risk}%
            </div>
            <div>
              <strong>Time Taken:</strong> {metrics.time}s
            </div>
          </div>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.85rem",
              marginBottom: "20px",
            }}
          >
            {metrics.score > 80
              ? "Excellent. This password is a digital fortress!"
              : "Warning: A determined hacker could bypass this. Use more symbols and unique characters."}
          </p>
          <button className="btn-primary" onClick={onNext}>
            Proceed to Scenario 3 →
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskTwo;
