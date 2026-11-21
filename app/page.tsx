 "use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Place = {
  id: number;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};

type Forecast = {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_probability_max: number[];
  };
};

const popularPlaces: Place[] = [
  { id: 1, name: "Lucknow", admin1: "Uttar Pradesh", country: "India", latitude: 26.8467, longitude: 80.9462 },
  { id: 2, name: "Bareilly", admin1: "Uttar Pradesh", country: "India", latitude: 28.3670, longitude: 79.4304 },
  { id: 3, name: "Ghaziabad", admin1: "Uttar Pradesh", country: "India", latitude: 28.6692, longitude: 77.4538 },
  { id: 4, name: "Noida", admin1: "Uttar Pradesh", country: "India", latitude: 28.5355, longitude: 77.3910 },
  { id: 5, name: "Kanpur", admin1: "Uttar Pradesh", country: "India", latitude: 26.4499, longitude: 80.3319 },
  { id: 6, name: "Agra", admin1: "Uttar Pradesh", country: "India", latitude: 27.1767, longitude: 78.0081 },
  { id: 7, name: "Varanasi", admin1: "Uttar Pradesh", country: "India", latitude: 25.3176, longitude: 82.9739 },
  { id: 8, name: "Prayagraj", admin1: "Uttar Pradesh", country: "India", latitude: 25.4358, longitude: 81.8463 },
  { id: 9, name: "Gorakhpur", admin1: "Uttar Pradesh", country: "India", latitude: 26.7606, longitude: 83.3732 },
  { id: 10, name: "Mathura", admin1: "Uttar Pradesh", country: "India", latitude: 27.4924, longitude: 77.6737 },
  { id: 11, name: "Jhansi", admin1: "Uttar Pradesh", country: "India", latitude: 25.4484, longitude: 78.5685 },
  { id: 12, name: "Ayodhya", admin1: "Uttar Pradesh", country: "India", latitude: 26.7922, longitude: 82.1998 }
];

function weatherInfo(code: number, isDay = 1) {
  if (code === 0) return { label: "Clear sky", icon: isDay ? "☀️" : "🌙" };
  if ([1, 2].includes(code)) return { label: "Mostly clear", icon: isDay ? "🌤️" : "☁️" };
  if (code === 3) return { label: "Overcast", icon: "☁️" };
  if ([45, 48].includes(code)) return { label: "Foggy", icon: "🌫️" };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: "Drizzle", icon: "🌦️" };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: "Rain", icon: "🌧️" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "Snow", icon: "🌨️" };
  if ([95, 96, 99].includes(code)) return { label: "Thunderstorm", icon: "⛈️" };
  return { label: "Variable conditions", icon: "🌡️" };
}

function formatHour(value: string) {
  return new Date(value).toLocaleTimeString("en-IN", { hour: "numeric", hour12: true });
}
function formatDay(value: string, index: number) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", { weekday: "short" });
}
function formatClock(value: string) {
  return new Date(value).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
}

