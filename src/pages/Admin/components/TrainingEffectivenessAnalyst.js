import React, { useState, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TrainingEffectivenessAnalyst = ({ dataset = [] }) => {
  const [selectedPath, setSelectedPath] = useState("all");

  // Domain metric definitions mapping schema positions to human-readable dimensions
  const metricLabels = [
    "Phishing Identification",
    "Risk Avoidance",
    "MFA Competency",
    "Social Engineering",
    "Network Safety Index",
  ];

  // Process raw data array into comprehensive statistical aggregates
  const analyticsData = useMemo(() => {
    if (!dataset.length) return [];

    const initializeCohortStats = () =>
      metricLabels.map((label) => ({
        metric: label,
        preSum: 0,
        postSum: 0,
        count: 0,
      }));

    const cohorts = {
      gamified: initializeCohortStats(),
      slides: initializeCohortStats(),
    };

    // Sort profiles into respective analytical matrices
    dataset.forEach((user) => {
      // Fallback evaluation logic to separate tracks cleanly
      const path = user.learningPath === "slides" ? "slides" : "gamified";
      const pre = user.preSurvey || [];
      const post = user.postSurvey || [];

      metricLabels.forEach((_, idx) => {
        const preVal = pre[idx]?.answer || 0;
        const postVal = post[idx]?.answer || 0;

        cohorts[path][idx].preSum += preVal;
        cohorts[path][idx].postSum += postVal;
        cohorts[path][idx].count += 1;
      });
    });

    // Compile into chart-ready deltas and normalized calculations
    return metricLabels.map((label, idx) => {
      const gGroup = cohorts.gamified[idx];
      const sGroup = cohorts.slides[idx];

      const gPreAvg = gGroup.count ? gGroup.preSum / gGroup.count : 0;
      const gPostAvg = gGroup.count ? gGroup.postSum / gGroup.count : 0;

      const sPreAvg = sGroup.count ? sGroup.preSum / sGroup.count : 0;
      const sPostAvg = sGroup.count ? sGroup.postSum / sGroup.count : 0;

      return {
        metric: label,
        // Gamified Metrics
        gamifiedPre: parseFloat(gPreAvg.toFixed(2)),
        gamifiedPost: parseFloat(gPostAvg.toFixed(2)),
        gamifiedDelta: parseFloat((gPostAvg - gPreAvg).toFixed(2)),
        // Slide Metrics
        slidesPre: parseFloat(sPreAvg.toFixed(2)),
        slidesPost: parseFloat(sPostAvg.toFixed(2)),
        slidesDelta: parseFloat((sPostAvg - sPreAvg).toFixed(2)),
        // Collective view fallback aggregates
        combinedDelta: parseFloat(
          ((gPostAvg + sPostAvg) / 2 - (gPreAvg + sPreAvg) / 2).toFixed(2),
        ),
      };
    });
  }, [dataset]);

  // Derive high-level KPI card stats based on filter state
  const summaryKPIs = useMemo(() => {
    let totalDelta = 0;
    let maxGrowthMetric = "N/A";
    let highestGrowthVal = -Infinity;

    analyticsData.forEach((item) => {
      let currentDelta = item.combinedDelta;
      if (selectedPath === "gamified") currentDelta = item.gamifiedDelta;
      if (selectedPath === "slides") currentDelta = item.slidesDelta;

      totalDelta += currentDelta;

      if (currentDelta > highestGrowthVal) {
        highestGrowthVal = currentDelta;
        maxGrowthMetric = item.metric;
      }
    });

    const averageLift = analyticsData.length
      ? (totalDelta / analyticsData.length).toFixed(2)
      : "0.00";

    return {
      averageLift: averageLift > 0 ? `+${averageLift}` : averageLift,
      maxGrowthMetric,
      cohortSize:
        selectedPath === "all"
          ? dataset.length
          : dataset.filter((d) =>
              selectedPath === "slides"
                ? d.learningPath === "slides"
                : d.learningPath !== "slides",
            ).length,
    };
  }, [analyticsData, selectedPath, dataset]);

  return (
    <div
      style={{
        background: "#0f172a",
        color: "#f8fafc",
        padding: "30px",
        borderRadius: "24px",
        border: "1px solid #1e293b",
        fontFamily: "Inter, system-ui, sans-serif",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Structural Header Control Block */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          borderBottom: "1px solid #1e293b",
          paddingBottom: "25px",
          marginBottom: "30px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: "700",
              color: "#f1f5f9",
              margin: "0 0 5px 0",
            }}
          >
            PRE & POST COMPARATIVE ANALYTICS
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
            In-depth analysis of training impact across security domains, with
            dynamic filtering by learning pathway.
          </p>
        </div>

        {/* Data Analyst Filter Controls */}
        <div
          style={{
            display: "flex",
            background: "#020617",
            padding: "6px",
            borderRadius: "12px",
            border: "1px solid #334155",
          }}
        >
          {[
            { id: "all", label: "Unified View" },
            { id: "gamified", label: "🎮 Gamified Cohort" },
            { id: "slides", label: "📊 Slide Cohort" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedPath(tab.id)}
              style={{
                background: selectedPath === tab.id ? "#1e293b" : "transparent",
                color: selectedPath === tab.id ? "#22d3ee" : "#94a3b8",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scientific High-Level Research Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        {[
          {
            title: "Sample Size",
            value: summaryKPIs.cohortSize,
            detail: "Active research profiles",
            color: "#f8fafc",
          },
          {
            title: "Mean Shift Impact",
            value: summaryKPIs.averageLift,
            detail: "Average score step delta",
            color: "#4ade80",
          },
          {
            title: "Peak Efficacy Driver",
            value: summaryKPIs.maxGrowthMetric,
            detail: "Highest recorded track change",
            color: "#a855f7",
          },
        ].map((kpi, i) => (
          <div
            key={i}
            style={{
              background:
                "linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)",
              border: "1px solid #1e293b",
              padding: "20px",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                color: "#64748b",
                fontSize: "0.75rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {kpi.title}
            </div>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                margin: "8px 0",
                color: kpi.color,
              }}
            >
              {kpi.value}
            </div>
            <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
              {kpi.detail}
            </div>
          </div>
        ))}
      </div>

      {/* Main Analytical Chart Visualization */}
      <div
        style={{
          background: "rgba(2, 6, 23, 0.4)",
          border: "1px solid #1e293b",
          padding: "24px",
          borderRadius: "16px",
          marginBottom: "35px",
        }}
      >
        <h3
          style={{
            fontSize: "1.05rem",
            color: "#cbd5e1",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          Shift Analysis: Pre vs. Post Training Performance Across Security
          Competencies
        </h3>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <ComposedChart
              data={analyticsData}
              margin={{ top: 10, right: 10, bottom: 10, left: -25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="metric"
                stroke="#64748b"
                style={{ fontSize: "0.8rem", fontWeight: 500 }}
              />
              <YAxis domain={[0, 10]} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Legend verticalAlign="top" height={40} />

              {/* Dynamic rendering criteria mapping parameters depending on layout filtering state toggles */}
              {(selectedPath === "all" || selectedPath === "gamified") && (
                <Bar
                  name="Gamified Pre-Test"
                  dataKey="gamifiedPre"
                  fill="#1e293b"
                  stroke="#334155"
                  radius={[4, 4, 0, 0]}
                />
              )}
              {(selectedPath === "all" || selectedPath === "gamified") && (
                <Bar
                  name="Gamified Post-Test"
                  dataKey="gamifiedPost"
                  fill="#22d3ee"
                  radius={[4, 4, 0, 0]}
                />
              )}

              {(selectedPath === "all" || selectedPath === "slides") && (
                <Bar
                  name="Slides Pre-Test"
                  dataKey="slidesPre"
                  fill="#334155"
                  stroke="#475569"
                  radius={[4, 4, 0, 0]}
                />
              )}
              {(selectedPath === "all" || selectedPath === "slides") && (
                <Bar
                  name="Slides Post-Test"
                  dataKey="slidesPost"
                  fill="#a855f7"
                  radius={[4, 4, 0, 0]}
                />
              )}

              {/* Continuous Trend Overlays representing exact Net Progress */}
              {selectedPath === "gamified" && (
                <Line
                  name="🎮 Net Gamified Growth"
                  type="monotone"
                  dataKey="gamifiedDelta"
                  stroke="#4ade80"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              )}
              {selectedPath === "slides" && (
                <Line
                  name="📊 Net Slides Growth"
                  type="monotone"
                  dataKey="slidesDelta"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* High-fidelity Empirical Research Data Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "0.9rem",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #1e293b", color: "#64748b" }}>
              <th style={{ padding: "12px 16px", fontWeight: "600" }}>
                SECURITY KNOWLEDGE
              </th>
              <th style={{ padding: "12px 16px", fontWeight: "600" }}>
                PRE GAMIFIED
              </th>
              <th style={{ padding: "12px 16px", fontWeight: "600" }}>
                POST GAMIFIED
              </th>
              <th style={{ padding: "12px 16px", fontWeight: "600" }}>
                🎮 GAMIFIED SHIFT
              </th>
              <th style={{ padding: "12px 16px", fontWeight: "600" }}>
                PRE SLIDES
              </th>
              <th style={{ padding: "12px 16px", fontWeight: "600" }}>
                POST SLIDES
              </th>
              <th style={{ padding: "12px 16px", fontWeight: "600" }}>
                📊 SLIDES SHIFT
              </th>
            </tr>
          </thead>
          <tbody>
            {analyticsData.map((row, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: "1px solid #1e293b",
                  background:
                    index % 2 === 0 ? "rgba(30, 41, 59, 0.1)" : "transparent",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(30, 41, 59, 0.3)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    index % 2 === 0 ? "rgba(30, 41, 59, 0.1)" : "transparent")
                }
              >
                <td
                  style={{
                    padding: "16px",
                    fontWeight: "600",
                    color: "#cbd5e1",
                  }}
                >
                  {row.metric}
                </td>
                <td style={{ padding: "16px", color: "#94a3b8" }}>
                  {row.gamifiedPre}
                </td>
                <td style={{ padding: "16px", color: "#22d3ee" }}>
                  {row.gamifiedPost}
                </td>
                <td
                  style={{
                    padding: "16px",
                    color: row.gamifiedDelta >= 0 ? "#4ade80" : "#fb7185",
                    fontWeight: "700",
                  }}
                >
                  {row.gamifiedDelta > 0
                    ? `+${row.gamifiedDelta}`
                    : row.gamifiedDelta}
                </td>
                <td style={{ padding: "16px", color: "#94a3b8" }}>
                  {row.slidesPre}
                </td>
                <td style={{ padding: "16px", color: "#a855f7" }}>
                  {row.slidesPost}
                </td>
                <td
                  style={{
                    padding: "16px",
                    color: row.slidesDelta >= 0 ? "#4ade80" : "#fb7185",
                    fontWeight: "700",
                  }}
                >
                  {row.slidesDelta > 0
                    ? `+${row.slidesDelta}`
                    : row.slidesDelta}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainingEffectivenessAnalyst;
