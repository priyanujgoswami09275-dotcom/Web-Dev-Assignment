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
const themeButton = document.getElementById("themeButton");
const unitButton = document.getElementById("unitButton");
const recentSearches = document.getElementById("recentSearches");

// Saved preferences and the last city (used when the unit changes).
let currentUnit = localStorage.getItem("weatherUnit") || "celsius";
let lastCity = "";
const currentWeather = document.getElementById("currentWeather");
const forecastSection = document.getElementById("forecastSection");
const forecastCards = document.getElementById("forecastCards");

// getWeather(cityName) - finds the city's coordinates, then fetches its forecast.
async function getWeather(cityName) {
  // First request: turn the city name into a latitude and longitude.
  const geoResponse = await fetch(
    `${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1`
  );

  // response.ok is false when the server answers with an error status.
  if (!geoResponse.ok) {
    throw new Error("The location service is not responding. Please try again.");
  }

  const geoData = await geoResponse.json();

  // An empty results list means the city name could not be found.
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(
      `No city found for "${cityName}". Please check the spelling and try again.`
    );
  }

  const { latitude, longitude, name, country } = geoData.results[0];

  // Second request: use those coordinates to ask for the weather.
  // Fahrenheit is a URL option, so the units are fetched, not converted later.
  const unitParameter =
    currentUnit === "fahrenheit" ? "&temperature_unit=fahrenheit" : "";

  const weatherResponse = await fetch(
    `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}` +
      "&current=temperature_2m,wind_speed_10m,weather_code" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
      `&timezone=auto&forecast_days=5${unitParameter}`
  );

  if (!weatherResponse.ok) {
    throw new Error("The weather service is not responding. Please try again.");
  }

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
  const degreeLabel = currentUnit === "celsius" ? "°C" : "°F";

  currentWeather.innerHTML = `
    <div>
      <p class="current-temperature">${Math.round(current.temperature_2m)}${degreeLabel}</p>
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

// showError(message) - shows a friendly message and hides any old results.
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  currentWeather.hidden = true;
  forecastSection.hidden = true;
}

// setTheme(theme) - applies a theme to the page and remembers it.
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  localStorage.setItem("weatherTheme", theme);
}

// toggleTheme() - switches the page between light and dark mode.
function toggleTheme() {
  const currentTheme = document.documentElement.dataset.theme;
  setTheme(currentTheme === "dark" ? "light" : "dark");
}

// searchCity(cityName) - the small controller: checks the input, loads and displays one city.
async function searchCity(cityName) {
  // An empty search gets a helpful message instead of a network request.
  if (!cityName) {
    showError("Please enter a city name.");
    return;
  }

  loadingMessage.hidden = false;
  errorMessage.hidden = true;

  try {
    const weather = await getWeather(cityName);
    lastCity = weather.name;
    showWeather(weather);
    saveRecentCity(weather.name);
  } catch (error) {
    // A failed fetch (for example, no internet) arrives as a TypeError.
    if (error.name === "TypeError") {
      showError(
        "Could not connect. Please check your internet connection and try again."
      );
    } else {
      showError(error.message);
    }
  } finally {
    // The loading message always disappears, even after an error.
    loadingMessage.hidden = true;
  }
}

// saveRecentCity(city) - keeps the last five searched cities in localStorage.
function saveRecentCity(city) {
  const savedCities = JSON.parse(localStorage.getItem("recentCities")) || [];

  // Remove a duplicate (ignoring case), then put the newest city first.
  const otherCities = savedCities.filter(
    (savedCity) => savedCity.toLowerCase() !== city.toLowerCase()
  );
  const updatedCities = [city, ...otherCities].slice(0, 5);

  localStorage.setItem("recentCities", JSON.stringify(updatedCities));
  showRecentCities();
}

// showRecentCities() - draws one clickable chip for each saved city.
function showRecentCities() {
  const savedCities = JSON.parse(localStorage.getItem("recentCities")) || [];

  recentSearches.innerHTML = savedCities
    .map(
      (city) =>
        `<button class="chip" type="button" data-city="${city}">${city}</button>`
    )
    .join("");
}

// updateUnitButton() - shows the unit that is currently active.
function updateUnitButton() {
  unitButton.textContent = currentUnit === "celsius" ? "°C" : "°F";
}

// changeUnit() - switches °C/°F, saves the choice, and reloads the last city.
async function changeUnit() {
  currentUnit = currentUnit === "celsius" ? "fahrenheit" : "celsius";
  localStorage.setItem("weatherUnit", currentUnit);
  updateUnitButton();

  // Only reload if the visitor has already searched for a city.
  if (lastCity) {
    await searchCity(lastCity);
  }
}

// Pressing the Search button or the Enter key submits the form.
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchCity(cityInput.value.trim());
});

// Use the saved theme, or light mode on a first visit.
setTheme(localStorage.getItem("weatherTheme") || "light");
updateUnitButton();
showRecentCities();

themeButton.addEventListener("click", toggleTheme);
unitButton.addEventListener("click", changeUnit);

// Clicking a recent chip fills the search box and searches for that city.
recentSearches.addEventListener("click", (event) => {
  const city = event.target.dataset.city;
  if (city) {
    cityInput.value = city;
    searchCity(city);
  }
});
