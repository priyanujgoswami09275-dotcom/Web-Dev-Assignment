// The two Open-Meteo addresses this app uses. Neither needs an API key.
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

// Page elements the script needs to read or update.
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");

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

// searchCity(cityName) - the small controller: shows loading, loads one city.
async function searchCity(cityName) {
  loadingMessage.hidden = false;
  errorMessage.hidden = true;

  const weather = await getWeather(cityName);

  loadingMessage.hidden = true;
  return weather;
}

// Pressing the Search button or the Enter key submits the form.
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchCity(cityInput.value.trim());
});
