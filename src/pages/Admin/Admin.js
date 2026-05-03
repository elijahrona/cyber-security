import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [showRetries, setShowRetries] = useState(false);
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState("participants"); // "participants" or "scenarios"

  useEffect(() => {
    fetch(process.env.REACT_APP_AXIOS_FETCH_URL)
      .then((response) => response.json())
      .then((json) => {
        setData(json.data || []);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

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

  // --- 1. Data Filtering Logic (Updated for Participant Codes) ---
  const getProcessedData = () => {
    if (showRetries) return data;

    const uniqueParticipants = [];
    const seenCodes = new Set();

    data.forEach((user) => {
      // Logic: Use .code as the unique identifier
      if (!seenCodes.has(user.code)) {
        seenCodes.add(user.code);
        uniqueParticipants.push(user);
      }
    });
    return uniqueParticipants;
  };

  const activeData = getProcessedData();

  // --- 2. Math Helpers ---
  const getStats = (key) => {
    const values = activeData.flatMap((u) => u.quizzes.map((q) => q[key]));
    if (values.length === 0) return { avg: 0, median: 0, high: 0, low: 0 };

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);

    const avg = Math.round(sum / values.length);
    const high = sorted[sorted.length - 1];
    const low = sorted[0];

    const mid = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;

    return { avg, median, high, low };
  };

  const scoreStats = getStats("score");
  const riskStats = getStats("risk");
  const timeStats = getStats("time");

  const totalParticipants = activeData.length;
  const retryCount = showRetries
    ? data.length - new Set(data.map((u) => u.code)).size
    : 0;

  // --- Helper: Get Rating Logic ---
  const getRating = (score, mode) => {
    if (mode === "participants") {
      if (score >= 75) return { label: "Elite", color: "#4ade80" };
      if (score >= 50) return { label: "Competent", color: "#fbbf24" };
      return { label: "At Risk", color: "#fb7185" };
    } else {
      if (score >= 75) return { label: "Low Friction", color: "#4ade80" };
      if (score >= 50) return { label: "Moderate", color: "#fbbf24" };
      return { label: "High Priority", color: "#fb7185" };
    }
  };

  // --- Data Transformation: Per Scenario ---
  const getScenarioData = () => {
    const scenarioMap = {};
    activeData.forEach((user) => {
      user.quizzes.forEach((q) => {
        if (!scenarioMap[q.task]) {
          scenarioMap[q.task] = {
            task: q.task,
            scores: [],
            risks: [],
            times: [],
          };
        }
        scenarioMap[q.task].scores.push(q.score);
        scenarioMap[q.task].risks.push(q.risk);
        scenarioMap[q.task].times.push(q.time);
      });
    });

    return Object.values(scenarioMap).map((s) => {
      const avgScore = Math.round(
        s.scores.reduce((a, b) => a + b, 0) / s.scores.length,
      );
      const totalTime = s.times.reduce((a, b) => a + b, 0);
      return {
        id: s.task,
        name: `Scenario ${s.task}`,
        avgScore,
        avgRisk: Math.round(
          s.risks.reduce((a, b) => a + b, 0) / s.risks.length,
        ),
        avgTime: Math.round(totalTime / s.times.length),
        totalTime,
        rating: getRating(avgScore, "scenarios"),
      };
    });
  };

  const scenarioData = getScenarioData();

  const downloadCSV = () => {
    const headers = [
      "Submitted At",
      "Participant Code", // Replaced Email/Name
      "Task",
      "Score (%)",
      "Risk (%)",
      "Time (s)",
    ];

    const rows = activeData.flatMap((user) =>
      user.quizzes.map((q) => [
        q.submittedAt,
        user.code, // Participant Code
        `Scenario ${q.task}`,
        q.score,
        q.risk,
        q.time,
      ]),
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `cyber_simulation_data_${showRetries ? "full" : "filtered"}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              <div className="error-message">❌ Incorrect Password.</div>
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

  return (
    <div className="admin-wrapper" style={{ padding: "40px", color: "white" }}>
      <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            background: "rgba(255,255,255,0.03)",
            padding: "20px",
            borderRadius: "15px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div>
            <h3 style={{ margin: 0, color: "#22d3ee" }}>
              Command Center Dashboard
            </h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
              Tracking{" "}
              {showRetries ? "all sessions" : "unique participant codes"}.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "0.85rem" }}>Show Retries</span>
            <input
              type="checkbox"
              checked={showRetries}
              onChange={() => setShowRetries(!showRetries)}
              className="admin-toggle"
            />
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="admin-card">
            <h4 className="card-title">Unique Agents</h4>
            <div className="card-main-val">{totalParticipants}</div>
            <div className="card-sub-val">Duplicate Attempts: {retryCount}</div>
          </div>

          {[
            {
              label: "Score Performance (%)",
              stats: scoreStats,
              color: "#22d3ee",
            },
            {
              label: "Risk Assessment (%)",
              stats: riskStats,
              color: "#fb7185",
            },
            {
              label: "Completion Time (s)",
              stats: timeStats,
              color: "#fbbf24",
            },
          ].map((block, i) => (
            <div key={i} className="admin-card">
              <h4 className="card-title" style={{ color: block.color }}>
                {block.label}
              </h4>
              <div className="stats-row">
                <div>
                  <span>Avg</span>
                  <strong>{block.stats.avg}</strong>
                </div>
                <div>
                  <span>Med</span>
                  <strong>{block.stats.median}</strong>
                </div>
                <div>
                  <span>High</span>
                  <strong>{block.stats.high}</strong>
                </div>
                <div>
                  <span>Low</span>
                  <strong>{block.stats.low}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-slider-container">
          <div className="slider-track">
            <div
              className={`slider-thumb ${viewMode === "scenarios" ? "right" : "left"}`}
            />
            <button
              className={viewMode === "participants" ? "active" : ""}
              onClick={() => setViewMode("participants")}
            >
              Per Participant
            </button>
            <button
              className={viewMode === "scenarios" ? "active" : ""}
              onClick={() => setViewMode("scenarios")}
            >
              Per Scenario
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              {viewMode === "participants" ? (
                <tr>
                  <th>Participant Code</th>
                  <th>Retries</th>
                  <th>Avg. Score</th>
                  <th>Avg. Risk</th>
                  <th>Avg. Time</th>
                  <th>Rating</th>
                </tr>
              ) : (
                <tr>
                  <th>Scenario</th>
                  <th>Avg. Score</th>
                  <th>Avg. Risk</th>
                  <th>Avg. Time</th>
                  <th>Status</th>
                </tr>
              )}
            </thead>
            <tbody>
              {viewMode === "participants"
                ? activeData.map((user, idx) => {
                    const totalT = user.quizzes.reduce(
                      (acc, q) => acc + q.time,
                      0,
                    );
                    const avgS = Math.round(
                      user.quizzes.reduce((a, b) => a + b.score, 0) /
                        user.quizzes.length,
                    );
                    const rating = getRating(avgS, "participants");

                    return (
                      <tr key={idx}>
                        <td>
                          <strong style={{ fontFamily: "monospace" }}>
                            {user.code}
                          </strong>
                        </td>
                        <td>{user.quizzes.length - 1}</td>
                        <td>{avgS}%</td>
                        <td>{100 - avgS}%</td>
                        <td>{Math.round(totalT / user.quizzes.length)}s</td>
                        <td style={{ color: rating.color, fontWeight: "bold" }}>
                          {rating.label}
                        </td>
                      </tr>
                    );
                  })
                : scenarioData.map((s, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{s.name}</strong>
                      </td>
                      <td>{s.avgScore}%</td>
                      <td>{s.avgRisk}%</td>
                      <td>{s.avgTime}s</td>
                      <td style={{ color: s.rating.color, fontWeight: "bold" }}>
                        {s.rating.label}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div className="download-section">
          <button className="btn-primary" onClick={downloadCSV}>
            📥 Export CSV Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
