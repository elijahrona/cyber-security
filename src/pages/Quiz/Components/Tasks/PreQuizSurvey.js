import React, { useState } from "react";

const questions = [
  "How confident are you in identifying a phishing email?",
  "How easily can you avoid workplace cyber risks?",
  "How well do you understand the importance of Multi-Factor Authentication (MFA)?",
  "How knowledgeable are you about social engineering tactics?",
  "How safe do you feel while browsing the internet on a company network?"
];

const PreQuizSurvey = ({ onComplete }) => {
  const [answers, setAnswers] = useState(questions.map(q => ({ question: q, answer: 5 })));

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index].answer = parseInt(value);
    setAnswers(newAnswers);
  };

  return (
    <div className="task-container" style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: "#22d3ee" }}>Pre-Simulation Assessment</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
        Baseline Check: Rate your current cybersecurity knowledge (0 = Novice, 10 = Expert).
      </p>
      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#e2e8f0" }}>{q}</label>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <input 
              type="range" min="0" max="10" value={answers[i].answer} 
              onChange={(e) => handleChange(i, e.target.value)}
              style={{ flex: 1, accentColor: "#22d3ee" }}
            />
            <span style={{ minWidth: "30px", fontWeight: "bold", color: "#22d3ee" }}>{answers[i].answer}</span>
          </div>
        </div>
      ))}
      <button className="btn-primary" onClick={() => onComplete(answers)} style={{ width: '100%', marginTop: '20px' }}>
        Initialize Simulation
      </button>
    </div>
  );
};

export default PreQuizSurvey;