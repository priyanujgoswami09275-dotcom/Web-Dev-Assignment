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
- Autocomplete suggestions under the search box: one letter filters a built-in
  list of popular cities (including many Indian cities); two or more letters
  ask the geocoding API for up to 6 matches, shown as "Name, State, Country".
  Picking a suggestion skips the extra lookup and loads the weather straight
  from its coordinates. Suggestions wait 300ms after the last key press
  (a debounce) before calling the API.
- Flat paper-notebook design: a warm off-white page, plain white cards separated
  by hairline borders, and black ink. Colour is used sparingly as punctuation.
  Inter carries the interface and Source Serif 4 is used only for the subtitle
  and the welcome sentence. There are no gradients, no blur, and no shadows on
  content cards.
- Colour-coded current weather card: the `data-weather` attribute on `<body>`
  paints it marigold (sunny), sky-wash (cloudy), signal-blue (rainy), sky-tint
  (snow), midnight (thunderstorm), or white/card (night and default). Every
  colour pair is checked to at least 4.5:1.
- Four quick-pick city cards in the empty state (Mumbai, Manali, Tokyo, London)
  that run a normal search when clicked.
- The last five searched cities appear as quiet pill chips under the search box;
  the whole "Recently searched." row hides when there are none.
- Featured scenery banner: a framed photo card below the forecast that changes
  between the two scenic photos every 8 seconds. The arrows change the photo
  by hand, the Pause button stops the automatic changes, and the counter
  shows which photo is showing ("1 of 2").

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

- `index.html` holds the page structure: the top bar, the hero with seven
  decorative weather marks, the search form with its suggestion dropdown, the
  recently searched row, the loading and error messages, the welcome card with
  four quick picks, an empty current-weather section, an empty forecast grid,
  the featured landscape banner, and a small photo credit footer.
- `style.css` holds every design decision as a CSS variable in `:root`. The
  `data-theme` attribute on `<html>` swaps only those variable values for dark
  mode. The `data-weather` attribute on `<body>` (set by `script.js`) chooses
  the current card's background and text colours. There are no gradients, no
  backdrop blur, and exactly one shadow (on the autocomplete dropdown).
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
   still there after a refresh. `showRecentCities` hides the whole
   "Recently searched." row when no city is saved.
7. `handleQuickPick` runs the same `searchCity` function when one of the four
   quick-pick cards is clicked, so the shortcut behaves like a normal search.
8. The scenery banner uses `showScenery`, `startSceneryTimer`,
   `stopSceneryTimer`, and `toggleSceneryTimer`. A `setInterval` changes the
   photo every 8 seconds, the arrows call `showScenery` by hand, and the
   Pause button stops and restarts the timer.

### Design system

The look is "a warm paper notebook under afternoon sun": flat and calm, with
depth coming only from the warm paper behind the white cards and from the one
coloured weather card. Poppins, gradients, glass blur, and card shadows are all
gone. The autocomplete dropdown is the only element allowed a shadow
(`0 4px 12px rgba(0, 0, 0, 0.1)`).

Every design decision lives in `:root` in `style.css`:

| Token | Value | Used for |
| --- | --- | --- |
| `--paper` | `#f6f5f4` | warm page background |
| `--card` | `#ffffff` | white cards and inputs |
| `--ink` | `#000000` | the base ink colour |
| `--body-text` | `#615d59` | subtitle and footer copy |
| `--stone` | `#757575` | input placeholder text |
| `--border` | `rgba(0, 0, 0, 0.08)` | hairline borders |
| `--blue` | `#0075de` | the one filled button and focus rings |
| `--sky-tint` | `#e6f3fe` | snow card and light hover wash |
| `--marigold` | `#ffb110` | sunny card |
| `--coral` | `#f64932` | error card border |
| `--sky-wash` | `#62aef0` | cloudy card |
| `--signal-blue` | `#097fe8` | rainy card |
| `--midnight` | `#02093a` | thunderstorm card and dark page |
| `--peach` | `#f6d5b8` | the "Weather" highlight pill |
| `--text-strong` | `rgba(0, 0, 0, 0.95)` | main text |
| `--text-soft` | `rgba(0, 0, 0, 0.6)` | secondary text |
| `--text-faint` | `rgba(0, 0, 0, 0.4)` | quiet labels and minimums |

The three radii are `--radius-card: 12px`, `--radius-button: 8px`, and
`--radius-pill: 9999px`. Spacing runs from `--space-1: 4px` through
`--space-8: 80px`, with `--section-gap` giving 80px between big sections on a
laptop and 32px on a phone. The type scale is `--text-caption: 12px`,
`--text-small: 14px`, `--text-body: 16px`, `--text-card-title: 22px/700`,
`--text-page-title: clamp(36px, 7vw, 54px)/700`, and
`--text-temperature: 72px/600`. Inter is used for everything except the
subtitle and the welcome sentence, which use Source Serif 4.

A few value-only helper tokens make the swaps possible without new component
CSS: `--ghost`, `--hover-wash`, `--on-color`, `--on-dark`, `--blue-hover`,
`--weather-card-bg`, and `--weather-card-ink`. They are all defined in the same
`:root` block and only ever change value.

### Weather card colours

`getWeatherType()` turns the weather code into one of these names, and
`showWeather()` stores it as `data-weather` on `<body>`. CSS then sets
`--weather-card-bg` and `--weather-card-ink` for that name, so the single
`.weather-card` rule paints the right pair.

| `data-weather` | Weather codes | Card background | Text |
| --- | --- | --- | --- |
| `sunny` | 0, 1 (daytime) | marigold `#ffb110` | black |
| `cloudy` | 2, 3, 45, 48 | sky-wash `#62aef0` | black |
| `rainy` | 51-67, 80-82 | signal-blue `#097fe8` | black |
| `snow` | 71-77, 85-86 | sky-tint `#e6f3fe` | black |
| `thunderstorm` | 95, 96 | midnight `#02093a` | white |
| `night` | any code with `is_day` = 0 | `--card` | ink |
| `default` | before the first search | `--card` | ink |

White text on the rainy blue measures only 4.03:1, so the rainy card uses black
text instead (5.21:1). The other five pairs measure 8.83:1 or higher.

### Dark mode

`setTheme()` writes `data-theme="dark"` on `<html>`. A single
`html[data-theme="dark"]` block in `style.css` re-points the same variables:
the page becomes `--midnight`, cards become `#0d1450`, the border becomes
`rgba(255, 255, 255, 0.12)`, and the ink alphas flip to white at 0.95 / 0.6 /
0.4. Ghost buttons use `rgba(255, 255, 255, 0.1)`, and the hover wash becomes
`rgba(255, 255, 255, 0.16)`. The Search button stays `--blue`, and the
weather-coloured card keeps its accent colour. No component rule is rewritten
for dark mode; only the variable values change. The choice is still remembered
in `localStorage`.

### Featured scenery banner

The banner below the forecast cycles through the two photos in the
`sceneryPhotos` list. `showScenery(index)` shows one photo: the line
`(index + sceneryPhotos.length) % sceneryPhotos.length` makes the count wrap
around, so "next" on the last photo goes back to the first and "previous" on
the first photo goes to the last. `startSceneryTimer()` calls `setInterval`
with 8000 milliseconds, so the photo changes by itself every 8 seconds;
`toggleSceneryTimer()` clears that timer (Pause) or starts it again (Play)
and flips the button label to match. If the visitor's system asks for
reduced motion, the banner starts paused so nothing moves on its own.

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
