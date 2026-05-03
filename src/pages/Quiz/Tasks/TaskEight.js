import React, { useState, useEffect, useRef } from "react";

function TaskEight({ onComplete, onNext }) {
  const [gameState, setGameState] = useState("ready"); // ready, walking, locked, caught
  const [startTime, setStartTime] = useState(null);
  const [lockTime, setLockTime] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [metrics, setMetrics] = useState({ score: 0, risk: 0, time: 0 });

  const timerRef = useRef(null);

  const physicalTips = [
    "Shortcut: Win + L (PC) or Cmd + Ctrl + Q (Mac)",
    "Clear Desk Policy",
    "Privacy Screens",
    "Auto-lock Timers",
  ];

  const startGame = () => {
    setGameState("walking");
    setStartTime(Date.now());

    // Random time between 1.5 and 3.5 seconds for the snooper to arrive
    const randomDelay = Math.random() * 2000 + 1500;

    timerRef.current = setTimeout(() => {
      setGameState((prev) => (prev === "walking" ? "caught" : prev));
    }, randomDelay);
  };

  const handleLock = () => {
    if (gameState !== "walking") return;

    clearTimeout(timerRef.current);
    const endTime = Date.now();
    setLockTime(endTime - startTime);
    setGameState("locked");
  };

  const finalizeTask = () => {
    let score = 0;
    if (gameState === "locked") {
      // Reward faster reactions
      score = lockTime < 1000 ? 100 : lockTime < 2000 ? 80 : 60;
    }

    const taskMetrics = {
      score: score,
      risk: 100 - score,
      time: Math.round(lockTime / 100) / 10 || 0,
    };

    setMetrics(taskMetrics);
    setSubmitted(true);
    onComplete(taskMetrics);
  };

  useEffect(() => {
    if (gameState === "locked" || gameState === "caught") {
      finalizeTask();
    }
    return () => clearTimeout(timerRef.current);
  }, [gameState]);

  return (
    <div className="task-content">
      <h2 style={{ color: "#22d3ee", marginBottom: "10px" }}>
        🏃‍♂️ Scenario 8: The Office Snoop
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
          Mission: Secure Your Station
        </p>
        <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: "1.5" }}>
          You're heading to the breakroom for a coffee.{" "}
          <strong>A suspicious person is walking toward your desk!</strong>
          You must lock your screen before they arrive to protect company data.
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
        {physicalTips.map((tip) => (
          <span
            key={tip}
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: "600",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            🛡️ {tip}
          </span>
        ))}
      </div>

      {/* Game Visual Area */}
      <div
        style={{
          height: "250px",
          background: "#0f172a",
          borderRadius: "20px",
          margin: "30px 0",
          position: "relative",
          overflow: "hidden",
          border: "2px solid #334155",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {gameState === "ready" && (
          <button className="btn-primary" onClick={startGame}>
            Start Coffee Break
          </button>
        )}

        {gameState === "walking" && (
          <div style={{ textAlign: "center" }}>
            <div
              className="pulse-red"
              style={{ fontSize: "3rem", marginBottom: "20px" }}
            >
              🕵️‍♂️
            </div>
            <p
              style={{
                color: "#ef4444",
                fontWeight: "bold",
                letterSpacing: "2px",
              }}
            >
              SNOOPER APPROACHING!
            </p>
            <button
              onClick={handleLock}
              style={{
                marginTop: "20px",
                padding: "15px 40px",
                fontSize: "1.2rem",
                background: "#22d3ee",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
                color: "#0f172a",
              }}
            >
              🔒 LOCK SCREEN (WIN + L)
            </button>
          </div>
        )}

        {gameState === "locked" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4rem" }}>🔒</div>
            <h3 style={{ color: "#4ade80" }}>SECURE</h3>
            <p style={{ color: "#94a3b8" }}>Reaction Time: {lockTime}ms</p>
          </div>
        )}

        {gameState === "caught" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4rem" }}>🔓</div>
            <h3 style={{ color: "#ef4444" }}>DATA BREACHED!</h3>
            <p style={{ color: "#94a3b8" }}>
              The snooper reached your desk first.
            </p>
          </div>
        )}
      </div>

      {submitted && (
        <div
          className="results-banner"
          style={{ borderTop: "2px solid #ef4444" }}
        >
          <h3>Physical Security Review</h3>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#94a3b8",
              marginBottom: "15px",
            }}
          >
            Leaving your computer unlocked is like leaving your front door wide
            open.
            <strong> Always lock your screen</strong>, even if you’re just
            stepping away for a minute.
          </p>
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
              <strong>Status:</strong>{" "}
              {gameState === "locked" ? "Safe" : "Exposed"}
            </div>
            <div>
              <strong>Reaction:</strong> {metrics.time}s
            </div>
          </div>
          <button className="btn-primary" onClick={onNext}>
            Proceed to Scenario 9 →
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskEight;
