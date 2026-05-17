import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import TrainingEffectivenessAnalyst from "./components/TrainingEffectivenessAnalyst";

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

  // --- 3. Survey Analysis Metrics ---
  const surveyStats = useMemo(() => {
    if (activeData.length === 0) return { avgPre: 0, avgPost: 0, shift: 0 };

    const calculateAvg = (surveyArray) => {
      if (!surveyArray || surveyArray.length === 0) return 0;
      const sum = surveyArray.reduce((acc, q) => acc + (q.answer || 0), 0);
      return sum / surveyArray.length;
    };

    const totalPre = activeData.reduce(
      (acc, u) => acc + calculateAvg(u.preSurvey),
      0,
    );
    const totalPost = activeData.reduce(
      (acc, u) => acc + calculateAvg(u.postSurvey),
      0,
    );

    const avgPre = (totalPre / activeData.length).toFixed(1);
    const avgPost = (totalPost / activeData.length).toFixed(1);
    const shift = (avgPost - avgPre).toFixed(1);

    return { avgPre, avgPost, shift };
  }, [activeData]);

  // Helper for the table rows
  const getSurveyAvg = (surveyArray) => {
    if (!surveyArray || surveyArray.length === 0) return 0;
    const sum = surveyArray.reduce((acc, q) => acc + (q.answer || 0), 0);
    return (sum / surveyArray.length).toFixed(1);
  };

  // Helper to determine Awareness Alignment
  const getAlignmentLabel = (user) => {
    const perf =
      user.quizzes.reduce((a, b) => a + b.score, 0) / user.quizzes.length;
    const confidence = user.postSurvey?.confidence || 0;

    if (perf > 80 && confidence > 8)
      return { label: "Expert", color: "#4ade80" };
    if (perf < 50 && confidence > 8)
      return { label: "Overconfident", color: "#fb7185" };
    if (perf > 80 && confidence < 5)
      return { label: "Underestimated", color: "#fbbf24" };
    return { label: "Learning", color: "#94a3b8" };
  };

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

  const downloadSurveyCSV = () => {
    // Define the headers based on your 5-question structure
    const headers = [
      "Agent Code",
      "Learning Path",
      "Pre: Phishing Confidence",
      "Pre: Risk Avoidance",
      "Pre: MFA Knowledge",
      "Pre: Social Engineering",
      "Pre: Network Safety",
      "Post: Phishing Confidence",
      "Post: Risk Avoidance",
      "Post: MFA Knowledge",
      "Post: Social Engineering",
      "Post: Simulation Benefit",
      "Confidence Shift",
    ];

    const rows = activeData.map((user) => {
      const pre = user.preSurvey || [];
      const post = user.postSurvey || [];

      // Calculate Averages for the Delta
      const preAvg =
        pre.reduce((acc, q) => acc + (q.answer || 0), 0) / (pre.length || 1);
      const postAvg =
        post.reduce((acc, q) => acc + (q.answer || 0), 0) / (post.length || 1);

      return [
        user.code,
        user.learningPath === "slides" ? "Slides" : "Gamified",
        pre[0]?.answer || 0,
        pre[1]?.answer || 0,
        pre[2]?.answer || 0,
        pre[3]?.answer || 0,
        pre[4]?.answer || 0,
        post[0]?.answer || 0,
        post[1]?.answer || 0,
        post[2]?.answer || 0,
        post[3]?.answer || 0,
        post[4]?.answer || 0,
        (postAvg - preAvg).toFixed(2),
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `security_survey_data_${new Date().toISOString().slice(0, 10)}.csv`,
    );
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

          {/* New Survey Insight Card */}
          <div
            className="admin-card"
            style={{ borderLeft: "4px solid #a855f7" }}
          >
            <h4 className="card-title" style={{ color: "#a855f7" }}>
              Confidence Shift
            </h4>
            <div className="card-main-val">
              {surveyStats.shift > 0
                ? `+${surveyStats.shift}`
                : surveyStats.shift}
            </div>
            <div className="card-sub-val">
              Pre: {surveyStats.avgPre} → Post: {surveyStats.avgPost}
            </div>
          </div>
        </div>

        <div className="view-slider-container">
          <div
            className="slider-track"
            style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
          >
            <div
              className={`slider-thumb`}
              style={{
                width: "33.33%",
                transform: `translateX(${
                  viewMode === "participants"
                    ? "0%"
                    : viewMode === "scenarios"
                      ? "100%"
                      : "200%"
                })`,
              }}
            />
            <button
              className={viewMode === "participants" ? "active" : ""}
              onClick={() => setViewMode("participants")}
            >
              Participants
            </button>
            <button
              className={viewMode === "scenarios" ? "active" : ""}
              onClick={() => setViewMode("scenarios")}
            >
              Scenarios
            </button>
            <button
              className={viewMode === "surveys" ? "active" : ""}
              onClick={() => setViewMode("surveys")}
            >
              Surveys
            </button>
          </div>
        </div>

        <div>
          {/* Renders right beneath the data table strictly on Survey view selection layout */}
          {viewMode !== "participants" && viewMode !== "scenarios" && (
            <div style={{ marginTop: "35px" }}>
              <TrainingEffectivenessAnalyst dataset={activeData} />
            </div>
          )}

          <div className="table-container">
            <table className="admin-table">
              <thead>
                {viewMode === "participants" ? (
                  <tr>
                    <th>Participant Code</th>
                    <th>Retries</th>
                    <th>Avg. Score</th>
                    <th>Mindset</th>
                    <th>Avg. Time</th>
                    <th>Rating</th>
                  </tr>
                ) : viewMode === "scenarios" ? (
                  <tr>
                    <th>Scenario</th>
                    <th>Avg. Score</th>
                    <th>Avg. Risk</th>
                    <th>Avg. Time</th>
                    <th>Status</th>
                  </tr>
                ) : (
                  <tr>
                    <th>Participant</th>
                    <th>Learning Path</th>
                    <th>Pre-Confidence</th>
                    <th>Post-Confidence</th>
                    <th>Growth</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {viewMode === "participants"
                  ? activeData.map((user, idx) => {
                      // Safe guards for slide-pathways containing empty quiz arrays
                      const quizCount = user.quizzes?.length || 0;
                      const totalT = quizCount
                        ? user.quizzes.reduce((acc, q) => acc + q.time, 0)
                        : 0;
                      const avgS = quizCount
                        ? Math.round(
                            user.quizzes.reduce((a, b) => a + b.score, 0) /
                              quizCount,
                          )
                        : 0;

                      const alignment = getAlignmentLabel(user);
                      const rating = getRating(avgS, "participants");

                      return (
                        <tr key={idx}>
                          <td>
                            <strong style={{ fontFamily: "monospace" }}>
                              {user.code}
                            </strong>
                          </td>
                          <td>{quizCount > 0 ? quizCount - 1 : 0}</td>
                          <td>{quizCount > 0 ? `${avgS}%` : "N/A (Slides)"}</td>
                          <td
                            style={{
                              color: alignment.color,
                              fontWeight: "500",
                            }}
                          >
                            {alignment.label}
                          </td>
                          <td>
                            {quizCount > 0
                              ? `${Math.round(totalT / quizCount)}s`
                              : "N/A"}
                          </td>
                          <td
                            style={{ color: rating.color, fontWeight: "bold" }}
                          >
                            {rating.label}
                          </td>
                        </tr>
                      );
                    })
                  : viewMode === "scenarios"
                    ? scenarioData.map((s, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong>{s.name}</strong>
                          </td>
                          <td>{s.avgScore}%</td>
                          <td>{s.avgRisk}%</td>
                          <td>{s.avgTime}s</td>
                          <td
                            style={{
                              color: s.rating.color,
                              fontWeight: "bold",
                            }}
                          >
                            {s.rating.label}
                          </td>
                        </tr>
                      ))
                    : activeData.map((user, idx) => {
                        const preAvg = getSurveyAvg(user.preSurvey);
                        const postAvg = getSurveyAvg(user.postSurvey);
                        const delta = (postAvg - preAvg).toFixed(1);

                        return (
                          <tr key={idx}>
                            <td>
                              <strong style={{ fontFamily: "monospace" }}>
                                {user.code}
                              </strong>
                            </td>
                            <td>
                              {user.learningPath === "slides"
                                ? "Slides"
                                : "Gamified"}
                            </td>
                            <td>{preAvg}/10</td>
                            <td>{postAvg}/10</td>
                            <td>
                              <span
                                style={{
                                  color: delta >= 0 ? "#4ade80" : "#fb7185",
                                  background:
                                    delta >= 0
                                      ? "rgba(74, 222, 128, 0.1)"
                                      : "rgba(251, 113, 133, 0.1)",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                }}
                              >
                                {delta > 0 ? `+${delta}` : delta}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="download-section"
          style={{ display: "flex", gap: "15px", marginTop: "20px" }}
        >
          {/* The standard performance export is always visible or only on primary tabs */}
          <button className="btn-primary" onClick={downloadCSV}>
            📥 Export Performance CSV
          </button>

          {/* NEW: Survey-specific export only shows in Survey Mode */}
          {viewMode === "surveys" && (
            <button
              className="btn-primary"
              onClick={downloadSurveyCSV}
              style={{
                background: "transparent",
                border: "1px solid #a855f7",
                color: "#a855f7",
              }}
            >
              📊 Download Survey Analytics
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
