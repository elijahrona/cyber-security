import React, { useState } from "react";

function TaskFive({ onComplete, onNext }) {
  const [cipherInput, setCipherInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [metrics, setMetrics] = useState({ score: 0, risk: 0, time: 0 });

  const cipherTarget = "TFDSFU";
  const cipherAnswer = "SECRET";

  const encryptionGoals = [
    "Confidentiality",
    "Shift Ciphers",
    "Pattern Recognition",
    "Cryptanalysis",
  ];

  const handleSubmit = () => {
    const userInput = cipherInput.toUpperCase().trim();
    let correctLetters = 0;

    // Scoring logic: Compare each character index
    for (let i = 0; i < cipherAnswer.length; i++) {
      if (userInput[i] === cipherAnswer[i]) {
        correctLetters++;
      }
    }

    const score = Math.round((correctLetters / cipherAnswer.length) * 100);
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
        🔐 Scenario 5: The Encryption Enigma
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
            fontSize: "1.1rem",
            fontWeight: "500",
            marginBottom: "8px",
          }}
        >
          Mission: Reverse the Shift
        </p>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.5" }}>
          You've intercepted a transmission from a hacker. It's encrypted using
          a <strong>Caesar Cipher</strong> with a <strong>Shift of 1</strong>{" "}
          (meaning A became B, B became C).
          <br />
          <br />
          Decipher the string below by moving each letter{" "}
          <strong>backward</strong> by one.
        </p>
      </div>

      {/* Goal Badges */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "center",
          margin: "20px 0",
        }}
      >
        {encryptionGoals.map((goal) => (
          <span
            key={goal}
            style={{
              background: "rgba(168, 85, 247, 0.1)",
              color: "#a855f7",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: "600",
              border: "1px solid rgba(168, 85, 247, 0.3)",
            }}
          >
            🔑 {goal}
          </span>
        ))}
      </div>

      {/* The Decoder Machine */}
      <div
        style={{
          background: "rgba(15, 23, 42, 0.5)",
          padding: "40px 20px",
          borderRadius: "20px",
          border: "2px solid rgba(168, 85, 247, 0.3)",
          marginTop: "30px",
          textAlign: "center",
          boxShadow: "0 0 20px rgba(168, 85, 247, 0.1)",
        }}
      >
        <div style={{ marginBottom: "25px" }}>
          <span
            style={{
              color: "#94a3b8",
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Intercepted String
          </span>
          <h1
            style={{
              color: "#a855f7",
              fontSize: "3rem",
              margin: "10px 0",
              letterSpacing: "8px",
            }}
          >
            {cipherTarget}
          </h1>

          {/* Hint Guide */}
          <div
            style={{
              marginBottom: "10px",
              padding: "5px",
              background: "rgba(168, 85, 247, 0.1)",
              borderRadius: "8px",
              border: "1px solid rgba(168, 85, 247, 0.2)",
              display: "inline-block",
            }}
          >
            <p
              style={{
                color: "#e2e8f0",
                fontSize: "0.85rem",
                margin: "0 0 5px 0",
              }}
            >
              🔍 <strong>Decoder Guide:</strong> Move 1 step <u>backward</u> in
              the alphabet.
            </p>
            <div
              style={{
                color: "#a855f7",
                fontSize: "0.9rem",
                fontFamily: "monospace",
                fontWeight: "bold",
              }}
            >
              B → A | C → B | D → C ...
            </div>
          </div>
        </div>

        <div style={{ position: "relative", display: "inline-block" }}>
          <input
            type="text"
            value={cipherInput}
            maxLength={6}
            onChange={(e) => setCipherInput(e.target.value.toUpperCase())}
            placeholder="......"
            disabled={submitted}
            style={{
              background: "#0f172a",
              border: "2px solid #a855f7",
              borderRadius: "12px",
              padding: "15px",
              color: "#fff",
              textAlign: "center",
              fontSize: "1.5rem",
              letterSpacing: "12px",
              width: "260px",
              textTransform: "uppercase",
              outline: "none",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
            }}
          />
        </div>

        {submitted && (
          <div style={{ marginTop: "20px" }}>
            <p
              style={{
                color: metrics.score === 100 ? "#4ade80" : "#fb7185",
                fontWeight: "bold",
              }}
            >
              {metrics.score === 100
                ? "✓ Full Decryption Success!"
                : `✗ Decryption Incomplete. Found ${Math.round(metrics.score / 16.6)}/6 letters.`}
            </p>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
              The plain text was: <strong>{cipherAnswer}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Action Area */}
      {!submitted ? (
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            style={{
              background: "#a855f7",
              padding: "12px 40px",
              fontSize: "1.1rem",
            }}
            disabled={cipherInput.length < 1}
          >
            Run Decryption Program
          </button>
        </div>
      ) : (
        <div
          className="results-banner"
          style={{ borderTop: "2px solid #a855f7" }}
        >
          <h3>Task Results</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "15px 0",
              gap: "30px",
            }}
          >
            <div>
              <strong>Accuracy:</strong> {metrics.score}%
            </div>
            <div>
              <strong>Risk:</strong> {metrics.risk}%
            </div>
            <div>
              <strong>Time:</strong> {metrics.time}s
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={onNext}
            style={{ background: "#a855f7" }}
          >
            Proceed to Scenario 6 →
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskFive;
