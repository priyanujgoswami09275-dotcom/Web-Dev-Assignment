# Weather Dashboard

A small weather app built with plain HTML, CSS, and vanilla JavaScript. Type a
city name to see its current weather and a five-day forecast. No frameworks, no
build tools, and no API key are needed.

## Features

- Search for a city with the Search button or by pressing Enter.
- Current weather card: a large weather emoji, a very big temperature, the city
  and country as a heading, then the description and wind speed.
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
- Modern glass design: the page background is a soft gradient that changes with
  the searched city's weather (sunny, cloudy, rainy, snow, thunderstorm, night,
  or a deep-blue default). Cards are frosted glass with rounded corners. The
  page uses the Poppins font, a CSS loading spinner, and a welcome card that
  says "Search a city to see the weather" before the first search.
- Scenic photo backgrounds: sunny and cloudy weather lay a green-hills photo
  over the sky, and snow and night lay a snowy-mountain photo. A dark scrim
  sits between the photo and the page so the header stays readable, and if a
  photo file is missing the sky quietly falls back to its plain gradient.

## APIs used

All weather data comes from [Open-Meteo](https://open-meteo.com/). No API key is
required.

| Purpose | Address |
| --- | --- |
| Find a city's coordinates | `https://geocoding-api.open-meteo.com/v1/search?name=CITY&count=1` |
| Fetch current and daily weather | `https://api.open-meteo.com/v1/forecast` |

The forecast request asks for `temperature_2m`, `wind_speed_10m`,
`weather_code`, and `is_day` for the current weather, and `weather_code`,
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
  The `data-weather` attribute on `<body>` (set by `script.js`) picks one of
  seven sky gradients, and each sky also defines the `--sky-ink` colour used by
  the text that sits directly on the background. Cards use a semi-transparent
  surface plus `backdrop-filter: blur(12px)` for the glass look.
  The forecast uses `repeat(auto-fit, minmax(145px, 1fr))`, so five cards sit in
  a row on a laptop and two per row on a phone without media queries.
- `script.js` holds all the behaviour:

1. When the form is submitted, `searchCity` checks the input and shows the
   loading spinner.
2. `getWeather` calls the geocoding API to turn the city name into latitude and
   longitude, then calls the forecast API with those coordinates (the shared
   `fetchForecast` helper builds that second request). If it is given a
   suggestion that already has coordinates, it skips the geocoding step. It
   returns the city details and the weather data.
3. `showWeather` reads the returned object, looks up the weather code in the
   `weatherDescriptions` object, sets `data-weather` from `getWeatherType`, and
   builds the current card and the five forecast cards with template strings.
4. `showError` displays a friendly message and hides old results.
5. While you type, `getSuggestions` builds the suggestion list (the built-in
   `popularCities` list for one letter, the geocoding API with `count=6` for
   two or more), `showSuggestions` paints the dropdown, and `hideSuggestions`
   closes it. A 300ms debounce timer waits until you stop typing before the
   API is called.
6. Theme, unit, and recent-city choices are saved in `localStorage`, so they are
   still there after a refresh.

### Weather backgrounds

`getWeatherType()` turns the API's weather code into one of these names, and
`showWeather()` stores it as `data-weather` on `<body>` so CSS can pick the
matching sky. Four skies also show a scenic photo under a dark scrim (a
see-through gradient layer); the others keep their plain gradient.

| `data-weather` | Weather codes | Sky | Photo |
| --- | --- | --- | --- |
| `sunny` | 0, 1 (daytime) | warm yellow-blue | green hills |
| `cloudy` | 2, 3, 45, 48 | grey-blue | green hills |
| `rainy` | 51-65, 80-82 | dark blue | — |
| `snow` | 71-77 | ice blue | snowy mountains |
| `thunderstorm` | 95, 96 | dark purple | — |
| `night` | any code with `is_day` = 0 | deep blue | snowy mountains |
| `default` | before the first search | deep blue | — |

In `style.css` each sky rule sets two layers for `background-image`: the scrim
first and `--sky-photo` second. A scrim is a see-through dark layer that keeps
the header text readable on top of a photo. Skies without a photo leave
`--sky-photo` as `none`, so only their gradient shows — and if a photo file is
missing, the browser just skips that layer, which is the fallback.

### Saved values

| `localStorage` key | What it stores |
| --- | --- |
| `weatherTheme` | `"light"` or `"dark"` |
| `weatherUnit` | `"celsius"` or `"fahrenheit"` |
| `recentCities` | A JSON array of the last five city names |

## Credits

- Weather data from [Open-Meteo](https://open-meteo.com/).
- Scenic photos from [Pexels](https://www.pexels.com/), free to use under the
  Pexels license: snowy mountains by
  [Eberhard Grossgasteiger](https://www.pexels.com/@eberhardgross) and green
  hills by [chiecharon](https://www.pexels.com/@chiecharon).
