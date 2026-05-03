import React, { useState, useEffect } from "react";

function TaskThree({ onComplete, onNext }) {
  const [selections, setSelections] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [metrics, setMetrics] = useState({ score: 0, risk: 0, time: 0 });

  const networkRules = [
    "Is it secure (encrypted)?",
    "Do you trust the source?",
    "Is the port/service safe or outdated?",
    "Does anything look suspicious?",
  ];

  const packets = [
    {
      id: 1,
      protocol: "HTTPS (Port 443)",
      origin: "Authorized Employee VPN",
      payload: "Encrypted Web Traffic",
      isSafe: true,
      tip: "Port 443 is the standard for secure web traffic (HTTPS). It is usually safe for business operations.",
    },
    {
      id: 2,
      protocol: "Telnet (Port 23)",
      origin: "External IP: 185.22.4.9",
      payload: "Remote Admin Login Attempt",
      isSafe: false,
      tip: "Telnet is unencrypted and highly insecure. Modern networks use SSH (Port 22) instead.",
    },
    {
      id: 3,
      protocol: "FTP (Port 21)",
      origin: "Unknown Guest Network",
      payload: "File Transfer Request",
      isSafe: false,
      tip: "FTP transmits passwords in plain text. It should be blocked or replaced with SFTP.",
    },
    {
      id: 4,
      protocol: "SMTP (Port 25)",
      origin: "Corporate Mail Server",
      payload: "Outgoing Email Queue",
      isSafe: true,
      tip: "SMTP is necessary for email routing. Since it comes from a trusted internal server, it is safe.",
    },
  ];

  const handleDecision = (id, decision) => {
    if (submitted) return;
    setSelections({ ...selections, [id]: decision });
  };

  const handleSubmit = () => {
    let correct = 0;
    packets.forEach((pkt) => {
      const userChoice = selections[pkt.id];
      if (
        (pkt.isSafe && userChoice === "Allow") ||
        (!pkt.isSafe && userChoice === "Block")
      ) {
        correct++;
      }
    });

    const score = Math.round((correct / packets.length) * 100);
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);

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
        🌐 Scenario 3: Protect Your Network
      </h2>

      {/* Mission Briefing */}
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
          Mission: Decide what internet traffic is safe
        </p>
        <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: "1.5" }}>
          Hackers are trying to find a way into your network. You must{" "}
          <span style={{ color: "#4ade80" }}>Allow</span> safe traffic and{" "}
          <span style={{ color: "#fb7185" }}>Block</span> risky ones.
        </p>
      </div>

      <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: "1.5" }}>
        What to check:
      </p>

      {/* Network Protocols Guide */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
          margin: "20px 0",
        }}
      >
        {networkRules.map((rule) => (
          <span
            key={rule}
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
            ⚡ {rule}
          </span>
        ))}
      </div>

      <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: "1.5" }}>
        If it’s not secure or you don’t trust it, block it.
      </p>

      {/* Packet Inspection Area */}
      <div style={{ marginTop: "30px", display: "grid", gap: "15px" }}>
        {packets.map((pkt) => (
          <div
            key={pkt.id}
            className="email-card"
            style={{
              borderLeft: selections[pkt.id]
                ? `4px solid ${selections[pkt.id] === "Allow" ? "#4ade80" : "#fb7185"}`
                : "4px solid #475569",
            }}
          >
            <div
              className="email-header"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>
                <strong>Protocol:</strong> {pkt.protocol}
              </span>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Source: {pkt.origin}
              </span>
            </div>
            <div className="email-body">
              <code
                style={{
                  background: "#0f172a",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  color: "#22d3ee",
                }}
              >
                INBOUND_DATA: {pkt.payload}
              </code>
            </div>

            <div className="choice-buttons" style={{ marginTop: "15px" }}>
              <button
                className={`choice-btn ${selections[pkt.id] === "Allow" ? "selected" : ""}`}
                onClick={() => handleDecision(pkt.id, "Allow")}
                style={
                  selections[pkt.id] === "Allow"
                    ? { background: "#4ade80", color: "#000" }
                    : {}
                }
              >
                🟢 Allow
              </button>
              <button
                className={`choice-btn ${selections[pkt.id] === "Block" ? "selected" : ""}`}
                onClick={() => handleDecision(pkt.id, "Block")}
                style={
                  selections[pkt.id] === "Block"
                    ? { background: "#fb7185", color: "#fff" }
                    : {}
                }
              >
                🛑 Block
              </button>
            </div>

            {submitted && (
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "0.85rem",
                  color:
                    (selections[pkt.id] === "Allow" && pkt.isSafe) ||
                    (selections[pkt.id] === "Block" && !pkt.isSafe)
                      ? "#4ade80"
                      : "#fb7185",
                }}
              >
                {pkt.tip}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
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
            disabled={Object.keys(selections).length < packets.length}
          >
            {Object.keys(selections).length < packets.length
              ? "Analyze All Packets First"
              : "Deploy Firewall Rules"}
          </button>
        </div>
      ) : (
        <div className="results-banner">
          <h3>Simulation Report</h3>
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
            Proceed to Scenario 4 →
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskThree;
