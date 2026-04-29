import React, { useState } from "react";

function TaskFour({ onComplete, onNext }) {
  const [redactedIds, setRedactedIds] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [metrics, setMetrics] = useState({ score: 0, risk: 0, time: 0 });

  const missionBrief = [
    "Identify 'Pretexting' (fake stories)",
    "Spot 'Sense of Urgency' tactics",
    "Redact sensitive data leaks",
    "Stop the information harvest",
  ];

  // The conversation transcript
  const transcript = [
    {
      id: 1,
      speaker: "Caller",
      text: "Hey! This is Mike from the IT floor. We're having a massive server crash and I need to verify your login real quick so you don't lose your files.",
      isSensitive: false,
    },
    {
      id: 2,
      speaker: "Employee",
      text: "Oh no! Okay, my username is ",
      isSensitive: true,
      data: "j.doe_admin",
      tip: "Usernames give hackers 50% of the login credentials.",
    },
    {
      id: 3,
      speaker: "Caller",
      text: "Great. Now, I just sent a 6-digit code to your phone. Can you read that back to me so I can 'reset' your connection?",
      isSensitive: false,
    },
    {
      id: 4,
      speaker: "Employee",
      text: "Sure, the code is ",
      isSensitive: true,
      data: "882-194",
      tip: "Never share MFA (Multi-Factor) codes. IT will never ask for them.",
    },
    {
      id: 5,
      speaker: "Caller",
      text: "Perfect. One last thing, what's the model of the router sitting next to you? I need to check the firmware.",
      isSensitive: false,
    },
    {
      id: 6,
      speaker: "Employee",
      text: "It's a ",
      isSensitive: true,
      data: "Cisco Catalyst 9300",
      tip: "Revealing hardware models helps hackers find specific vulnerabilities (exploits).",
    },
  ];

  const toggleRedact = (id) => {
    if (submitted) return;
    setRedactedIds((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    const sensitiveItems = transcript
      .filter((t) => t.isSensitive)
      .map((t) => t.id);
    let correct = 0;

    // A redaction is correct if the user selected a sensitive item
    // AND didn't redact non-sensitive items (though in this game, we focus on the leaks)
    sensitiveItems.forEach((id) => {
      if (redactedIds.includes(id)) correct++;
    });

    const score = Math.round((correct / sensitiveItems.length) * 100);
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
        🎭 Scenario 4: Social Engineering Intercept
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
          Mission: Redact the Leak
        </p>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.5" }}>
          A social engineer is "pretexting"—pretending to be from IT to steal
          data. Read the chat below and{" "}
          <strong>click on the Employee's responses</strong> that contain
          sensitive info to redact them before the caller sees them!
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
          margin: "20px 0",
        }}
      >
        {missionBrief.map((item) => (
          <span
            key={item}
            style={{
              background: "rgba(251, 113, 133, 0.1)",
              color: "#fb7185",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: "600",
              border: "1px solid rgba(251, 113, 133, 0.3)",
            }}
          >
            🕵️ {item}
          </span>
        ))}
      </div>

      {/* Clarification Paragraph */}
      <div
        style={{
          textAlign: "center",
          margin: "25px auto",
          maxWidth: "500px",
          padding: "15px",
          background: "rgba(34, 211, 238, 0.05)",
          border: "1px dashed rgba(34, 211, 238, 0.2)",
          borderRadius: "12px",
        }}
      >
        <p
          style={{
            color: "#22d3ee",
            fontSize: "0.9rem",
            margin: 0,
            fontWeight: "500",
          }}
        >
          ⚠️ <span style={{ textDecoration: "underline" }}>Action:</span>{" "}
          <strong>☝️Click your risky messages</strong> to redact them before the
          hacker can use them.
        </p>
      </div>

      {/* Chat Interface */}
      <div
        style={{
          background: "rgba(15, 23, 42, 0.5)",
          padding: "20px",
          borderRadius: "15px",
          border: "1px solid rgba(255,255,255,0.05)",
          marginTop: "30px",
        }}
      >
        {transcript.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: "15px",
              textAlign: msg.speaker === "Caller" ? "left" : "right",
              cursor: msg.isSensitive && !submitted ? "pointer" : "default",
            }}
            onClick={() => msg.isSensitive && toggleRedact(msg.id)}
          >
            <div
              style={{
                fontSize: "0.7rem",
                color: "#64748b",
                marginBottom: "4px",
              }}
            >
              {msg.speaker.toUpperCase()}
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "10px 15px",
                borderRadius: "12px",
                maxWidth: "80%",
                background:
                  msg.speaker === "Caller"
                    ? "#1e293b"
                    : redactedIds.includes(msg.id)
                      ? "#fb7185"
                      : "#334155",
                color: redactedIds.includes(msg.id) ? "#fff" : "#e2e8f0",
                transition: "all 0.2s ease",
                border: redactedIds.includes(msg.id)
                  ? "1px solid #fb7185"
                  : "1px solid transparent",
              }}
            >
              {msg.text}
              {msg.isSensitive && (
                <span
                  style={{
                    fontWeight: "bold",
                    textDecoration: redactedIds.includes(msg.id)
                      ? "line-through"
                      : "none",
                  }}
                >
                  {redactedIds.includes(msg.id) ? "[ REDACTED ]" : msg.data}
                </span>
              )}
            </div>
            {submitted && msg.isSensitive && (
              <div
                style={{
                  fontSize: "0.8rem",
                  marginTop: "5px",
                  color: redactedIds.includes(msg.id) ? "#4ade80" : "#fb7185",
                }}
              >
                {redactedIds.includes(msg.id) ? "✓ Correct: " : "✗ Leaked: "}{" "}
                {msg.tip}
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <button className="btn-primary" onClick={handleSubmit}>
            End Intercept & Score
          </button>
        </div>
      ) : (
        <div className="results-banner">
          <h3>Security Audit Complete</h3>
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
            Proceed to Scenario 5 →
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskFour;
