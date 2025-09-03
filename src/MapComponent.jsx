import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Dummy coordinates
const routeCoordsMap = {
  "Andheri to Bandra": [
    [19.119677, 72.846128],
    [19.0900, 72.8500],
    [19.054445, 72.840707]
  ],
  "Kurla to BKC": [
    [19.0726, 72.8826],
    [19.0660, 72.8700],
    [19.0600, 72.8500]
  ],
  "Thane to Powai": [
    [19.2183, 72.9781],
    [19.1700, 72.9400],
    [19.1157, 72.9097]
  ]
};

// Replace with your actual TomTom API key
const tomtomKey = 'dwcFT4BG16lIVDZWzmnRIw8lz5big1FL';

function MapComponent({ routeCoords }) {
  const start = routeCoords?.[0] || [19.0760, 72.8777]; // Mumbai center
  const end = routeCoords?.[routeCoords.length - 1];

  return (
    <MapContainer center={start} zoom={12} style={{ height: '80vh', width: '100%' }}>
      
      {/* Base OSM layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* TomTom Traffic Flow Overlay */}
      <TileLayer
        url={`https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${tomtomKey}`}
        attribution="Traffic flow &copy; TomTom"
      />

      {/* TomTom Traffic Incidents Overlay */}
      <TileLayer
        url={`https://api.tomtom.com/traffic/map/4/tile/incidents/s1/{z}/{x}/{y}.png?key=${tomtomKey}`}
        attribution="Traffic incidents &copy; TomTom"
      />

      {/* Route and markers */}
      {routeCoords?.length > 0 && (
        <>
          <Marker position={start} />
          <Marker position={end} />
          <Polyline positions={routeCoords} pathOptions={{ color: 'blue', weight: 5 }} />
        </>
      )}
    </MapContainer>
  );
}

export default MapComponent;
