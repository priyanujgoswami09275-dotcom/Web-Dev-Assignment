# Weather Dashboard

A small weather app built with plain HTML, CSS, and vanilla JavaScript. Type a
city name to see its current weather and a five-day forecast. No frameworks, no
build tools, and no API key are needed.

## Features

- Search for a city with the Search button or by pressing Enter.
- Current weather card: city, country, temperature, wind speed, and a
  description with an emoji.
- Five-day forecast cards showing the day, an emoji, and the maximum and
  minimum temperature.
- Loading message while data is being fetched, and friendly error messages for
  an empty search, an unknown city, or no internet connection.
- Light / dark mode that is remembered with `localStorage`.
- °C / °F temperature toggle that is remembered with `localStorage`.
  Wind speed always stays in km/h.
- The last five searched cities appear as clickable chips under the search box.
- Autocomplete suggestions under the search box: one letter filters a built-in
  list of popular cities (including many Indian cities); two or more letters
  ask the geocoding API for up to 6 matches, shown as "Name, State, Country".
  Picking a suggestion skips the extra lookup and loads the weather straight
  from its coordinates. Suggestions wait 300ms after the last key press
  (a debounce) before calling the API.

## APIs used

All weather data comes from [Open-Meteo](https://open-meteo.com/). No API key is
required.

| Purpose | Address |
| --- | --- |
| Find a city's coordinates | `https://geocoding-api.open-meteo.com/v1/search?name=CITY&count=1` |
| Fetch current and daily weather | `https://api.open-meteo.com/v1/forecast` |

The forecast request asks for `temperature_2m`, `wind_speed_10m`, and
`weather_code` for the current weather, and `weather_code`,
`temperature_2m_max`, and `temperature_2m_min` for the five daily entries. It
uses `timezone=auto` and `forecast_days=5`.

## How to run

1. Download or clone this folder.
2. Double-click `index.html`. It opens in your browser and works without a
   server.
3. Type a city name (for example `London`) and press **Search** or **Enter**.

An internet connection is needed because the weather data is fetched live.

## How the code works

The project has exactly three files.

- `index.html` holds the page structure: the masthead, the search form with its
  suggestion dropdown, the loading and error messages, an empty current-weather
  section, and an empty forecast grid.
- `style.css` holds all the colours in CSS variables. The `data-theme`
  attribute on the `<html>` element switches between the light and dark values.
  The forecast uses `repeat(auto-fit, minmax(170px, 1fr))`, so cards sit in a
  row on a laptop and stack on a phone without media queries.
- `script.js` holds all the behaviour:

1. When the form is submitted, `searchCity` checks the input and shows the
   loading message.
2. `getWeather` calls the geocoding API to turn the city name into latitude and
   longitude, then calls the forecast API with those coordinates (the shared
   `fetchForecast` helper builds that second request). If it is given a
   suggestion that already has coordinates, it skips the geocoding step. It
   returns the city details and the weather data.
3. `showWeather` reads the returned object, looks up the weather code in the
   `weatherDescriptions` object, and builds the current card and the five
   forecast cards with template strings.
4. `showError` displays a friendly message and hides old results.
5. While you type, `getSuggestions` builds the suggestion list (the built-in
   `popularCities` list for one letter, the geocoding API with `count=6` for
   two or more), `showSuggestions` paints the dropdown, and `hideSuggestions`
   closes it. A 300ms debounce timer waits until you stop typing before the
   API is called.
6. Theme, unit, and recent-city choices are saved in `localStorage`, so they are
   still there after a refresh.

### Saved values

| `localStorage` key | What it stores |
| --- | --- |
| `weatherTheme` | `"light"` or `"dark"` |
| `weatherUnit` | `"celsius"` or `"fahrenheit"` |
| `recentCities` | A JSON array of the last five city names |
