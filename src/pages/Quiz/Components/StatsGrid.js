import React from "react";

function StatsGrid({
  hasConsented,
  currentTask,
  totalScenarios,
  avgScore,
  avgRisk,
  totalTime,
}) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">Scenario</div>
        <div className="stat-value">
          <div className="stat-value">
            {Math.min(hasConsented ? currentTask : 0, 10)} / {totalScenarios}
          </div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Avg. Score</div>
        <div className="stat-value">{avgScore}%</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Avg. Risk</div>
        <div className="stat-value">{avgRisk}%</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Total Time</div>
        <div className="stat-value">{totalTime}s</div>
      </div>
    </div>
  );
}

export default StatsGrid;
