import React, { useState } from "react";

function TaskSix({ onComplete, onNext }) {
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [metrics, setMetrics] = useState({ score: 0, risk: 0, time: 0 });

  const baitingFacts = [
    "Malware Auto-run",
    "Keyboard Emulation (Rubber Ducky)",
    "Data Exfiltration",
    "Physical Hardware Damage",
  ];

  const storySteps = [
    {
      question: "You find a high-end 128GB flash drive labeled 'Executive Salaries 2026' in the office parking lot. What is your first instinct?",
      options: [
        { text: "Pick it up and take it inside", impact: "neutral", score: 1 },
        { text: "Leave it there and walk away", impact: "good", score: 1 },
        { text: "Destroy it immediately", impact: "good", score: 1 }
      ],
    },
    {
      question: "You've brought it to your desk. You're curious about the contents. What do you do next?",
      options: [
        { text: "Plug it into your work PC to find the owner", impact: "bad", score: 0 },
        { text: "Plug it into a 'disposable' old laptop not on the network", impact: "risky", score: 0.5 },
        { text: "Hand it over to the IT Security Team", impact: "perfect", score: 1 }
      ],
    }
  ];

  const handleChoice = (option) => {
    const newChoices = [...choices, option];
    if (step < storySteps.length - 1) {
      setChoices(newChoices);
      setStep(step + 1);
    } else {
      finalizeTask(newChoices);
    }
  };

  const finalizeTask = (finalChoices) => {
    const totalScore = finalChoices.reduce((acc, curr) => acc + curr.score, 0);
    const score = Math.round((totalScore / storySteps.length) * 100);
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
        💾 Scenario 6: The Parking Lot Bait
      </h2>

      <div style={{ maxWidth: "600px", margin: "0 auto 20px auto", textAlign: "center" }}>
        <p style={{ color: "#e2e8f0", fontSize: "1.1rem", fontWeight: "500", marginBottom: "8px" }}>
          Mission: Neutralize the Physical Threat
        </p>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.5" }}>
          Cyberattacks aren't always digital. <strong>Baiting</strong> relies on human curiosity. 
          A single USB drive can contain "HID payloads" that trick your computer into thinking a hacker is typing on your keyboard.
        </p>
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", margin: "20px 0" }}>
        {baitingFacts.map((fact) => (
          <span key={fact} style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
            ⚠️ {fact}
          </span>
        ))}
      </div>

      {!submitted ? (
        <div style={{ 
          background: "rgba(15, 23, 42, 0.5)", 
          padding: "30px", 
          borderRadius: "15px", 
          border: "1px solid rgba(245, 158, 11, 0.2)",
          marginTop: "30px" 
        }}>
          <h3 style={{ color: "#f59e0b", marginBottom: "20px", fontSize: "1.1rem" }}>
            Step {step + 1}: The Situation
          </h3>
          <p style={{ color: "#e2e8f0", fontSize: "1rem", marginBottom: "25px", lineHeight: "1.6" }}>
            {storySteps[step].question}
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {storySteps[step].options.map((opt, idx) => (
              <button
                key={idx}
                className="choice-btn"
                onClick={() => handleChoice(opt)}
                style={{ textAlign: "left", padding: "15px", border: "1px solid #334155" }}
              >
                {opt.text}
              </button>
            ))}
          </div>
          
          <p style={{ marginTop: "20px", fontSize: "0.8rem", color: "#64748b" }}>
            💡 Hint: Curiosity killed the network. Think like a Security Officer.
          </p>
        </div>
      ) : (
        <div className="results-banner" style={{ borderTop: "2px solid #f59e0b" }}>
          <h3>Security Audit Complete</h3>
          <div style={{ margin: "20px 0", textAlign: "left", background: "rgba(0,0,0,0.2)", padding: "15px", borderRadius: "10px" }}>
            <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
              <strong>Expert Review:</strong> Never plug an unknown device into any system. Modern "Rubber Ducky" USBs can execute thousands of commands per second the moment they are connected, bypassing most antivirus software. The only safe move is to hand it to <strong>IT Security</strong> for analysis in a "Sandboxed" environment.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", margin: "15px 0", gap: "30px" }}>
            <div><strong>Score:</strong> {metrics.score}%</div>
            <div><strong>Risk:</strong> {metrics.risk}%</div>
            <div><strong>Time:</strong> {metrics.time}s</div>
          </div>
          <button className="btn-primary" onClick={onNext} style={{ background: "#f59e0b" }}>
            Proceed to Scenario 7 →
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskSix;