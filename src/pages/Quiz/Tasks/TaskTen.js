import React, { useState } from "react";

function TaskTen({ onComplete, onNext }) {
  const [order, setOrder] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [metrics, setMetrics] = useState({ score: 0, risk: 0, time: 0 });

  const steps = [
    {
      id: "prep",
      text: "Preparation",
      desc: "Training and tools before a breach happens.",
      correctPos: 0,
    },
    {
      id: "ident",
      text: "Identification",
      desc: "Detecting and confirming the security incident.",
      correctPos: 1,
    },
    {
      id: "cont",
      text: "Containment",
      desc: "Limiting the damage and isolating systems.",
      correctPos: 2,
    },
    {
      id: "erad",
      text: "Eradication",
      desc: "Removing the root cause (malware, backdoors).",
      correctPos: 3,
    },
    {
      id: "recov",
      text: "Recovery",
      desc: "Restoring systems to normal operation.",
      correctPos: 4,
    },
    {
      id: "post",
      text: "Lessons Learned",
      desc: "Documenting the event to prevent a repeat.",
      correctPos: 5,
    },
  ];

  const toggleStep = (step) => {
    if (submitted) return;
    if (order.find((s) => s.id === step.id)) {
      setOrder(order.filter((s) => s.id !== step.id));
    } else {
      setOrder([...order, step]);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    order.forEach((step, index) => {
      if (step.correctPos === index) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / steps.length) * 100);
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
        🚨 Scenario 10: The Breach Protocol
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
          Final Mission: Sequence the Response
        </p>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.5" }}>
          A server has been compromised! Panic causes mistakes. Follow the{" "}
          <strong>SANS Institute</strong> framework to handle the incident.
          Click the steps in the <u>correct chronological order</u>.
        </p>
      </div>

      {/* Selection Area */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {steps.map((step) => {
          const isSelected = order.find((s) => s.id === step.id);
          return (
            <button
              key={step.id}
              onClick={() => toggleStep(step)}
              disabled={submitted}
              style={{
                padding: "15px",
                background: isSelected ? "#22d3ee" : "rgba(15, 23, 42, 0.5)",
                color: isSelected ? "#0f172a" : "#e2e8f0",
                border: "1px solid #334155",
                borderRadius: "10px",
                cursor: submitted ? "default" : "pointer",
                textAlign: "left",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontWeight: "bold" }}>{step.text}</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                {step.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Sequence Preview */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "rgba(0,0,0,0.2)",
          borderRadius: "15px",
          border: "1px dashed #334155",
        }}
      >
        <h4
          style={{ color: "#22d3ee", marginBottom: "15px", fontSize: "0.9rem" }}
        >
          YOUR INCIDENT TIMELINE:
        </h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {order.length === 0 && (
            <span style={{ color: "#64748b", fontStyle: "italic" }}>
              Select steps above...
            </span>
          )}
          {order.map((step, index) => (
            <div
              key={step.id}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <div
                style={{
                  background: "#22d3ee",
                  color: "#0f172a",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                {index + 1}
              </div>
              <span style={{ color: "#e2e8f0", fontWeight: "500" }}>
                {step.text}
              </span>
              {index < order.length - 1 && (
                <span style={{ color: "#64748b" }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {!submitted ? (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={order.length < steps.length}
          >
            Finalize Response Plan
          </button>
        </div>
      ) : (
        <div
          className="results-banner"
          style={{ borderTop: "2px solid #22d3ee" }}
        >
          <h3>Final Task Complete</h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#94a3b8",
              marginBottom: "15px",
            }}
          >
            In a real breach, <strong>Containment</strong> must happen before{" "}
            <strong>Eradication</strong>. You can't kill a virus if it's still
            spreading to other servers!
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
              <strong>Accuracy:</strong> {metrics.score}%
            </div>
            <div>
              <strong>Efficiency:</strong> {metrics.time}s
            </div>
          </div>
          <button className="btn-primary" onClick={onNext}>
            Reveal Score
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskTen;