export default function Home() {
  const [place, setPlace] = useState<Place>(popularPlaces[0]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [updatedAt, setUpdatedAt] = useState("");

  const temp = useCallback((value: number) => {
    const converted = unit === "C" ? value : (value * 9) / 5 + 32;
    return `${Math.round(converted)}°`;
  }, [unit]);

  const loadForecast = useCallback(async (selected: Place) => {
    setLoading(true);
    setError("");
    setForecast(null);
    try {
      const params = new URLSearchParams({
        latitude: String(selected.latitude),
        longitude: String(selected.longitude),
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
        hourly: "temperature_2m,precipitation_probability,weather_code,wind_speed_10m",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max",
        forecast_days: "7",
        timezone: "auto"
      });
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
      if (!response.ok) throw new Error("Weather service is temporarily unavailable. Please try again.");
      const data = (await response.json()) as Forecast;
      setForecast(data);
      setUpdatedAt(new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load weather data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadForecast(place); }, [place, loadForecast]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const params = new URLSearchParams({ name: trimmed, count: "15", language: "en", format: "json" });
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, { signal: controller.signal });
        const data = await response.json();
        const results: Place[] = (data.results || [])
          .filter((item: Place) => item.country === "India" && (item.admin1 || "").toLowerCase().includes("uttar pradesh"))
          .map((item: Place) => ({ ...item, country: "India" }));
        setSuggestions(results.slice(0, 8));
      } catch {
        if (!controller.signal.aborted) setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 350);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [query]);

  const hourlyItems = useMemo(() => {
    if (!forecast) return [];
    const now = new Date(forecast.current.time).getTime();
    const start = forecast.hourly.time.findIndex(t => new Date(t).getTime() >= now);
    return forecast.hourly.time.slice(Math.max(0, start), Math.max(0, start) + 24).map((time, offset) => {
      const i = Math.max(0, start) + offset;
      return { time, temperature: forecast.hourly.temperature_2m[i], rain: forecast.hourly.precipitation_probability[i], code: forecast.hourly.weather_code[i] };
    });
  }, [forecast]);

  function choosePlace(selected: Place) {
    setPlace(selected);
    setQuery("");
    setSuggestions([]);
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    if (suggestions[0]) choosePlace(suggestions[0]);
  }

  const currentInfo = forecast ? weatherInfo(forecast.current.weather_code, forecast.current.is_day) : null;

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-mark">☀</span><span>UP<span className="brand-light">Weather</span></span></a>
        <span className="region-pill"><span className="live-dot" /> UTTAR PRADESH, INDIA</span>
      </header>

      <section className="intro">
        <p className="eyebrow">YOUR LOCAL WEATHER COMPANION</p>
        <h1>Weather, wherever<br /><span>UP takes you.</span></h1>
        <p className="intro-copy">Live conditions and a 7-day outlook for cities across Uttar Pradesh.</p>
        <form className="search-wrap" onSubmit={submitSearch}>
          <span className="search-icon">⌕</span>
          <input aria-label="Search Uttar Pradesh city" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search a city in Uttar Pradesh..." />
          {searching && <span className="search-status">Searching…</span>}
          <button type="submit" className="search-button">Search</button>
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map(item => (
                <button type="button" key={item.id} onClick={() => choosePlace(item)}>
                  <span>📍 {item.name}</span><small>{item.admin1}, India</small>
                </button>
              ))}
            </div>
          )}
          {query.trim().length >= 2 && !searching && suggestions.length === 0 && (
            <div className="suggestions no-results">No matching Uttar Pradesh city found. Try another spelling.</div>
          )}
        </form>
        <div className="popular-row"><span>POPULAR:</span>{popularPlaces.slice(0, 7).map(item => <button key={item.id} onClick={() => choosePlace(item)}>{item.name}</button>)}</div>
      </section>

      <section className="weather-section">
        <div className="section-heading">
          <div><p className="eyebrow">WEATHER OVERVIEW</p><h2>{place.name}<span className="location-pin"> · Uttar Pradesh</span></h2></div>
          <div className="heading-actions">
            <span className="updated">{updatedAt ? `Updated ${updatedAt}` : "Weather forecast"}</span>
            <div className="unit-toggle"><button className={unit === "C" ? "active" : ""} onClick={() => setUnit("C")}>°C</button><button className={unit === "F" ? "active" : ""} onClick={() => setUnit("F")}>°F</button></div>
            <button className="refresh-button" onClick={() => loadForecast(place)} aria-label="Refresh forecast">↻</button>
          </div>
        </div>

        {loading && <div className="state-card"><div className="loader" /><p>Getting the latest forecast for {place.name}…</p></div>}
        {error && !loading && <div className="state-card error-card"><p>{error}</p><button onClick={() => loadForecast(place)}>Try again</button></div>}

        {forecast && !loading && (
          <>
            <div className="current-grid">
              <article className="current-card">
                <div className="current-top"><span className="card-kicker">CURRENT CONDITIONS</span><span className="weather-icon">{currentInfo?.icon}</span></div>
                <div className="temperature">{temp(forecast.current.temperature_2m)}<span>{unit === "C" ? "C" : "F"}</span></div>
                <h3>{currentInfo?.label}</h3>
                <p className="feels">Feels like {temp(forecast.current.apparent_temperature)} · {place.name}</p>
                <div className="current-footer"><span>Today’s high <b>{temp(forecast.daily.temperature_2m_max[0])}</b></span><span>Low <b>{temp(forecast.daily.temperature_2m_min[0])}</b></span></div>
              </article>
              <div className="metrics-grid">
                <article className="metric-card"><span className="metric-icon">🌡️</span><span className="metric-label">FEELS LIKE</span><strong>{temp(forecast.current.apparent_temperature)}</strong><small>Perceived temperature</small></article>
                <article className="metric-card"><span className="metric-icon">💧</span><span className="metric-label">HUMIDITY</span><strong>{forecast.current.relative_humidity_2m}%</strong><small>Relative humidity</small></article>
                <article className="metric-card"><span className="metric-icon">💨</span><span className="metric-label">WIND SPEED</span><strong>{Math.round(forecast.current.wind_speed_10m)} <i>km/h</i></strong><small>At 10 metres</small></article>
                <article className="metric-card"><span className="metric-icon">🌧️</span><span className="metric-label">PRECIPITATION</span><strong>{forecast.current.precipitation} <i>mm</i></strong><small>Current hour</small></article>
              </div>
            </div>

            <section className="panel hourly-panel">
              <div className="panel-heading"><div><p className="eyebrow">PLAN YOUR DAY</p><h3>Next 24 hours</h3></div><span className="panel-note">Hourly forecast · Local time</span></div>
              <div className="hourly-scroll">
                {hourlyItems.map((item, i) => <div className="hour-item" key={item.time}><span className="hour-time">{i === 0 ? "Now" : formatHour(item.time)}</span><span className="hour-icon">{weatherInfo(item.code).icon}</span><strong>{temp(item.temperature)}</strong><span className="rain-chance">💧 {item.rain ?? 0}%</span></div>)}
              </div>
            </section>

            <section className="panel weekly-panel">
              <div className="panel-heading"><div><p className="eyebrow">THE WEEK AHEAD</p><h3>7-day forecast</h3></div><span className="panel-note">Daily outlook</span></div>
              <div className="daily-list">
                {forecast.daily.time.map((day, i) => {
                  const info = weatherInfo(forecast.daily.weather_code[i]);
                  return <div className="daily-row" key={day}>
                    <strong className="day-name">{formatDay(day, i)}</strong><span className="day-condition"><span>{info.icon}</span>{info.label}</span>
                    <span className="day-rain">💧 {forecast.daily.precipitation_probability_max[i] ?? 0}%</span>
                    <span className="day-low">{temp(forecast.daily.temperature_2m_min[i])}</span>
                    <div className="temp-track"><span /></div>
                    <strong className="day-high">{temp(forecast.daily.temperature_2m_max[i])}</strong>
                  </div>;
                })}
              </div>
            </section>

            <div className="sun-grid">
              <article className="sun-card"><span className="sun-symbol">🌅</span><div><small>SUNRISE</small><strong>{formatClock(forecast.daily.sunrise[0])}</strong></div><span className="sun-side">First light</span></article>
              <article className="sun-card"><span className="sun-symbol">🌇</span><div><small>SUNSET</small><strong>{formatClock(forecast.daily.sunset[0])}</strong></div><span className="sun-side">Daylight ends</span></article>
            </div>
          </>
        )}
      </section>

      <footer className="footer"><span>☀ UP Weather</span><span>Weather data by Open-Meteo · Times shown in local city time</span><span>Forecasts are estimates and may change.</span></footer>
    </main>
  );
}
