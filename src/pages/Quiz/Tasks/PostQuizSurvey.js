import React, { useState } from "react";

const questions = [
  "After the tasks, how confident are you now in identifying phishing?",
  "How easily can you avoid workplace cyber risks now?",
  "How well do you understand MFA after these scenarios?",
  "How knowledgeable are you about social engineering now?",
  "On a scale of 0-10, how much did this simulation benefit your security awareness?"
];

const PostQuizSurvey = ({ onComplete }) => {
  const [answers, setAnswers] = useState(questions.map(q => ({ question: q, answer: 5 })));

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index].answer = parseInt(value);
    setAnswers(newAnswers);
  };

  return (
    <div className="task-container" style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: "#a855f7" }}>Post-Simulation Analysis</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
        Final Review: Has your perspective changed? (0 = Not at all, 10 = Significantly).
      </p>
      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#e2e8f0" }}>{q}</label>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <input 
              type="range" min="0" max="10" value={answers[i].answer} 
              onChange={(e) => handleChange(i, e.target.value)}
              style={{ flex: 1, accentColor: "#a855f7" }}
            />
            <span style={{ minWidth: "30px", fontWeight: "bold", color: "#a855f7" }}>{answers[i].answer}</span>
          </div>
        </div>
      ))}
      <button className="btn-primary" style={{ background: "#a855f7", width: '100%', marginTop: '20px' }} onClick={() => onComplete(answers)}>
        Finalize Agent Report
      </button>
    </div>
  );
};

export default PostQuizSurvey;