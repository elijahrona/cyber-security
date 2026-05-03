import React, { useState, useEffect } from "react";

function TaskNine({ onComplete, onNext }) {
  const [notifications, setNotifications] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [metrics, setMetrics] = useState({ score: 0, risk: 0, time: 0 });

  const mfaTips = [
    "Never 'Approve' if you didn't just log in",
    "Report the 'Push Storm' to IT",
    "Change your password immediately",
    "Use Number Matching MFA if available",
  ];

  // Logic to simulate the "Storm"
  useEffect(() => {
    if (submitted) return;

    const interval = setInterval(() => {
      if (notifications.length < 8) {
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: "Login Request: Lagos, NG (IP: 192.168.1.1)",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [notifications, submitted]);

  const handleAction = (type) => {
    if (submitted) return;

    let score = 0;
    if (type === "deny_and_change") {
      score = 100;
    } else if (type === "deny_only") {
      score = 50; // Better than approving, but password is still compromised
    }

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
        📱 Scenario 9: Notification Spam Attack
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
          Mission: Don’t fall for the spam trick.
        </p>
        <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: "1.5" }}>
          Your phone keeps getting login approval requests, but you didn’t try
          to log in. A hacker is hoping you’ll press “Approve” by mistake.
        </p>
      </div>

      <p>Simple Rule: If you didn’t log in, NEVER press approve.</p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
          margin: "20px 0",
        }}
      >
        {mfaTips.map((tip) => (
          <span
            key={tip}
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
            🛡️ {tip}
          </span>
        ))}
      </div>

      {/* Virtual Phone Interface */}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
      >
        <div
          style={{
            width: "300px",
            height: "500px",
            background: "#1e293b",
            borderRadius: "40px",
            border: "8px solid #334155",
            position: "relative",
            overflowY: "hidden",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "5px",
              background: "#334155",
              borderRadius: "10px",
              margin: "0 auto 20px auto",
            }}
          ></div>

          {/* Incoming Push Notifications */}
          <div
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              gap: "10px",
            }}
          >
            {notifications.map((n, i) => (
              <div
                key={n.id}
                style={{
                  background: "rgba(255,255,255,0.9)",
                  padding: "10px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                  animation: "slideIn 0.3s ease-out",
                  opacity: i < notifications.length - 3 ? 0.5 : 1, // Fade older ones
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.7rem",
                    color: "#475569",
                    fontWeight: "bold",
                  }}
                >
                  <span>SECURITY ALERT</span>
                  <span>{n.time}</span>
                </div>
                <p
                  style={{
                    color: "#1e293b",
                    fontSize: "0.85rem",
                    margin: "5px 0",
                  }}
                >
                  {n.text}
                </p>
                <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
                  <button
                    style={{
                      flex: 1,
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      fontSize: "0.7rem",
                      padding: "5px",
                      borderRadius: "4px",
                    }}
                  >
                    Deny
                  </button>
                  <button
                    style={{
                      flex: 1,
                      background: "#22c55e",
                      color: "white",
                      border: "none",
                      fontSize: "0.7rem",
                      padding: "5px",
                      borderRadius: "4px",
                    }}
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>

          {submitted && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(15, 23, 42, 0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "20px",
                borderRadius: "32px",
              }}
            >
              <div>
                <h3
                  style={{
                    color: metrics.score === 100 ? "#4ade80" : "#fb7185",
                  }}
                >
                  {metrics.score === 100
                    ? "Threat Neutralized"
                    : "Account Compromised"}
                </h3>
                <p
                  style={{
                    color: "#e2e8f0",
                    fontSize: "0.8rem",
                    marginTop: "10px",
                  }}
                >
                  {metrics.score === 100
                    ? "By denying the request and changing your password, you stopped the attacker even though they knew your credentials."
                    : "Simply denying isn't enough. If you get a push storm, the hacker ALREADY has your password."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decision Panel */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <h4 style={{ color: "#e2e8f0", marginBottom: "15px" }}>
          What is your next move?
        </h4>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            className="choice-btn"
            onClick={() => handleAction("approve")}
            disabled={submitted}
          >
            Approve one to make it stop
          </button>
          <button
            className="choice-btn"
            onClick={() => handleAction("deny_only")}
            disabled={submitted}
          >
            Deny all requests
          </button>
          <button
            className="choice-btn"
            onClick={() => handleAction("deny_and_change")}
            disabled={submitted}
          >
            Deny all + Change Password Immediately
          </button>
        </div>
      </div>

      {submitted && (
        <div className="results-banner">
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
            Proceed to Final Task →
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskNine;
