import React,{useState} from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import MapComponent from './MapComponent';
import TrafficAlerts from './TrafficAlerts';
import trafficPredictions from './trafficPredictions';
import TrafficIncidentList from './TrafficIncidentList';
import MumbaiLivePage from './MumbaiLivePage';
import axios from 'axios';

function Dashboard() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeSummary, setRouteSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Geocode using Nominatim
  const geocode = async (place) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&limit=1&countrycodes=in`;
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'UrbanRushAI/1.0 (youremail@example.com)' },
    });
    if (!data || data.length === 0) throw new Error(`No results for "${place}"`);
    return [parseFloat(data[0].lon), parseFloat(data[0].lat)]; // [lng, lat]
  };

  const handleGetRoute = async () => {
    if (!origin || !destination) {
      alert('Please enter both origin and destination.');
      return;
    }

    setLoading(true);

    try {
      const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImIxYmU2YzI1OGM3NDQzNTFiNDVlMDNjZGEyMDY3NDZhIiwiaCI6Im11cm11cjY0In0='; // Replace with ORS key
      const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

      const originCoords = await geocode(origin);
      const destCoords = await geocode(destination);

      console.log('Origin coords:', originCoords);
      console.log('Destination coords:', destCoords);

      const body = { coordinates: [originCoords, destCoords] };
      const res = await axios.post(url, body, {
        headers: { Authorization: apiKey, 'Content-Type': 'application/json' },
      });

      const feature = res.data.features?.[0];
      if (!feature) throw new Error('No route found.');

      const geometry = feature.geometry.coordinates;
      const summary = feature.properties.summary;
      const leafletCoords = geometry.map(([lng, lat]) => [lat, lng]);

      setRouteCoords(leafletCoords);
      setRouteSummary(summary);
    } catch (error) {
      console.error('Error:', error.message, error.response?.data);
      alert(error.message || 'Could not fetch route.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-section">
      <h2 className="title">Smart Traffic Dashboard</h2>
      <p className="subtitle">Enter any place name and get the best route.</p>

      <div className="route-form">
        <input
          type="text"
          placeholder="Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <button onClick={handleGetRoute} disabled={loading}>
          {loading ? 'Loading…' : 'Get Route'}
        </button>
      </div>

      {routeSummary && (
        <div className="route-stats">
          <p>🛣️ Distance: {(routeSummary.distance / 1000).toFixed(2)} km</p>
          <p>⏱️ Duration: {(routeSummary.duration / 60).toFixed(1)} minutes</p>
        </div>
      )}

      <div className="map-wrapper">
        <MapComponent routeCoords={routeCoords} />
      </div>
    </main>
  );
}




// About Page
function AboutPage() {
  return (
    <div style={{
      padding: "40px",
      background: "#f9fafc",
      minHeight: "100vh"
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        
        <h1 style={{ textAlign: "center", color: "#007bff", marginBottom: "20px" }}>
          🚦 About Urban Rush AI – Mumbai Live
        </h1>

        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#333" }}>
          <strong>Urban Rush AI</strong> is a smart traffic and transit dashboard 
          built to simplify everyday travel for Mumbai’s citizens. 
          The platform brings together <strong>real-time weather alerts</strong>, 
          <strong>local train status</strong>, and <strong>railway announcements</strong> 
          into a single, user-friendly interface.
        </p>

        <h2 style={{ marginTop: "30px", color: "#444" }}>✨ Key Features</h2>
        <ul style={{ fontSize: "1rem", lineHeight: "1.8", color: "#444" }}>
          <li>🌦 Live <strong>monsoon & weather alerts</strong> with intuitive icons.</li>
          <li>🚆 Accurate <strong>Mumbai local train delays</strong> (Central, Western, Harbour lines).</li>
          <li>📰 Direct <strong>railway announcements</strong> from official sources.</li>
          <li>🗺 Interactive <strong>map view</strong> with train lines marked for easy navigation.</li>
        </ul>

        <h2 style={{ marginTop: "30px", color: "#444" }}>🌍 Our Vision</h2>
        <p style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "#333" }}>
          Mumbai moves on its trains. With Urban Rush AI, our goal is to make 
          travel smarter, safer, and more predictable for millions of daily commuters.  
          We aim to empower local travelers with information that helps 
          them save time and avoid unexpected disruptions.
        </p>

        <h2 style={{ marginTop: "30px", color: "#444" }}>👨‍💻 Built With</h2>
        <p style={{ fontSize: "1rem", lineHeight: "1.8", color: "#333" }}>
          This project leverages <strong>React.js</strong>, 
          <strong>Leaflet Maps</strong>, <strong>OpenWeather API</strong>, 
          <strong>TomTom Traffic API</strong>, and <strong>custom scraping</strong>  
          from trusted railway sources.
        </p>

        <div style={{
          textAlign: "center",
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: "1px solid #ddd",
          fontSize: "0.9rem",
          color: "#777"
        }}>
          Made with ❤️ for Mumbai’s daily commuters
        </div>
      </div>
    </div>
  );
}

// Main App Layout
function App() {
  console.log("App Loaded ✅");

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="header">
        <div className="logo">🚦 Urban Rush AI</div>
        <nav className="nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/mumbai-live" className="nav-link">Mumbai Live</Link>
          <Link to="/about" className="nav-link">About</Link>
        </nav>
      </header>

      {/* Live Alert Banner */}
      <TrafficAlerts />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mumbai-live" element={<MumbaiLivePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      {/* Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Urban Rush AI | Built for Smart Cities
      </footer>
    </div>
  );
}

export default App;
