/* eslint-disable */
import { useState, useEffect, useCallback } from 'react'
import './App.css'

function App() {
  const [city, setCity]         = useState('')
  const [weather, setWeather]   = useState(null)
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)
  const [unit, setUnit]         = useState('metric')
  const [history, setHistory]   = useState(
    JSON.parse(localStorage.getItem('searchHistory')) || []
  )
  const [forecast, setForecast] = useState([])

  // ← wrap in useCallback so it doesn't change every render
  const fetchWeather = useCallback(async (cityName) => {
    if (!cityName.trim()) return
    setWeather(null)
    setError(null)
    setLoading(true)

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=${process.env.REACT_APP_WEATHER_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${unit}&appid=${process.env.REACT_APP_WEATHER_KEY}`)
      ])

      if (!weatherRes.ok) throw new Error("City not found. Check the spelling.")

      const weatherData  = await weatherRes.json()
      const forecastData = await forecastRes.json()

      setWeather(weatherData)

      const daily = forecastData.list
        .filter(item => item.dt_txt.includes('12:00:00'))
        .slice(0, 5)
      setForecast(daily)

      setHistory(prev => {
        const updated = [cityName, ...prev.filter(c => c !== cityName)].slice(0, 5)
        localStorage.setItem('searchHistory', JSON.stringify(updated))
        return updated
      })

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [unit]) // ← unit is the only real dependency

  // Geolocation on startup
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords
          setLoading(true)
          try {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${process.env.REACT_APP_WEATHER_KEY}`
            )
            const data = await res.json()
            fetchWeather(data.name)
          } catch {
            setError('Allow location access to see your weather, or search a city above.')
          }
        },
        () => setError('Allow location access to see your weather, or search a city above.')
      )
    } else {
      setError('Allow location access to see your weather, or search a city above.')
    }
  }, [fetchWeather]) // ← fetchWeather is now safe to add here

  // Re-fetch when unit changes
  useEffect(() => {
    if (weather) fetchWeather(weather.name)
  }, [unit, fetchWeather]) // ← add both dependencies

  const handleSearch = (e) => {
    e.preventDefault()
    fetchWeather(city)
    setCity('')
  }

  const tempUnit = unit === 'metric' ? '°C' : '°F'

  return (
    <div className="page">
      <div className="card">

        {/* Header */}
        <div className="header">
          <h1 className="title">🌤 Weather App</h1>
          <button
            className="toggle-btn"
            onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}
          >
            Switch to {unit === 'metric' ? '°F' : '°C'}
          </button>
        </div>

        {/* Search */}
        <div className="search-row">
          <input
            className="search-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
            placeholder="Search city..."
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="history-wrapper">
            <div className="history-header">
              <span className="history-label">Recent</span>
             <button
  className="history-clear"
  onClick={() => {
    setHistory([])
    localStorage.removeItem('searchHistory')
    setWeather(null)    // ← clear weather display
    setForecast([])     // ← clear forecast display
    setError(null)      // ← clear any errors
  }}
>
  Clear all
</button>
            </div>
            <div className="history-chips">
              {history.map((h, i) => (
                <div key={i} className="chip-wrapper">
                  <button className="chip" onClick={() => fetchWeather(h)}>
                    {h}
                  </button>
                  <button
                    className="chip-x"
                    onClick={() => {
                      const updated = history.filter((_, idx) => idx !== i)
                      setHistory(updated)
                      localStorage.setItem('searchHistory', JSON.stringify(updated))
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="skeleton-wrapper">
            {['60%', '40%', '80%', '50%', '70%'].map((w, i) => (
              <div key={i} className="skeleton-box" style={{ width: w }} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && <div className="error-box">⚠️ {error}</div>}

        {/* Weather */}
        {!loading && weather && (
          <>
            <div className="weather-main">
              <div className="city-name">
                {weather.name}, {weather.sys.country}
              </div>
              <img
                className="weather-icon"
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
              <div className="temperature">
                {Math.round(weather.main.temp)}{tempUnit}
              </div>
              <div className="description">
                {weather.weather[0].description}
              </div>
            </div>

            <div className="stats-grid">
              {[
                { icon: '💧', label: 'Humidity',  value: `${weather.main.humidity}%` },
                { icon: '💨', label: 'Wind',       value: `${weather.wind.speed} m/s` },
                { icon: '🌡', label: 'Feels Like', value: `${Math.round(weather.main.feels_like)}${tempUnit}` },
              ].map(({ icon, label, value }) => (
                <div key={label} className="stat-box">
                  <div className="stat-icon">{icon}</div>
                  <div className="stat-label">{label}</div>
                  <div className="stat-value">{value}</div>
                </div>
              ))}
            </div>

            {forecast.length > 0 && (
              <div>
                <div className="forecast-title">5-Day Forecast</div>
                <div className="forecast-row">
                  {forecast.map((day, i) => (
                    <div key={i} className="forecast-card">
                      <div className="forecast-day">
                        {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <img
                        className="forecast-icon"
                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                        alt={day.weather[0].description}
                      />
                      <div className="forecast-temp">
                        {Math.round(day.main.temp)}{tempUnit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default App