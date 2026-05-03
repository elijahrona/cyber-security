import React, { useState } from "react";

function TaskSeven({ onComplete, onNext }) {
  const [selections, setSelections] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [metrics, setMetrics] = useState({ score: 0, risk: 0, time: 0 });

  const safetyMarkers = [
    "Does it start with https (secure)?",
    "Is the name spelled correctly?",
    "No weird endings (like “.zip”)",
    "Looks like a real, trusted site",
  ];

  const websites = [
    {
      id: 1,
      url: "https://accounts.google.com",
      status: "Secure connection, official domain.",
      isSafe: true,
      tip: "HTTPS and the official 'google.com' domain make this a safe bet.",
    },
    {
      id: 2,
      url: "http://wellsfargo-secure-login.net",
      status: "Missing 'S' in HTTP, suspicious hyphenated domain.",
      isSafe: false,
      tip: "Banks will always use HTTPS. Also, 'wellsfargo-secure' is a common phishing tactic.",
    },
    {
      id: 3,
      url: "https://microsoft-update.com.zip",
      status: "Ends in .zip instead of a standard page path.",
      isSafe: false,
      tip: "Watch out for 'Double Extensions'. This is actually a file download disguised as a link.",
    },
    {
      id: 4,
      url: "https://vvalmart.com",
      status: "Visual trickery in the spelling.",
      isSafe: false,
      tip: "This is a Typosquatting attack. Using 'vv' instead of 'w' is a classic trick.",
    },
  ];

  const handleDecision = (id, choice) => {
    if (submitted) return;
    setSelections({ ...selections, [id]: choice });
  };

  const handleSubmit = () => {
    let correct = 0;
    websites.forEach((site) => {
      const userChoice = selections[site.id];
      if (
        (site.isSafe && userChoice === "Pass") ||
        (!site.isSafe && userChoice === "Block")
      ) {
        correct++;
      }
    });

    const score = Math.round((correct / websites.length) * 100);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    const taskMetrics = {
      score: score,
      risk: 100 - score,
      time: timeTaken,
    };

    setMetrics(taskMetrics);
    setSubmitted(true);
    onComplete(taskMetrics);
  };

  return (
    <div className="task-content">
      <h2 style={{ color: "#22d3ee", marginBottom: "10px" }}>
        🌐 Scenario 7: Spot the Fake Website
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
            fontSize: "1.2rem",
            fontWeight: "500",
            marginBottom: "8px",
          }}
        >
          Mission: Tell which websites are safe or fake.
        </p>
        <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: "1.5" }}>
          Hackers make fake websites that look real to steal your login details.
        </p>
      </div>

      <p>What to check:</p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
          margin: "20px 0",
        }}
      >
        {safetyMarkers.map((marker) => (
          <span
            key={marker}
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
            🌐 {marker}
          </span>
        ))}
      </div>

      {/* Traffic Lights Guide */}
      <div
        style={{
          textAlign: "center",
          margin: "25px auto",
          maxWidth: "500px",
          padding: "15px",
          background: "rgba(16, 185, 129, 0.05)",
          border: "1px dashed rgba(16, 185, 129, 0.2)",
          borderRadius: "12px",
        }}
      >
        <p
          style={{
            color: "#10b981",
            fontSize: "0.9rem",
            margin: 0,
            fontWeight: "500",
          }}
        >
          🛑 <strong>Your Job:</strong> Look closely at the websites.
          <strong> Pass</strong> the safe sites and <strong>Block</strong> the
          fake or suspicious ones.
        </p>
      </div>

      {/* Web Requests List */}
      <div style={{ marginTop: "30px", display: "grid", gap: "15px" }}>
        {websites.map((site) => (
          <div
            key={site.id}
            className="email-card"
            style={{
              borderLeft: selections[site.id]
                ? `4px solid ${selections[site.id] === "Pass" ? "#10b981" : "#ef4444"}`
                : "4px solid #334155",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "5px 0",
              }}
            >
              <div
                style={{
                  background: "#0f172a",
                  padding: "8px 15px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  flex: 1,
                  fontFamily: "monospace",
                  color: site.url.startsWith("https") ? "#10b981" : "#94a3b8",
                }}
              >
                {site.url.startsWith("https") ? "🔒 " : "🔓 "} {site.url}
              </div>
            </div>

            <div className="choice-buttons" style={{ marginTop: "15px" }}>
              <button
                className={`choice-btn ${selections[site.id] === "Pass" ? "selected" : ""}`}
                onClick={() => handleDecision(site.id, "Pass")}
                style={
                  selections[site.id] === "Pass"
                    ? { background: "#10b981", color: "#fff" }
                    : {}
                }
              >
                ✅ Pass
              </button>
              <button
                className={`choice-btn ${selections[site.id] === "Block" ? "selected" : ""}`}
                onClick={() => handleDecision(site.id, "Block")}
                style={
                  selections[site.id] === "Block"
                    ? { background: "#ef4444", color: "#fff" }
                    : {}
                }
              >
                🚫 Block
              </button>
            </div>

            {submitted && (
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "0.85rem",
                  color:
                    (selections[site.id] === "Pass" && site.isSafe) ||
                    (selections[site.id] === "Block" && !site.isSafe)
                      ? "#4ade80"
                      : "#fb7185",
                }}
              >
                {site.tip}
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={Object.keys(selections).length < websites.length}
          >
            {Object.keys(selections).length < websites.length
              ? "Audit All URLs First"
              : "Confirm Security Log"}
          </button>
        </div>
      ) : (
        <div className="results-banner">
          <h3>Web Marshall Report</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "15px 0",
              gap: "30px",
            }}
          >
            <div>
              <strong>Score:</strong> {metrics.score}%
            </div>
            <div>
              <strong>Risk:</strong> {metrics.risk}%
            </div>
            <div>
              <strong>Time:</strong> {metrics.time}s
            </div>
          </div>
          <button className="btn-primary" onClick={onNext}>
            Proceed to Scenario 8 →
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskSeven;
