import React from "react";

function VerificationSystem({ participantCode, onIdentityChoice }) {
  // Check if ID exists in localStorage
  if (!localStorage.getItem("cyber_infiltration_code")) return null;

  return (
    <div className="onboarding-form">
      <h2 style={{ color: "#22d3ee", marginBottom: "20px" }}>
        Verification System
      </h2>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#e2e8f0" }}>
          Welcome back, <strong>{participantCode}</strong>.
        </p>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "0.9rem",
            marginBottom: "25px",
          }}
        >
          We detected a previous session. Do you want to continue as this agent
          or start fresh?
        </p>
        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            maxWidth: "500px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <button
            className="btn-primary"
            style={{ flex: 1 }}
            onClick={() => onIdentityChoice("retry")}
          >
            Resume As {participantCode}
          </button>

          <button
            className="btn-secondary-custom"
            style={{
              flex: 1,
              padding: "12px 20px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              background: "rgba(30, 41, 59, 0.7)",
              color: "#e2e8f0",
              border: "1px solid #334155",
              transition: "all 0.2s ease-in-out",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(51, 65, 85, 1)";
              e.currentTarget.style.borderColor = "#475569";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(30, 41, 59, 0.7)";
              e.currentTarget.style.borderColor = "#334155";
            }}
            onClick={() => onIdentityChoice("new")}
          >
            New Participant
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerificationSystem;
