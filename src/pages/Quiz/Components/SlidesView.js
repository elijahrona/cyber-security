import React, { useState } from "react";

function SlidesView({ onComplete }) {
  const [slidesFinished, setSlidesFinished] = useState(false);
  return (
    <div
      className="onboarding-form"
      style={{ textAlign: "center", padding: "40px" }}
    >
      <h2 style={{ color: "#22d3ee", marginBottom: "25px" }}>
        Training Slides Presentation
      </h2>

      {/* Controlled state variable to track if the participant has read the slides */}

      <iframe
        title="Learning Slides"
        src="https://docs.google.com/presentation/d/e/2PACX-1vRRzwrGIY0kXUz3x3hFtG8hOBhO3UPbinsxD_v92s4fTMAS4w-u74zOm1C8TfPT7iY1qosScc5PlmNb/pubembed?start=true&loop=true&delayms=60000"
        frameborder="0"
        width="960"
        height="569"
        allowfullscreen="true"
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        style={{
          maxWidth: "100%",
          borderRadius: "12px",
          border: "1px solid #1e293b",
        }}
      ></iframe>

      {/* Disclaimer and Checkbox Verification Block */}
      <div
        style={{
          background: "rgba(30, 41, 59, 0.4)",
          border: "1px solid #334155",
          padding: "20px",
          borderRadius: "12px",
          maxWidth: "960px",
          margin: "25px auto 0 auto",
          textAlign: "left",
        }}
      >
        <p
          style={{
            color: "#fb7185",
            fontSize: "0.85rem",
            fontWeight: "600",
            textTransform: "uppercase",
            margin: "0 0 6px 0",
            letterSpacing: "0.05em",
          }}
        >
          ⚠️ Important Research Disclaimer
        </p>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "0.9rem",
            lineHeight: "1.5",
            margin: "0 0 16px 0",
          }}
        >
          Please ensure you have thoroughly read and completed reviewing all the
          training lecture slides embedded above before unlocking the
          post-simulation assessment. Click the checkbox below to indicate that
          you have completed all the slides.
        </p>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#f8fafc",
            cursor: "pointer",
            fontSize: "0.95rem",
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            checked={slidesFinished}
            onChange={(e) => setSlidesFinished(e.target.checked)}
            style={{
              width: "18px",
              height: "18px",
              cursor: "pointer",
              accentColor:
                "#a855f7" /* Matching the custom purple theme for your slide path */,
            }}
          />
          <span>
            I certify that I have read all lecture presentation materials in
            full.
          </span>
        </label>
      </div>

      <button
        className="btn-primary"
        style={{
          marginTop: "20px",
          minWidth: "200px",
          cursor: slidesFinished ? "pointer" : "not-allowed",
          opacity: slidesFinished ? 1 : 0.4,
          transition: "all 0.3s ease",
        }}
        onClick={onComplete}
        disabled={!slidesFinished}
      >
        Proceed to Post-Simulation Assessment
      </button>
    </div>
  );
}

export default SlidesView;
