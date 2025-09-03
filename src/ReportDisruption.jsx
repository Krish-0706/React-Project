
import React, { useState } from "react";

const stations = [
  "Churchgate", "Mumbai Central", "Dadar", "Bandra", "Andheri", "Borivali",
  "Virar", "Thane", "Kalyan", "CSMT", "Kurla", "Vashi", "Panvel"
];

const ReportDisruption = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [station, setStation] = useState("");
  const [issue, setIssue] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [reports, setReports] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!station || !issue) return;

    const newReport = {
      station,
      issue,
      severity,
      time: new Date().toLocaleString(),
    };

    setReports([newReport, ...reports]);
    setStation("");
    setIssue("");
    setSeverity("Medium");
    setIsOpen(false);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Report Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: "10px 15px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        🚨 Report Disruption
      </button>

      {/* Modal Form */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100%", height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
            }}
          >
            <h3>Report a Disruption</h3>
            <form onSubmit={handleSubmit}>
              {/* Station */}
              <label>Station:</label>
              <select
                value={station}
                onChange={(e) => setStation(e.target.value)}
                required
                style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
              >
                <option value="">Select Station</option>
                {stations.map((st, idx) => (
                  <option key={idx} value={st}>{st}</option>
                ))}
              </select>

              {/* Issue */}
              <label>Issue:</label>
              <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                required
                placeholder="Describe the issue"
                style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
              />

              {/* Severity */}
              <label>Severity:</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  background: "green",
                  color: "white",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                style={{
                  marginLeft: "10px",
                  background: "gray",
                  color: "white",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Display Reports */}
      <div style={{ marginTop: "20px" }}>
        <h4>📢 Recent Reports</h4>
        {reports.length === 0 ? (
          <p>No reports yet.</p>
        ) : (
          <ul style={{ paddingLeft: "15px" }}>
            {reports.map((r, idx) => (
              <li key={idx} style={{ marginBottom: "10px" }}>
                <strong>{r.station}</strong> — {r.issue}  
                <br />
                <em>Severity: {r.severity} | {r.time}</em>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReportDisruption;
