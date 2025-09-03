// src/components/TrafficAlerts.jsx
import React, { useEffect, useState } from 'react';

const dummyAlerts = [
  '🚧 Accident near Dadar Flyover - delay expected',
  '⚠️ Heavy congestion at Eastern Express Highway',
  '🛠️ Roadwork near Bandra Kurla Complex until 6 PM',
  '🚓 Police checking near Andheri West Station',
  'Heavy waterlogging in Western Suburbs (Bandra-Borivali) Travel Accordingly'
];

const TrafficAlerts = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % dummyAlerts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="alert-banner">
      <marquee>{dummyAlerts[index]}</marquee>
    </div>
  );
};

export default TrafficAlerts;
