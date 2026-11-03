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
  56: ["Light freezing drizzle", "🌧️"],
  57: ["Freezing drizzle", "🌧️"],
  61: ["Light rain", "🌧️"],
  63: ["Rain", "🌧️"],
  65: ["Heavy rain", "🌧️"],
  66: ["Light freezing rain", "🌧️"],
  67: ["Freezing rain", "🌧️"],
  71: ["Light snow", "❄️"],
  73: ["Snow", "❄️"],
  75: ["Heavy snow", "❄️"],
  77: ["Snow grains", "❄️"],
  80: ["Light showers", "🌦️"],
  81: ["Showers", "🌦️"],
  82: ["Heavy showers", "🌧️"],
  85: ["Light snow showers", "🌨️"],
  86: ["Snow showers", "🌨️"],
  95: ["Thunderstorm", "⛈️"],
  96: ["Thunderstorm with hail", "⛈️"],
  99: ["Thunderstorm with heavy hail", "⛈️"],
};

// Built-in list of well-known cities, used for one-letter suggestions.
// Every entry has the same shape: {name, region, country, latitude, longitude}.
// Coordinates are close enough for weather searches, not survey-grade.
const popularCities = [
  { name: "Agra", region: "Uttar Pradesh", country: "India", latitude: 27.18, longitude: 78.01 },
  { name: "Ahmedabad", region: "Gujarat", country: "India", latitude: 23.03, longitude: 72.58 },
  { name: "Amsterdam", region: "North Holland", country: "Netherlands", latitude: 52.37, longitude: 4.9 },
  { name: "Athens", region: "Attica", country: "Greece", latitude: 37.98, longitude: 23.73 },
  { name: "Barcelona", region: "Catalonia", country: "Spain", latitude: 41.39, longitude: 2.17 },
  { name: "Bengaluru", region: "Karnataka", country: "India", latitude: 12.97, longitude: 77.59 },
  { name: "Berlin", region: "Berlin", country: "Germany", latitude: 52.52, longitude: 13.4 },
  { name: "Bhopal", region: "Madhya Pradesh", country: "India", latitude: 23.26, longitude: 77.41 },
  { name: "Chandigarh", region: "Chandigarh", country: "India", latitude: 30.73, longitude: 76.78 },
  { name: "Chennai", region: "Tamil Nadu", country: "India", latitude: 13.08, longitude: 80.27 },
  { name: "Coimbatore", region: "Tamil Nadu", country: "India", latitude: 11.02, longitude: 76.96 },
  { name: "Darjeeling", region: "West Bengal", country: "India", latitude: 27.04, longitude: 88.26 },
  { name: "Delhi", region: "Delhi", country: "India", latitude: 28.61, longitude: 77.21 },
  { name: "Dubai", region: "Dubai", country: "United Arab Emirates", latitude: 25.2, longitude: 55.27 },
  { name: "Edinburgh", region: "Scotland", country: "United Kingdom", latitude: 55.95, longitude: -3.19 },
  { name: "Florence", region: "Tuscany", country: "Italy", latitude: 43.77, longitude: 11.26 },
  { name: "Geneva", region: "Geneva", country: "Switzerland", latitude: 46.2, longitude: 6.14 },
  { name: "Goa", region: "Goa", country: "India", latitude: 15.3, longitude: 74.12 },
  { name: "Hampi", region: "Karnataka", country: "India", latitude: 15.34, longitude: 76.46 },
  { name: "Hyderabad", region: "Telangana", country: "India", latitude: 17.39, longitude: 78.49 },
  { name: "Indore", region: "Madhya Pradesh", country: "India", latitude: 22.72, longitude: 75.86 },
  { name: "Istanbul", region: "Istanbul", country: "Türkiye", latitude: 41.01, longitude: 28.98 },
  { name: "Jaipur", region: "Rajasthan", country: "India", latitude: 26.91, longitude: 75.79 },
  { name: "Jakarta", region: "Jakarta", country: "Indonesia", latitude: -6.21, longitude: 106.85 },
  { name: "Kathmandu", region: "Bagmati", country: "Nepal", latitude: 27.72, longitude: 85.32 },
  { name: "Kochi", region: "Kerala", country: "India", latitude: 9.93, longitude: 76.27 },
  { name: "Kolkata", region: "West Bengal", country: "India", latitude: 22.57, longitude: 88.36 },
  { name: "London", region: "England", country: "United Kingdom", latitude: 51.51, longitude: -0.13 },
  { name: "Lucknow", region: "Uttar Pradesh", country: "India", latitude: 26.85, longitude: 80.95 },
  { name: "Manali", region: "Himachal Pradesh", country: "India", latitude: 32.24, longitude: 77.19 },
  { name: "Melbourne", region: "Victoria", country: "Australia", latitude: -37.81, longitude: 144.96 },
  { name: "Moscow", region: "Moscow", country: "Russia", latitude: 55.76, longitude: 37.62 },
  { name: "Mumbai", region: "Maharashtra", country: "India", latitude: 19.08, longitude: 72.88 },
  { name: "Munnar", region: "Kerala", country: "India", latitude: 10.09, longitude: 77.06 },
  { name: "Mysore", region: "Karnataka", country: "India", latitude: 12.3, longitude: 76.64 },
  { name: "Nagpur", region: "Maharashtra", country: "India", latitude: 21.15, longitude: 79.09 },
  { name: "Nainital", region: "Uttarakhand", country: "India", latitude: 29.38, longitude: 79.46 },
  { name: "Nashik", region: "Maharashtra", country: "India", latitude: 19.99, longitude: 73.79 },
  { name: "New York", region: "New York", country: "United States", latitude: 40.71, longitude: -74.01 },
  { name: "Osaka", region: "Ōsaka", country: "Japan", latitude: 34.69, longitude: 135.5 },
  { name: "Oslo", region: "Oslo", country: "Norway", latitude: 59.91, longitude: 10.75 },
  { name: "Paris", region: "Île-de-France", country: "France", latitude: 48.86, longitude: 2.35 },
  { name: "Patna", region: "Bihar", country: "India", latitude: 25.59, longitude: 85.14 },
  { name: "Pune", region: "Maharashtra", country: "India", latitude: 18.52, longitude: 73.86 },
  { name: "Quezon City", region: "Metro Manila", country: "Philippines", latitude: 14.64, longitude: 121.03 },
  { name: "Ranchi", region: "Jharkhand", country: "India", latitude: 23.34, longitude: 85.31 },
  { name: "Rome", region: "Lazio", country: "Italy", latitude: 41.9, longitude: 12.5 },
  { name: "Shimla", region: "Himachal Pradesh", country: "India", latitude: 31.1, longitude: 77.17 },
  { name: "Surat", region: "Gujarat", country: "India", latitude: 21.17, longitude: 72.83 },
  { name: "Sydney", region: "New South Wales", country: "Australia", latitude: -33.87, longitude: 151.21 },
  { name: "Tokyo", region: "Tokyo", country: "Japan", latitude: 35.68, longitude: 139.69 },
  { name: "Toronto", region: "Ontario", country: "Canada", latitude: 43.65, longitude: -79.38 },
  { name: "Udaipur", region: "Rajasthan", country: "India", latitude: 24.58, longitude: 73.71 },
  { name: "Vadodara", region: "Gujarat", country: "India", latitude: 22.31, longitude: 73.18 },
  { name: "Venice", region: "Veneto", country: "Italy", latitude: 45.44, longitude: 12.34 },
  { name: "Warsaw", region: "Masovia", country: "Poland", latitude: 52.23, longitude: 21.01 },
  { name: "Xi'an", region: "Shaanxi", country: "China", latitude: 34.34, longitude: 108.94 },
  { name: "Yokohama", region: "Kanagawa", country: "Japan", latitude: 35.44, longitude: 139.64 },
  { name: "Zurich", region: "Zurich", country: "Switzerland", latitude: 47.38, longitude: 8.54 },
];

