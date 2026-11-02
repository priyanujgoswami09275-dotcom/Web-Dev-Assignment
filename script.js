// The two Open-Meteo addresses this app uses. Neither needs an API key.
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

// Weather codes returned by Open-Meteo, mapped to a short text and an emoji.
const weatherDescriptions = {
  0: ["Clear sky", "☀️"],
  1: ["Mainly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"],
  48: ["Freezing fog", "🌫️"],
  51: ["Light drizzle", "🌦️"],
  53: ["Drizzle", "🌦️"],
  55: ["Heavy drizzle", "🌦️"],
  61: ["Light rain", "🌧️"],
  63: ["Rain", "🌧️"],
  65: ["Heavy rain", "🌧️"],
  71: ["Light snow", "❄️"],
  73: ["Snow", "❄️"],
  75: ["Heavy snow", "❄️"],
  77: ["Snow grains", "❄️"],
  80: ["Light showers", "🌦️"],
  81: ["Showers", "🌦️"],
  82: ["Heavy showers", "🌧️"],
  95: ["Thunderstorm", "⛈️"],
  96: ["Thunderstorm with hail", "⛈️"],
};

// Page elements the script needs to read or update.
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const currentWeather = document.getElementById("currentWeather");
const forecastSection = document.getElementById("forecastSection");
const forecastCards = document.getElementById("forecastCards");

// getWeather(cityName) - finds the city's coordinates, then fetches its forecast.
async function getWeather(cityName) {
  // First request: turn the city name into a latitude and longitude.
  const geoResponse = await fetch(
    `${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1`
  );
  const geoData = await geoResponse.json();

  const { latitude, longitude, name, country } = geoData.results[0];

  // Second request: use those coordinates to ask for the weather.
  const weatherResponse = await fetch(
    `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}` +
      "&current=temperature_2m,wind_speed_10m,weather_code" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
      "&timezone=auto&forecast_days=5"
  );
  const weatherData = await weatherResponse.json();

  return { name, country, weatherData };
}

// showWeather(weather) - builds the current weather card on the page.
function showWeather(weather) {
  const { name, country, weatherData } = weather;
  const { current, daily } = weatherData;

  // Falls back to a safe pair if the API sends an unknown code.
  const [description, emoji] = weatherDescriptions[current.weather_code] || [
    "Unknown weather",
    "🌡️",
  ];

  currentWeather.innerHTML = `
    <div>
      <p class="current-temperature">${Math.round(current.temperature_2m)}°C</p>
      <p class="current-place">${name}, ${country}</p>
    </div>
    <div class="current-details">
      <p class="current-description">
        <span class="current-emoji">${emoji}</span>${description}
      </p>
      <p class="current-wind">Wind: ${Math.round(current.wind_speed_10m)} km/h</p>
    </div>
  `;

  currentWeather.hidden = false;

  // Build one small card for each of the five days.
  forecastCards.innerHTML = daily.time
    .map((day, index) => {
      const dayName = new Date(day).toLocaleDateString(undefined, {
        weekday: "short",
      });
      const [dayDescription, dayEmoji] =
        weatherDescriptions[daily.weather_code[index]] || ["Unknown", "🌡️"];
      const maxTemp = Math.round(daily.temperature_2m_max[index]);
      const minTemp = Math.round(daily.temperature_2m_min[index]);

      return `
        <article class="forecast-card">
          <p class="forecast-day">${dayName}</p>
          <p class="forecast-emoji" title="${dayDescription}">${dayEmoji}</p>
          <p class="forecast-temps">${maxTemp}° / <span class="forecast-min">${minTemp}°</span></p>
        </article>
      `;
    })
    .join("");

  forecastSection.hidden = false;
}

// searchCity(cityName) - the small controller: shows loading, loads and displays one city.
async function searchCity(cityName) {
  loadingMessage.hidden = false;
  errorMessage.hidden = true;

  const weather = await getWeather(cityName);

  loadingMessage.hidden = true;
  showWeather(weather);
}

// Pressing the Search button or the Enter key submits the form.
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchCity(cityInput.value.trim());
});
