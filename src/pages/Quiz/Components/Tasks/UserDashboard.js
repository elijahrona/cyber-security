import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const UserDashboard = ({ data }) => {
  const navigate = useNavigate();

  // 1. Implicitly fallback to 'gamified' if the learningPath property is missing
  const isGamified = useMemo(() => {
    if (!data) return true;
    return data.learningPath ? data.learningPath === "gamified" : true;
  }, [data]);

  const quizzes = useMemo(() => data?.quizzes || [], [data?.quizzes]);

  // 2. Telemetry Background sync API persistence logic
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
          body: JSON.stringify({ data: [data] }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Data Transmission Error:", error);
        }
      }
    };

    if (data) {
      postData();
    }

    return () => controller.abort();
  }, [data]);

  // 3. Process Shared Insights: Comparative Pre vs Post Survey Metrics
  const surveyInsightsData = useMemo(() => {
    const pre = data?.preSurvey || [];
    const post = data?.postSurvey || [];

    // Abstracted short names for clean data chart X-Axis labeling layout
    const customLabels = [
      "Phishing Identification",
      "Risk Avoidance",
      "MFA Competency",
      "Social Engineering",
      "Network Safety Index",
    ];

    return customLabels.map((label, index) => {
      return {
        metric: label,
        Initial: pre[index]?.answer || 0,
        Final: post[index]?.answer || 0,
      };
    });
  }, [data]);

  // 4. Score metrics summaries logic loops
  const metrics = useMemo(() => {
    if (!isGamified || quizzes.length === 0) {
      return {
        avgScore: 0,
        avgRisk: 0,
        totalTime: 0,
        verdict: "You have completed the training.",
        color: "#a855f7",
      };
    }

    const avgScore =
      quizzes.reduce((acc, q) => acc + q.score, 0) / quizzes.length;
    const avgRisk =
      quizzes.reduce((acc, q) => acc + q.risk, 0) / quizzes.length;
    const totalTime = quizzes.reduce((acc, q) => acc + q.time, 0);

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
        "HIGH RISK: Your digital footprint is exposed. Immediate re-training is advised.";
      color = "#fb7185";
    }

    return { avgScore, avgRisk, totalTime, verdict, color };
  }, [quizzes, isGamified]);

  return (
    <div
      style={{
        background: "#020617",
        color: "#f8fafc",
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Header Profile Section */}
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            color: isGamified ? "#22d3ee" : "#a855f7",
            fontSize: "2.5rem",
            letterSpacing: "-1px",
          }}
        >
          Security Performance Profile
        </h1>
        <p style={{ color: "#94a3b8" }}>
          Agent ID:{" "}
          <span
            style={{
              color: "#f8fafc",
              fontWeight: "bold",
              fontFamily: "monospace",
            }}
          >
            {data?.code || "Unknown"}
          </span>{" "}
          | Track Pathway:{" "}
          <span
            style={{
              color: isGamified ? "#22d3ee" : "#a855f7",
              fontWeight: "600",
            }}
          >
            {isGamified ? "Gamified Challenge" : "Standard Slide Lecture"}
          </span>
        </p>
      </header>

      {/* UNIVERSAL INSIGHT SECTION: Pre vs Post Survey Awareness Growth Analysis */}
      <section style={{ maxWidth: "1000px", margin: "0 auto 40px auto" }}>
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
              marginBottom: "5px",
              color: "#f8fafc",
              fontSize: "1.3rem",
            }}
          >
            🛡️ Cognitive Awareness Shifts
          </h3>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.9rem",
              marginBottom: "25px",
            }}
          >
            Visualizing variances across internal diagnostics from initial
            configuration baselines to end-of-track telemetry.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={surveyInsightsData}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="metric"
                stroke="#64748b"
                style={{ fontSize: "0.8rem" }}
              />
              <YAxis domain={[0, 10]} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  color: "#fff",
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar
                name="Initial Baseline (Pre)"
                dataKey="Initial"
                fill="#475569"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                name="Post-Training Index"
                dataKey="Final"
                fill={isGamified ? "#22d3ee" : "#a855f7"}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* GAMIFIED TRACK EXCLUSIVE METRICS */}
      {isGamified && (
        <section style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* Top Level Metric Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
                  background: "rgba(30, 41, 59, 0.4)",
                  border: "1px solid #1e293b",
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

          {/* Gamified Scenario Analysis Graphics Grid Layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
              gap: "30px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                padding: "25px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <h3 style={{ marginBottom: "20px", color: "#22d3ee" }}>
                Scenario Performance Mapping
              </h3>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={quizzes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
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

            <div
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                padding: "25px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <h3 style={{ marginBottom: "20px", color: "#a855f7" }}>
                Decision Latency Index
              </h3>
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={quizzes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
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
        </section>
      )}

      {/* Universal Assignment Status Footprint */}
      <div
        style={{
          background: `linear-gradient(90deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 0.6) 100%)`,
          padding: "35px",
          borderRadius: "24px",
          textAlign: "center",
          border: `2px solid ${metrics.color}`,
          marginBottom: "40px",
          maxWidth: "1000px",
          margin: "0 auto 40px auto",
        }}
      >
        <h2
          style={{
            color: metrics.color,
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontSize: "1.1rem",
            marginBottom: "10px",
          }}
        >
          Verdict
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            maxWidth: "850px",
            margin: "0 auto",
            lineHeight: "1.6",
            color: "#e2e8f0",
          }}
        >
          {metrics.verdict}
        </p>
      </div>

      {/* Detailed Datatable breakdown view - Gamified Track Only */}
      {isGamified && quizzes.length > 0 && (
        <section
          style={{ maxWidth: "1000px", margin: "0 auto", overflowX: "auto" }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "rgba(15, 23, 42, 0.5)",
              borderRadius: "12px",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                <th
                  style={{
                    padding: "15px",
                    textAlign: "left",
                    color: "#64748b",
                  }}
                >
                  SCENARIO
                </th>
                <th
                  style={{
                    padding: "15px",
                    textAlign: "left",
                    color: "#64748b",
                  }}
                >
                  ACCURACY
                </th>
                <th
                  style={{
                    padding: "15px",
                    textAlign: "left",
                    color: "#64748b",
                  }}
                >
                  RISK INDEX
                </th>
                <th
                  style={{
                    padding: "15px",
                    textAlign: "left",
                    color: "#64748b",
                  }}
                >
                  LATENCY
                </th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((q) => (
                <tr
                  key={q.task}
                  style={{ borderBottom: "1px solid rgba(51, 65, 85, 0.2)" }}
                >
                  <td style={{ padding: "15px", fontWeight: "bold" }}>
                    Task {q.task}
                  </td>
                  <td style={{ padding: "15px", color: "#4ade80" }}>
                    {q.score}%
                  </td>
                  <td
                    style={{
                      padding: "15px",
                      color: q.risk > 30 ? "#fb7185" : "#f8fafc",
                    }}
                  >
                    {q.risk}%
                  </td>
                  <td style={{ padding: "15px" }}>{q.time}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Control Actions Footer */}
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
        >
          ← Return to Command Home
        </button>
      </footer>
    </div>
  );
};

export default UserDashboard;
