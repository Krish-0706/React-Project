import React, { useEffect, useState } from 'react';
import axios from 'axios';

const tomtomKey = 'YOUR_TOMTOM_API_KEY'; // Replace with your actual key

function TrafficIncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch incidents
  const fetchIncidents = async () => {
    try {
      const response = await axios.get(
        `https://api.tomtom.com/traffic/services/5/incidentDetails?bbox=72.8,18.9,73.0,19.3&fields=tmc,events&language=en&key=${tomtomKey}`
      );
      const incidentList = response.data.incidents || [];
      setIncidents(incidentList);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch once when component mounts
    fetchIncidents();

    // Set interval to auto-refresh every 2 minutes (120,000 ms)
    const interval = setInterval(() => {
      fetchIncidents();
    }, 120000);

    // Clear interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="incident-list">
      <h3>🚨 Live Traffic Alerts</h3>
      {loading ? (
        <p>Loading incidents...</p>
      ) : incidents.length === 0 ? (
        <p>No major incidents in this area.</p>
      ) : (
        <ul>
          {incidents.map((incident, index) => (
            <li key={index}>
              <strong>{incident.properties.eventCode}</strong>: {incident.properties.eventDescription}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TrafficIncidentList;
