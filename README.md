# 🌤 Skye Weather App

A real-time weather application built with React that shows live weather data for any city in the world.

🔗 Live Demo: https://weather-app-xi-weld-77.vercel.app/

---

## What I Built

A fully functional weather app using React and the OpenWeatherMap API. The app detects your location automatically, lets you search any city, and shows current weather along with a 5-day forecast. All search history is saved locally so it persists even after refreshing the page.

---

## Features

- Search weather for any city in the world
- Auto-detects your current location using the browser Geolocation API
- Toggle between Celsius and Fahrenheit — refetches data instantly
- 5-day forecast showing temperature and weather icon per day
- Last 5 searches saved using localStorage
- Delete individual searches or clear all history at once
- Skeleton loading animation while data is being fetched
- Error messages for invalid city names or network failures
- Responsive design — works on mobile, tablet, and desktop

---

## What I Learned

- How to use fetch and async/await to call a real REST API
- How to handle loading, success, and error states in React
- How to use Promise.all to run two API calls at the same time
- How useState manages multiple pieces of state in one component
- How useEffect runs code on mount and when dependencies change
- How useCallback prevents unnecessary function re-creation
- How localStorage saves and retrieves data across page refreshes
- How to use the browser Geolocation API
- How environment variables keep API keys secure
- How to deploy a React app on Vercel and set environment variables in production

---

## Tech Stack

- React
- CSS
- OpenWeatherMap API
- localStorage
- Vercel

---

## API Endpoints Used

- /data/2.5/weather — current weather by city name
- /data/2.5/forecast — 5-day forecast in 3-hour intervals
- /data/2.5/weather?lat=&lon= — weather by coordinates from geolocation

---

## Deployment

Deployed on Vercel: https://weather-app-xi-weld-77.vercel.app/

API key is stored securely in Vercel's Environment Variables dashboard — never in the code or pushed to GitHub.

---

## Author

Deepakragavan J
LinkedIn: https://www.linkedin.com/in/deepakragavan-j/
Portfolio: https://weather-app-xi-weld-77.vercel.app/
