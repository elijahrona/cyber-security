import React, { useState } from "react";

function TaskOne({ onComplete, onNext }) {
  const [selections, setSelections] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [metrics, setMetrics] = useState({ score: 0, risk: 0, time: 0 });

  const redFlags = [
    "Urgent Action Required",
    "Official-looking but slightly off email",
    "Generic Greetings",
    "Suspicious Links",
  ];

  const examples = [
    {
      id: 1,
      from: "support@paypa1.com",
      subject: "Account Locked!",
      body: "We noticed unusual activity. Click here to verify your identity immediately or your funds will be frozen.",
      isSpam: true,
      tip: "Look at the sender's domain: 'paypa1' uses a '1' instead of an 'l'.",
    },
    {
      id: 2,
      from: "it-desk@company.com",
      subject: "System Maintenance",
      body: "The internal server will be down for 2 hours tonight. No action is required from your side.",
      isSpam: false,
      tip: "This is a neutral, informative internal email with no suspicious requests.",
    },
    {
      id: 3,
      from: "hr-noreply@microsoft-security.net",
      subject: "New Payroll Policy",
      body: "Please download the attached .exe file to view the updated payroll structure for 2026.",
      isSpam: true,
      tip: "Never download .exe files from emails. HR usually sends PDFs or internal portal links.",
    },
  ];

  const handleSelect = (id, choice) => {
    if (submitted) return;
    setSelections({ ...selections, [id]: choice });
  };

  const handleSubmit = () => {
    let correct = 0;
    examples.forEach((ex) => {
      const userChoice = selections[ex.id];
      if (
        (ex.isSpam && userChoice === "Report") ||
        (!ex.isSpam && userChoice === "Safe")
      ) {
        correct++;
      }
    });

    const score = Math.round((correct / examples.length) * 100);
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);

    const taskMetrics = {
      score: score,
      risk: 100 - score,
      time: timeTaken,
    };

    setMetrics(taskMetrics);
    setSubmitted(true);

    // Send data to parent Quiz.js
    onComplete(taskMetrics);
  };

  return (
    <div className="task-content">
      <h2 style={{ color: "#22d3ee", marginBottom: "10px" }}>
        🛡️ Scenario 1: Phishing Awareness
      </h2>

      {/* Mission Briefing Text */}
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
          Mission: Identify the Infiltrator
        </p>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.5" }}>
          Hackers often use <strong>Phishing</strong>—fake emails designed to
          look like they are from trusted sources. Your goal is to inspect the
          sender's address, the tone of the message, and any suspicious links.
          Look out for these <span style={{ color: "#ff4d4d" }}>Red Flags</span>{" "}
          before making your choice:
        </p>
      </div>

      {/* Education Section (Flags) */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
          margin: "20px 0",
        }}
      >
        {redFlags.map((flag) => (
          <span
            key={flag}
            style={{
              background: "rgba(255,77,77,0.1)",
              color: "#ff4d4d",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: "600",
              border: "1px solid rgba(255,77,77,0.3)",
              boxShadow: "0 0 10px rgba(255,77,77,0.1)",
            }}
          >
            🚩 {flag}
          </span>
        ))}
      </div>

      {/* Examples Section */}
      <div style={{ marginTop: "30px" }}>
        {examples.map((ex) => (
          <div key={ex.id} className="email-card">
            <div className="email-header">
              From: {ex.from} <br /> Subject: {ex.subject}
            </div>
            <div className="email-body">{ex.body}</div>
            <div className="choice-buttons">
              <button
                className={`choice-btn ${selections[ex.id] === "Safe" ? "selected" : ""}`}
                onClick={() => handleSelect(ex.id, "Safe")}
              >
                ✅ Looks Safe
              </button>
              <button
                className={`choice-btn ${selections[ex.id] === "Report" ? "selected" : ""}`}
                onClick={() => handleSelect(ex.id, "Report")}
              >
                🚩 Report
              </button>
            </div>
            {submitted && (
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "0.85rem",
                  color:
                    (selections[ex.id] === "Report" && ex.isSpam) ||
                    (selections[ex.id] === "Safe" && !ex.isSpam)
                      ? "#4ade80"
                      : "#fb7185",
                }}
              >
                {ex.tip}
              </div>
            )}
          </div>
        ))}
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
          <button className="btn-primary" onClick={handleSubmit}>
            Submit Answer
          </button>
          <button
            className="btn-secondary"
            onClick={() => setSelections({})}
            style={{
              background: "none",
              border: "1px solid #94a3b8",
              color: "#94a3b8",
              padding: "10px 20px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            Clear Selections
          </button>
        </div>
      ) : (
        <div className="results-banner">
          <h3>Task Complete!</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "around",
              margin: "15px 0",
              gap: "20px",
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
            Proceed to Scenario 2 →
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskOne;
