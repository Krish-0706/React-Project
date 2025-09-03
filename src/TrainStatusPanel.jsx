import React, { useState, useEffect } from "react";

const trainData = {
  Central: [
    { route: "CSMT → Kalyan", fast: "10 min late", slow: "10 min late", fastCrowd: "High", slowCrowd: "Medium" },
    { route: "Kalyan → CSMT", fast: "9 min late", slow: "12 min late", fastCrowd: "Low", slowCrowd: "High" },
  ],
  Western: [
    { route: "Churchgate → Virar", fast: "4 min late", slow: "6 min late", fastCrowd: "Medium", slowCrowd: "High" },
    { route: "Virar → Churchgate", fast: "8 min late", slow: "6 min late", fastCrowd: "High", slowCrowd: "Medium" },
  ],
  Harbour: [
    { route: "CSMT → Panvel", status: "7 min late", crowd: "Medium" },
    { route: "Panvel → CSMT", status: "9 min late", crowd: "Low" },
  ],
};

const lineColors = {
  Central: "#dc3545",
  Western: "#007bff",
  Harbour: "#28a745",
};

// Crowd indicator function
const getCrowdIcon = (level) => {
  if (!level) return "";
  switch (level.toLowerCase()) {
    case "low":
      return "🟢 Low";
    case "medium":
      return "🟡 Medium";
    case "high":
      return "🔴 High";
    default:
      return level;
  }
};

const TrainStatusPanel = () => {
  const [activeLine, setActiveLine] = useState("Central");
  const [news, setNews] = useState([]);

  useEffect(() => {
    setNews([
      "⏱ Central line trains delayed due to signal issue at Thane",
      "🌧 Harbour line affected by waterlogging near Vashi",
      "🚧 Western line maintenance block between Borivali and Dahisar",
    ]);
  }, []);

  return (
    <div style={{
      background: "#fff",
      borderRadius: "15px",
      padding: "20px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }}>
      <h3 style={{ marginBottom: "15px" }}>🚆 Mumbai Local Train Status</h3>

      {/* Line Selector */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        {["Central", "Western", "Harbour"].map((line) => (
          <button
            key={line}
            onClick={() => setActiveLine(line)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: activeLine === line ? lineColors[line] : "#f0f0f0",
              color: activeLine === line ? "white" : "black",
              fontWeight: "bold"
            }}
          >
            {line} Line
          </button>
        ))}
      </div>

      {/* Train Info */}
      <div style={{ flex: 1 }}>
        {trainData[activeLine].map((train, idx) => (
          <div key={idx}
            style={{
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "10px",
              background: "#f8f9fa",
              borderLeft: `6px solid ${lineColors[activeLine]}`
            }}
          >
            <strong style={{ color: lineColors[activeLine] }}>{train.route}</strong>
            <p style={{ margin: 0 }}>
              {train.fast && <>Fast: {train.fast} | Crowd: {getCrowdIcon(train.fastCrowd)} <br /></>}
              {train.slow && <>Slow: {train.slow} | Crowd: {getCrowdIcon(train.slowCrowd)} <br /></>}
              {train.status && <>Status: {train.status} | Crowd: {getCrowdIcon(train.crowd)}</>}
            </p>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default TrainStatusPanel;
