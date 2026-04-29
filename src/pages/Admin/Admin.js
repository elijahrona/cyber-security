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

  // --- 1. Data Filtering Logic ---
  const getProcessedData = () => {
    if (showRetries) return data;

    // Filter for only the first occurrence of each email
    const uniqueParticipants = [];
    const seenEmails = new Set();

    data.forEach((user) => {
      if (!seenEmails.has(user.email)) {
        seenEmails.add(user.email);
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

    // Simplified Median Logic
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
    ? data.length - new Set(data.map((u) => u.email)).size
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
    // 1. Define the headers
    const headers = [
      "Submitted At",
      "Name",
      "Email",
      "Task",
      "Score (%)",
      "Risk (%)",
      "Time (s)",
    ];

    // 2. Flatten the data: Create a row for every quiz entry
    const rows = activeData.flatMap((user) =>
      user.quizzes.map((q) => [
        q.submittedAt,
        user.name,
        user.email,
        `Scenario ${q.task}`,
        q.score,
        q.risk,
        q.time,
      ]),
    );

    // 3. Convert to CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");

    // 4. Trigger Download
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
    <div className="admin-wrapper" style={{ padding: "40px", color: "white" }}>
      <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
        {/* Toggle Section */}
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
              Metrics are currently calculated using{" "}
              {showRetries
                ? "all session attempts"
                : "initial participant entries only"}
              .
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
        {/* Dashboard Cards Grid */}
        <div className="dashboard-grid">
          {/* Participants Card */}
          <div className="admin-card">
            <h4 className="card-title">Participants</h4>
            <div className="card-main-val">{totalParticipants}</div>
            <div className="card-sub-val">Retries Detected: {retryCount}</div>
          </div>

          {/* Metric Tables */}
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
                  <span>Average</span>
                  <strong>{block.stats.avg}</strong>
                </div>
                <div>
                  <span>Median</span>
                  <strong>{block.stats.median}</strong>
                </div>
                <div>
                  <span>Highest</span>
                  <strong>{block.stats.high}</strong>
                </div>
                <div>
                  <span>Lowest</span>
                  <strong>{block.stats.low}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* --- View Slider (Segmented Control) --- */}
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
        {/* --- Data Table --- */}
        <div className="table-container">
          <table className="admin-table">
            <thead>
              {viewMode === "participants" ? (
                <tr>
                  <th>Participant</th>
                  <th>Retries</th>
                  <th>Avg. Score</th>
                  <th>Avg. Risk</th>
                  <th>Avg. Time</th>
                  <th>Total Time</th>
                  <th>Rating</th>
                </tr>
              ) : (
                <tr>
                  <th>Scenario</th>
                  <th>Avg. Score</th>
                  <th>Avg. Risk</th>
                  <th>Avg. Time</th>
                  <th>Total Time</th>
                  <th>Status</th>
                </tr>
              )}
            </thead>
            <tbody>
              {viewMode === "participants"
                ? activeData.map((user, idx) => {
                    const scores = user.quizzes.map((q) => q.score);

                    // FIXED: Point specifically to q.time inside the reduce
                    const totalT = user.quizzes.reduce(
                      (acc, q) => acc + q.time,
                      0,
                    );

                    const avgS = Math.round(
                      scores.reduce((a, b) => a + b, 0) / scores.length,
                    );
                    const avgT = Math.round(totalT / user.quizzes.length);

                    const rating = getRating(avgS, "participants");

                    return (
                      <tr key={idx}>
                        <td>
                          <div className="user-info">
                            <strong>{user.name}</strong>
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td>{user.quizzes.length - 1}</td>
                        <td>{avgS}%</td>
                        <td>{100 - avgS}%</td>
                        <td>{Math.round(totalT / user.quizzes.length)}s</td>
                        <td>{totalT}s</td>
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
                      <td>{s.totalTime}s</td>
                      <td style={{ color: s.rating.color, fontWeight: "bold" }}>
                        {s.rating.label}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div className="download-section">
          <div className="download-header">
            <button className="btn-primary" onClick={downloadCSV}>
              📥 Download CSV Data
            </button>
            <p className="download-notice">
              {showRetries
                ? "⚠️ Notice: You are downloading the FULL dataset including all participant retries."
                : "✅ Notice: You are downloading the FILTERED dataset (First attempts only)."}
            </p>
          </div>

          <div className="field-legend">
            <h4>Field Definitions</h4>
            <div className="legend-grid">
              <div className="legend-item">
                <strong>Submitted At</strong>
                <span>Timestamp (YYYY-MM-DD HH:MM:SS) of task completion.</span>
              </div>
              <div className="legend-item">
                <strong>Task</strong>
                <span>The specific scenario ID (1-14).</span>
              </div>
              <div className="legend-item">
                <strong>Score / Risk</strong>
                <span>
                  Performance metrics calculated based on task accuracy.
                </span>
              </div>
              <div className="legend-item">
                <strong>Time</strong>
                <span>Duration in seconds taken to submit the scenario.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
