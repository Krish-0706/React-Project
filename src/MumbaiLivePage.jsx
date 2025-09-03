import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ReactAnimatedWeather from "react-animated-weather";
import TrainStatusPanel from "./TrainStatusPanel";
import ReportDisruption from "./ReportDisruption";

// Weather icon mapping
const iconMap = {
  clear: "CLEAR_DAY",
  clouds: "CLOUDY",
  rain: "RAIN",
  drizzle: "SLEET",
  thunderstorm: "WIND",
  snow: "SNOW",
  mist: "FOG",
  haze: "FOG",
};

// Western, Central, Harbour stations
const westernStations = [
  { name: "Churchgate", coords: [18.9354, 72.8275] },
  { name: "Mumbai Central", coords: [18.9696, 72.8194] },
  { name: "Dadar (W)", coords: [19.0176, 72.8496] },
  { name: "Bandra", coords: [19.0544, 72.8407] },
  { name: "Andheri", coords: [19.1197, 72.8461] },
  { name: "Borivali", coords: [19.2273, 72.8576] },
  { name: "Vasai Road", coords: [19.3640, 72.8330] },
  { name: "Virar", coords: [19.4551, 72.8110] },
  { name: "Dahanu Road", coords: [19.9678, 72.7352] }
];


const centralStations = [
  { name: "CSMT", coords: [18.9402, 72.8355] },
  { name: "Dadar (C)", coords: [19.0176, 72.8496] },
  { name: "Kurla", coords: [19.0726, 72.8816] },
  { name: "Ghatkopar", coords: [19.0853, 72.9088] },
  { name: "Thane", coords: [19.1860, 72.9752] },
  { name: "Dombivli", coords: [19.2183, 73.0875] },
  { name: "Kalyan", coords: [19.2437, 73.1355] },
  { name: "Kasara", coords: [19.6562, 73.4742] },
  { name: "Karjat", coords: [18.9100, 73.3235] }
];


const harbourStations = [
  { name: "CSMT", coords: [18.9402, 72.8355] },
  { name: "Wadala", coords: [19.0169, 72.8530] },
  { name: "Kurla", coords: [19.0726, 72.8816] },
  { name: "Vashi", coords: [19.0771, 72.9986] },
  { name: "Nerul", coords: [19.0330, 73.0169] },
  { name: "Panvel", coords: [18.9894, 73.1175] }
];

// Collapsible News Panel
const NewsPanel = () => {
  const [news, setNews] = useState([]);
  const [expanded, setExpanded] = useState(null);

useEffect(() => {
  const fetchNews = async () => {
    try {
      const res = await fetch(
        "https://api.allorigins.win/get?url=" +
        encodeURIComponent("https://yatrirailways.com/live-railway-announcements")
      );
      const data = await res.json();

      // Extract <p> announcements from raw HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, "text/html");

      const items = Array.from(doc.querySelectorAll(".card-box")).map(card => ({
        title: card.querySelector(".font-weight-bold")?.innerText || "No title",
        time: card.querySelector(".text-warning")?.innerText || "No time",
        detail: card.querySelector(".font-weight-normal")?.innerText || "No detail"
      }));

      setNews(items);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  fetchNews();
}, []);


  return (
    <div style={{
      marginTop: "20px",
      background: "#fff",
      borderRadius: "12px",
      padding: "15px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
    }}>
      <h3 style={{ marginBottom: "15px" }}>📰 Railway Announcements</h3>

      {news.length === 0 ? (
        <p>No announcements available.</p>
      ) : (
        news.map((item, idx) => (
          <div key={idx} style={{
            marginBottom: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            {/* Header */}
            <div
              onClick={() => setExpanded(expanded === idx ? null : idx)}
              style={{
                padding: "10px",
                cursor: "pointer",
                background: "#f7f9fc",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <span>{item.title}</span>
              <span style={{ fontSize: "0.85rem", color: "gray" }}>{item.time}</span>
            </div>

            {/* Expanded body */}
            {expanded === idx && (
              <div style={{ padding: "10px", background: "#fff" }}>
                <p style={{ margin: 0 }}>{item.detail}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

// Main Page
const MumbaiLivePage = () => {
  const [weatherAlert, setWeatherAlert] = useState("Loading weather...");
  const [icon, setIcon] = useState("CLEAR_DAY");
  const WEATHER_API_KEY = "0c6d7a49170877cbb37e98cdf6c08a94"; // replace with your key
  const mumbaiCoords = [19.076, 72.8777];
  const [darkMode, setDarkMode] = useState(false);


  // Fetch weather
  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=${WEATHER_API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data?.weather && data?.main) {
        const condition = data.weather[0].main.toLowerCase();
        const temp = Math.round(data.main.temp);
        setIcon(iconMap[condition] || "CLEAR_DAY");
        setWeatherAlert(`Currently ${temp}°C with ${data.weather[0].description}`);
      } else {
        setWeatherAlert("Weather data not available");
      }
    } catch (err) {
      console.error("Weather API error:", err);
      setWeatherAlert("Unable to fetch weather");
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 60000);
    return () => clearInterval(interval);
  }, []);

  // Weather marker
  const weatherIconMarker = new L.DivIcon({
    html: `<div style="font-size:24px; color:#007bff;">
      ${icon === "RAIN" ? "🌧" : icon === "CLOUDY" ? "☁" : "☀"}
    </div>`,
    className: "weather-marker",
    iconSize: [30, 30],
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontWeight: "bold" }}>Mumbai Live</h2>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "20px",
        marginTop: "20px"
      }}>
        {/* Map + News Panel */}
        <div style={{
          background: "#fff",
          borderRadius: "10px",
          padding: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}>
          <MapContainer center={mumbaiCoords} zoom={10} style={{ height: "80vh", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* Train Lines */}
            <Polyline positions={westernStations.map(s => s.coords)} pathOptions={{ color: "blue", weight: 4 }} />
            {westernStations.map((s, idx) => (
              <Marker key={idx} position={s.coords}><Popup>{s.name} (Western Line)</Popup></Marker>
            ))}

            <Polyline positions={centralStations.map(s => s.coords)} pathOptions={{ color: "red", weight: 4 }} />
            {centralStations.map((s, idx) => (
              <Marker key={idx} position={s.coords}><Popup>{s.name} (Central Line)</Popup></Marker>
            ))}

            <Polyline positions={harbourStations.map(s => s.coords)} pathOptions={{ color: "green", weight: 4 }} />
            {harbourStations.map((s, idx) => (
              <Marker key={idx} position={s.coords}><Popup>{s.name} (Harbour Line)</Popup></Marker>
            ))}

            {/* Weather Marker */}
            <Marker position={mumbaiCoords} icon={weatherIconMarker}>
              <Popup><strong>🌦 Weather Update:</strong><br />{weatherAlert}</Popup>
            </Marker>
          </MapContainer>
          
          {/* News Panel below map */}
          <NewsPanel />
        </div>

        {/* Right Column: Weather + Train Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Weather Panel */}
          <div style={{
            background: "linear-gradient(135deg, #4facfe, #00f2fe)",
            borderRadius: "15px",
            padding: "20px",
            color: "white",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>🌦 Weather </h3>
            <ReactAnimatedWeather icon={icon} color="white" size={64} animate />
            <div style={{ fontSize: "1.2rem", marginTop: "10px" }}>{weatherAlert}</div>
          </div>

          {/* Train Status Panel */}
          <TrainStatusPanel />
          <ReportDisruption />
        </div>
      </div>
    </div>
  );
};

export default MumbaiLivePage;
