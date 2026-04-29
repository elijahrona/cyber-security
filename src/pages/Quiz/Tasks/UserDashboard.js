import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const UserDashboard = ({ data }) => {
  const navigate = useNavigate();
  const quizzes = data?.quizzes || [];

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const postData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_AXIOS_POST_URL, {
          method: "POST",
          signal: signal,
          headers: {
            "Content-Type": "application/json",
          },
          // Wrapping 'data' in an object so the backend can destructure it
          body: JSON.stringify({ data: [data] }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Post aborted");
        } else {
          console.error("Error:", error);
        }
      }
    };

    // Only fire the request if 'data' actually exists
    if (data) {
      postData();
    }

    return () => controller.abort();
  }, [data]); // Add 'data' here if you want it to sync whenever the prop changes

  // Logic: Calculate Advanced Metrics
  const metrics = useMemo(() => {
    const avgScore =
      quizzes.reduce((acc, q) => acc + q.score, 0) / quizzes.length;
    const avgRisk =
      quizzes.reduce((acc, q) => acc + q.risk, 0) / quizzes.length;
    const totalTime = quizzes.reduce((acc, q) => acc + q.time, 0);
    const accuracy = avgScore; // Simplify for now

    let verdict = "";
    let color = "";

    if (avgScore >= 90) {
      verdict =
        "CYBER SENTINEL: Your reflexes and knowledge are elite. You are the first line of defense.";
      color = "#4ade80";
    } else if (avgScore >= 70) {
      verdict =
        "VIGILANT OPERATIVE: Strong performance, but hackers only need one mistake. Patch your knowledge gaps.";
      color = "#22d3ee";
    } else {
      verdict =
        "HIGH RISK: Your digital footprint is exposed. Immediate re-training on security protocols is advised.";
      color = "#fb7185";
    }

    return { avgScore, avgRisk, totalTime, accuracy, verdict, color };
  }, [quizzes]);

  return (
    <div
      style={{
        background: "#020617",
        color: "#f8fafc",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      {/* Header Section */}
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            color: "#22d3ee",
            fontSize: "2.5rem",
            letterSpacing: "-1px",
          }}
        >
          Security Performance Profile
        </h1>
        <p style={{ color: "#94a3b8" }}>
          Agent: <span style={{ color: "#f8fafc" }}>{data.email}</span> | System
          Integrity: {metrics.avgScore.toFixed(1)}%
        </p>
      </header>

      {/* Top Level Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {[
          {
            label: "Overall Score",
            value: `${metrics.avgScore.toFixed(0)}%`,
            sub: "Avg. Accuracy",
          },
          {
            label: "Avg Risk Level",
            value: `${metrics.avgRisk.toFixed(0)}%`,
            sub: "Vulnerability Index",
          },
          {
            label: "Total Training Time",
            value: `${metrics.totalTime.toFixed(1)}s`,
            sub: "Engagement Period",
          },
          {
            label: "Threat Response",
            value: metrics.avgScore > 80 ? "Fast" : "Moderate",
            sub: "Speed Rating",
          },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid #334155",
              padding: "20px",
              borderRadius: "16px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#94a3b8",
                fontSize: "0.8rem",
                textTransform: "uppercase",
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                margin: "10px 0",
                color: i === 1 ? "#fb7185" : "#f8fafc",
              }}
            >
              {card.value}
            </div>
            <div style={{ color: "#64748b", fontSize: "0.75rem" }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Visual Data Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "30px",
          marginBottom: "40px",
        }}
      >
        {/* Score Trend Chart */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            padding: "25px",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <h3
            style={{
              marginBottom: "20px",
              fontSize: "1.1rem",
              color: "#22d3ee",
            }}
          >
            Scenario Score Analysis
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={quizzes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="task" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                }}
              />
              <Bar dataKey="score" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              <Bar dataKey="risk" fill="#fb7185" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time Distribution */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            padding: "25px",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <h3
            style={{
              marginBottom: "20px",
              fontSize: "1.1rem",
              color: "#a855f7",
            }}
          >
            Decision Speed (Seconds)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={quizzes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="task" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                }}
              />
              <Line
                type="monotone"
                dataKey="time"
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* The Verdict Section */}
      <div
        style={{
          background: `linear-gradient(90deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 1) 100%)`,
          padding: "40px",
          borderRadius: "24px",
          textAlign: "center",
          border: `2px solid ${metrics.color}`,
          marginBottom: "60px",
          boxShadow: `0 0 20px ${metrics.color}22`,
        }}
      >
        <h2
          style={{
            color: metrics.color,
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "15px",
          }}
        >
          Commander's Verdict
        </h2>
        <p
          style={{
            fontSize: "1.4rem",
            maxWidth: "800px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          {metrics.verdict}
        </p>
      </div>

      {/* Task Breakdown Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            background: "rgba(15, 23, 42, 0.5)",
            borderRadius: "12px",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #334155" }}>
              <th style={{ padding: "15px", color: "#94a3b8" }}>SCENARIO</th>
              <th style={{ padding: "15px", color: "#94a3b8" }}>ACCURACY</th>
              <th style={{ padding: "15px", color: "#94a3b8" }}>RISK</th>
              <th style={{ padding: "15px", color: "#94a3b8" }}>LATENCY</th>
              <th style={{ padding: "15px", color: "#94a3b8" }}>RATING</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((q) => (
              <tr
                key={q.task}
                style={{ borderBottom: "1px solid rgba(51, 65, 85, 0.3)" }}
              >
                <td style={{ padding: "15px", fontWeight: "bold" }}>
                  Task {q.task}
                </td>
                <td style={{ padding: "15px" }}>{q.score}%</td>
                <td
                  style={{
                    padding: "15px",
                    color: q.risk > 30 ? "#fb7185" : "#94a3b8",
                  }}
                >
                  {q.risk}%
                </td>
                <td style={{ padding: "15px" }}>{q.time}s</td>
                <td style={{ padding: "15px" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      background:
                        q.score === 100
                          ? "rgba(74, 222, 128, 0.1)"
                          : "rgba(251, 113, 133, 0.1)",
                      color: q.score === 100 ? "#4ade80" : "#fb7185",
                    }}
                  >
                    {q.score === 100
                      ? "PERFECT"
                      : q.score >= 70
                        ? "SECURE"
                        : "VULNERABLE"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Navigation */}
      <footer
        style={{
          marginTop: "60px",
          textAlign: "center",
          paddingBottom: "40px",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "1px solid #334155",
            color: "#94a3b8",
            padding: "12px 40px",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#334155";
            e.target.style.color = "#fff";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "#94a3b8";
          }}
        >
          ← Go Home
        </button>
      </footer>
    </div>
  );
};

export default UserDashboard;