// Page elements the script needs to read or update.
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const themeButton = document.getElementById("themeButton");
const unitButton = document.getElementById("unitButton");
const recentSearches = document.getElementById("recentSearches");
const suggestionBox = document.getElementById("suggestionBox");

// Saved preferences and the last city (used when the unit changes).
// lastLocation remembers a picked suggestion's coordinates, if there was one.
let currentUnit = localStorage.getItem("weatherUnit") || "celsius";
let lastCity = "";
let lastLocation = null;

// Shared state for the autocomplete dropdown.
// currentSuggestions is what the dropdown is showing right now.
// suggestionTimer remembers the pending debounce timer so it can be cancelled.
let currentSuggestions = [];
let suggestionTimer = null;
const currentWeather = document.getElementById("currentWeather");
const forecastSection = document.getElementById("forecastSection");
const forecastCards = document.getElementById("forecastCards");
const welcomeCard = document.getElementById("welcomeCard");
const recentSection = document.getElementById("recentSection");
const sceneryImage = document.getElementById("sceneryImage");
const sceneryCount = document.getElementById("sceneryCount");
const sceneryPrev = document.getElementById("sceneryPrev");
const sceneryNext = document.getElementById("sceneryNext");
const sceneryToggle = document.getElementById("sceneryToggle");

