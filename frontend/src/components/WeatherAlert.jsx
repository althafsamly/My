import { useState, useEffect } from "react";
import "./WeatherAlert.css";

const DESTINATION_COORDS = {
  ella: { lat: 6.8667, lng: 81.0466 },
  kandy: { lat: 7.2906, lng: 80.6337 },
  galle: { lat: 6.0535, lng: 80.2210 },
  mirissa: { lat: 5.9483, lng: 80.4531 },
  sigiriya: { lat: 7.9570, lng: 80.7603 },
  colombo: { lat: 6.9271, lng: 79.8612 },
  "nuwara eliya": { lat: 6.9497, lng: 80.7828 },
  trincomalee: { lat: 8.5874, lng: 81.2152 },
};

function WeatherAlert({ destination, startDate, onSwitchDestination }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!destination) {
      setWeatherData(null);
      return;
    }
    const destKey = destination.toLowerCase().trim();
    const coords = DESTINATION_COORDS[destKey];
    
    if (coords) {
      setLoading(true);
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,precipitation,weather_code&daily=weather_code,precipitation_sum&timezone=auto`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.current) {
            setWeatherData({
              temp: data.current.temperature_2m,
              precip: data.current.precipitation,
              code: data.current.weather_code,
              dailyPrecip: data.daily?.precipitation_sum?.[0] || 0
            });
          }
        })
        .catch((err) => console.error("Weather API error:", err))
        .finally(() => setLoading(false));
    }
  }, [destination]);

  if (!destination) return null;

  // We show this full UI specifically as a demonstration of the warning layout
  // You can trigger it for high precipitation or specifically for "Ella" 
  const destName = destination.charAt(0).toUpperCase() + destination.slice(1);
  const monthName = startDate ? new Date(startDate).toLocaleString('default', { month: 'long' }) : "October";

  // Check if we should show the warning (if precipitation is high or as requested by the specific UI matching)
  const isHighRain = weatherData && (weatherData.precip > 2 || weatherData.dailyPrecip > 10);
  
  // For the sake of the requirement, if it's Ella we definitely show it, or if it's high rain
  const showWarning = destination.toLowerCase() === "ella" || isHighRain;

  if (!showWarning) {
    if (weatherData && !loading) {
      return (
        <div className="weather-safe-badge">
          <span className="weather-icon">☀️</span>
          <span>Real-time Weather in {destName}: {weatherData.temp}°C, Good conditions for travel.</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="dark-form-section weather-alert-section">
      <div className="dark-section-title-row">
        <span className="dark-section-bullet">•</span>
        <h3 className="dark-section-title">WEATHER ADVISORY</h3>
      </div>
      <div className="weather-alert-card">
        <div className="weather-alert-header">
        <div className="weather-alert-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div className="weather-alert-badges">
          <span className="badge-precaution">SECOND INTER-MONSOON PRECAUTION</span>
          <span className="badge-period">Second Inter-Monsoon Period</span>
          <span className="badge-month">{monthName}</span>
          {weatherData && <span className="badge-live-weather">Live: {weatherData.temp}°C, {weatherData.precip}mm rain</span>}
        </div>
      </div>

      <h2 className="weather-alert-title">
        Inter-Monsoon Afternoon Showers & Landslide Risks in {destName}
      </h2>

      <p className="weather-alert-desc">
        {monthName} marks the beginning of the second inter-monsoon period in Sri Lanka, bringing frequent afternoon and evening thunderstorms to the Hill Country. Travelers in {destName} should expect slippery hiking trails, mist, and potential risks of minor landslides or road disruptions during heavy downpours.
      </p>

      <div className="weather-factors">
        <h4 className="factors-title">NOTED WEATHER FACTORS:</h4>
        <ul className="factors-list">
          <li>Slippery hiking conditions and leech activity on trails like Little Adam's Peak and Ella Rock</li>
          <li>Sudden heavy afternoon and evening thunderstorms with reduced visibility</li>
          <li>Potential for localized waterlogging or minor road disruptions on mountain passes</li>
        </ul>
      </div>

      <div className="weather-alternatives">
        <div className="alternatives-header">
          <h4>Recommended Favorable Alternatives for {monthName}:</h4>
          <p>Better weather & active season during these dates</p>
        </div>
        
        <div className="alternatives-grid">
          <div className="alternative-card">
            <div className="alt-card-header">
              <h5>Mirissa</h5>
              <span className="alt-region">South Coast</span>
            </div>
            <p>Transitioning towards the calmer dry season, offering improving beach conditions ahead of the main winter peak.</p>
            <strong className="alt-theme">Beaches & Relaxation</strong>
            <button className="alt-switch-btn" onClick={() => onSwitchDestination("Mirissa")}>
              Switch to Mirissa →
            </button>
          </div>

          <div className="alternative-card">
            <div className="alt-card-header">
              <h5>Sigiriya</h5>
              <span className="alt-region">Cultural Triangle</span>
            </div>
            <p>Experiences drier weather conditions with fewer disruptions compared to the central mountainous highlands.</p>
            <strong className="alt-theme">Culture & Sightseeing</strong>
            <button className="alt-switch-btn" onClick={() => onSwitchDestination("Sigiriya")}>
              Switch to Sigiriya →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherAlert;
