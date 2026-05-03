import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // IMPORTANT: Import your CSS here

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <span className="badge">🛡️ Level Up Your Defense</span>
        <h1>Cybersafe Office</h1>

        <p className="description">
          Step into real-world scenarios, defeat hackers in our interactive
          games, and get
          <strong> real-time feedback</strong> on your score. Learning is faster
          when it's fun.
        </p>
      </div>

      <div className="card-container">
        {/* Take Quiz Card */}
        <div
          className="action-card primary-card"
          onClick={() => navigate("/quiz")}
        >
          <div className="card-icon">⚡</div>
          <h2>Challenge</h2>
          <p>
            Test your intuition against scenario-based challenges and earn your
            rank.
          </p>
          <div className="card-link">Start Mission →</div>
        </div>

        {/* Admin Stats Card */}
        <div className="action-card" onClick={() => navigate("/admin")}>
          <div className="card-icon">📊</div>
          <h2>View Stats</h2>
          <p>
            Check the leaderboard, analyze performance, and manage the system.
          </p>
          <div className="card-link">Admin Dashboard →</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