// fetchForecast(latitude, longitude) - asks the weather API for one coordinate.
async function fetchForecast(latitude, longitude) {
  // Fahrenheit is a URL option, so the units are fetched, not converted later.
  const unitParameter =
    currentUnit === "fahrenheit" ? "&temperature_unit=fahrenheit" : "";

  const weatherResponse = await fetch(
    `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}` +
      // is_day tells us if it is daytime there, used for the "night" look.
      "&current=temperature_2m,wind_speed_10m,weather_code,is_day" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
      `&timezone=auto&forecast_days=5${unitParameter}`
  );

  if (!weatherResponse.ok) {
    // 503 means the service is overloaded: waiting usually fixes it.
    if (weatherResponse.status === 503) {
      throw new Error(
        "The weather service is busy right now. Please try again in a minute."
      );
    }
    throw new Error("The weather service is not responding. Please try again.");
  }

  const weatherData = await weatherResponse.json();
  return weatherData;
}

// getWeather(cityName, location) - gets the weather for one city. A suggestion
// arrives with coordinates, so the extra geocoding step is skipped for it.
async function getWeather(cityName, location) {
  if (location) {
    const weatherData = await fetchForecast(
      location.latitude,
      location.longitude
    );
    return { name: location.name, country: location.country, weatherData };
  }

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
  const weatherData = await fetchForecast(latitude, longitude);

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

  // The page background follows this city's weather (see style.css).
  document.body.dataset.weather = getWeatherType(
    current.weather_code,
    current.is_day
  );
  // The welcome card has done its job once a search succeeds.
  welcomeCard.hidden = true;

  currentWeather.innerHTML = `
    <p class="current-emoji">${emoji}</p>
    <div>
      <p class="current-temperature">${Math.round(current.temperature_2m)}${degreeLabel}</p>
      <p class="current-place">${name}, ${country}</p>
      <p class="current-description">${description}</p>
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

  // The pill button shows a moon for dark mode and a sun for light mode.
  themeButton.textContent = theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode";

  localStorage.setItem("weatherTheme", theme);
}

// toggleTheme() - switches the page between light and dark mode.
function toggleTheme() {
  const currentTheme = document.documentElement.dataset.theme;
  setTheme(currentTheme === "dark" ? "light" : "dark");
}

// getWeatherType(weatherCode, isDay) - names the weather family used by the
// CSS background. A night code always wins over the weather itself.
function getWeatherType(weatherCode, isDay) {
  if (!isDay) {
    return "night";
  }
  if (weatherCode === 0 || weatherCode === 1) {
    return "sunny";
  }
  // 71-77 are snow, 85-86 are snow showers.
  if ((weatherCode >= 71 && weatherCode <= 77) || weatherCode === 85 || weatherCode === 86) {
    return "snow";
  }
  if (weatherCode >= 95) {
    return "thunderstorm";
  }
  // 51-67 are drizzle and rain, 80-82 are rain showers.
  if (
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 82)
  ) {
    return "rainy";
  }
  // Everything else (overcast, fog, partly cloudy) is the cloudy family.
  return "cloudy";
}

// searchCity(cityName, location) - checks the input, loads and displays one city.
// location is optional and comes from a chosen suggestion (see getWeather).
async function searchCity(cityName, location) {
  // An empty search gets a helpful message instead of a network request.
  if (!cityName) {
    showError("Please enter a city name.");
    return;
  }

  loadingMessage.hidden = false;
  errorMessage.hidden = true;

  try {
    const weather = await getWeather(cityName, location);
    lastCity = weather.name;
    // Keep the coordinates so a °C/°F switch reloads the exact same place.
    lastLocation = location || null;
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

// showRecentCities() - draws one clickable chip for each saved city,
// and hides the whole row when there are no saved cities.
function showRecentCities() {
  const savedCities = JSON.parse(localStorage.getItem("recentCities")) || [];

  recentSection.hidden = savedCities.length === 0;

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

  // The visible text is short, so screen readers get the full action.
  // The label starts with the visible unit, so the two names always match.
  unitButton.setAttribute(
    "aria-label",
    currentUnit === "celsius"
      ? "°C, switch to Fahrenheit"
      : "°F, switch to Celsius"
  );
}

// changeUnit() - switches °C/°F, saves the choice, and reloads the last city.
async function changeUnit() {
  currentUnit = currentUnit === "celsius" ? "fahrenheit" : "celsius";
  localStorage.setItem("weatherUnit", currentUnit);
  updateUnitButton();

  // Only reload if the visitor has already searched for a city.
  if (lastCity) {
    await searchCity(lastCity, lastLocation);
  }
}

// getSuggestions(query) - builds the suggestion list: one letter filters the
// built-in popularCities array, two or more ask the API. Failures return [].
async function getSuggestions(query) {
  // A single letter filters the offline list: only cities starting with it.
  if (query.length === 1) {
    const firstLetter = query.toUpperCase();
    return popularCities.filter(
      (city) => city.name[0].toUpperCase() === firstLetter
    );
  }

  // Two or more letters ask the live geocoding service.
  try {
    const response = await fetch(
      `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=6`
    );

    // A server problem (for example a busy service) means no suggestions.
    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    // An empty results list also means no suggestions.
    if (!data.results || data.results.length === 0) {
      return [];
    }

    // Reshape each API result into the same shape as the popularCities
    // entries, so the rest of the code treats every suggestion the same.
    return data.results.map((result) => ({
      name: result.name,
      region: result.admin1 || "",
      country: result.country || "",
      latitude: result.latitude,
      longitude: result.longitude,
    }));
  } catch (error) {
    // No internet or a broken reply just means no suggestions.
    return [];
  }
}

// showSuggestions(suggestions) - paints the dropdown with one row per city.
function showSuggestions(suggestions) {
  currentSuggestions = suggestions;

  // Nothing to suggest: the dropdown simply closes.
  if (suggestions.length === 0) {
    hideSuggestions();
    return;
  }

  suggestionBox.innerHTML = suggestions
    .map((suggestion, index) => {
      // Some API results have no state, so empty parts are skipped and
      // the label stays clean, like "London, England, United Kingdom".
      const label = [
        suggestion.name,
        suggestion.region,
        suggestion.country,
      ]
        .filter(Boolean)
        .join(", ");

      return `
        <button class="suggestion" type="button" data-index="${index}">
          <span class="suggestion-pin">📍</span>${label}
        </button>
      `;
    })
    .join("");

  suggestionBox.hidden = false;
}

// hideSuggestions() - empties and hides the dropdown.
function hideSuggestions() {
  currentSuggestions = [];
  suggestionBox.innerHTML = "";
  suggestionBox.hidden = true;
}

// A debounce: clear the old timer and set a 300ms one, so only the pause after
// the LAST key press sends a request (one per word, not one per letter).
cityInput.addEventListener("input", () => {
  const query = cityInput.value.trim();

  clearTimeout(suggestionTimer);

  // The old list may not match the new text, so it is closed straight away.
  // Otherwise a slow suggestion could be clicked for the wrong city.
  hideSuggestions();

  // An empty box stays closed; there is nothing to wait for.
  if (query === "") {
    return;
  }

  suggestionTimer = setTimeout(async () => {
    // The visitor may have changed the text while we waited, so only show
    // suggestions that still match what is in the box right now.
    if (cityInput.value.trim() !== query) {
      return;
    }
    const suggestions = await getSuggestions(query);
    showSuggestions(suggestions);
  }, 300);
});

// Clicking a suggestion loads that city straight from its coordinates.
suggestionBox.addEventListener("click", (event) => {
  const button = event.target.closest("button.suggestion");
  if (!button) {
    return;
  }

  const suggestion = currentSuggestions[button.dataset.index];
  hideSuggestions();

  // The suggestion already knows its latitude and longitude, so the
  // normal geocoding step is skipped by passing it to searchCity.
  cityInput.value = suggestion.name;
  searchCity(suggestion.name, suggestion);
});

// Clicking anywhere outside the search area closes the dropdown.
document.addEventListener("click", (event) => {
  if (!event.target.closest(".search-box")) {
    hideSuggestions();
  }
});

// Pressing the Search button or the Enter key submits the form.
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  hideSuggestions();
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

/* ============================================================
   Featured scenery banner
   ============================================================ */

// sceneryPhotos - the two local landscape photos the banner cycles through.
const sceneryPhotos = [
  {
    src: "assets/scenery-hills.jpg",
    alt: "Green hills with a volcano in the distance",
  },
  {
    src: "assets/scenery-mountains.jpg",
    alt: "Snowy mountains beside a frozen river at sunset",
  },
];

// sceneryIndex is which photo is showing, and sceneryTimer holds the
// automatic change timer (it is null whenever the banner is paused).
let sceneryIndex = 0;
let sceneryTimer = null;

// showScenery(index) - shows one photo in the banner and updates the
// caption. Adding the list length before the modulo makes the count wrap
// around at both ends (so -1 becomes the last photo, not an error).
function showScenery(index) {
  sceneryIndex = (index + sceneryPhotos.length) % sceneryPhotos.length;
  const photo = sceneryPhotos[sceneryIndex];
  sceneryImage.src = photo.src;
  sceneryImage.alt = photo.alt;
  sceneryCount.textContent = `${sceneryIndex + 1} of ${sceneryPhotos.length}`;
}

// startSceneryTimer() - changes the photo every 8 seconds automatically.
function startSceneryTimer() {
  stopSceneryTimer();
  sceneryTimer = setInterval(() => {
    showScenery(sceneryIndex + 1);
  }, 8000);
}

// stopSceneryTimer() - stops the automatic photo changes.
function stopSceneryTimer() {
  clearInterval(sceneryTimer);
  sceneryTimer = null;
}

// toggleSceneryTimer() - pauses or resumes the automatic changes and
// swaps the button text between Pause and Play.
function toggleSceneryTimer() {
  if (sceneryTimer === null) {
    startSceneryTimer();
    sceneryToggle.textContent = "Pause";
    sceneryToggle.setAttribute("aria-label", "Pause photo rotation");
  } else {
    stopSceneryTimer();
    sceneryToggle.textContent = "Play";
    sceneryToggle.setAttribute("aria-label", "Resume photo rotation");
  }
}

// The banner starts on the first photo, changing by itself. If the visitor
// has asked their system for reduced motion, it starts paused instead.
showScenery(0);
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  sceneryToggle.textContent = "Play";
  sceneryToggle.setAttribute("aria-label", "Resume photo rotation");
} else {
  startSceneryTimer();
}

// The three banner buttons: previous photo, next photo, and pause/play.
sceneryPrev.addEventListener("click", () => {
  showScenery(sceneryIndex - 1);
});
sceneryNext.addEventListener("click", () => {
  showScenery(sceneryIndex + 1);
});
sceneryToggle.addEventListener("click", toggleSceneryTimer);
