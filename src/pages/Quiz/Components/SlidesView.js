import React from "react";

function SlidesView({ onComplete }) {
  return (
    <div
      className="onboarding-form"
      style={{ textAlign: "center", padding: "40px" }}
    >
      <h2 style={{ color: "#22d3ee", marginBottom: "25px" }}>
        Training Slides Presentation
      </h2>

      <iframe
        src="https://docs.google.com/presentation/d/e/2PACX-1vQM4CjDxH89iT_u4zGLLlFOnGIIItJd68K8ubCuwaUq4v4FM_oqMSvDLuhYZQ9aUw_JPDLPOCz2aRCo/pubembed?start=true&loop=true&delayms=60000"
        frameborder="0"
        width="960"
        height="569"
        allowfullscreen="true"
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
      ></iframe>

      <button
        className="btn-primary"
        style={{ marginTop: "20px", minWidth: "200px" }}
        onClick={onComplete}
      >
        Proceed to Post-Simulation Assessment
      </button>
    </div>
  );
}

export default SlidesView;
