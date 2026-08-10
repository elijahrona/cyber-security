import React from "react";

function WelcomeScreen({
  agentName,
  setAgentName,
  onStart,
  onShowInstructions,
}) {
  return (
    <>
      <h1>Cyber Infiltration Defense</h1>
      <p>
        You are about to enter a series of tactical simulations. Learn the
        tasks, analyze real-world examples, and solve critical scenarios to keep
        the office network safe.
      </p>

      {/* Consent Section */}
      <div
        style={{
          margin: "25px 0",
          padding: "15px",
          background: "#f8fafc",
          borderRadius: "12px",
          border: "1px solid #cbd5e1",
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: "0.8rem",
            color: "#334155",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Participant Consent Form
        </label>
        <input
          type="text"
          placeholder="Enter your name to give consent..."
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            background: "#ffffff",
            border: "1px solid #64748b",
            borderRadius: "8px",
            color: "#111827",
            outline: "none",
            fontSize: "1rem",
          }}
        />
        <p
          style={{
            fontSize: "0.75rem",
            color: "#64748b",
            marginTop: "8px",
            fontStyle: "italic",
          }}
        >
          * By entering your name, you agree to participate in this security
          simulation.
        </p>
      </div>

      <div className="quiz-actions">
        <button
          className="btn-primary"
          disabled={!agentName.trim()} // Disabled if name is empty
          style={{
            opacity: !agentName.trim() ? 0.5 : 1,
            cursor: !agentName.trim() ? "not-allowed" : "pointer",
          }}
          onClick={onStart}
        >
          Give Consent and Start Quiz
        </button>
        <button
          className="btn-secondary"
          style={{
            border: "1px solid #94a3b8",
            padding: "12px 25px",
            borderRadius: "12px",
            background: "none",
            color: "#0f172a",
            cursor: "pointer",
          }}
          onClick={onShowInstructions}
        >
          How to Play
        </button>
      </div>
    </>
  );
}

export default WelcomeScreen;
