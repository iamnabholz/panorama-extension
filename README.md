# Panorama Tab

Panorama Tab swaps your browser's new tab for a simple glanceable summary laid over a background you choose, in a beautiful glass-panel UI. No widgets to arrange, nothing competing for your attention or time.

![Panorama Tab Screenshot](/src/assets/app_screenshot.png)

## Features

- **One-line summary** — time, weather, in a single readable line
- **Date and holidays** — see the current date and upcoming holidays on your country
- **Background images** — set your own scene behind the summary
- **Easy to customize** — click the clock to switch 12h/24h, click the temperature to switch °F/°C
- **Local-only** — no accounts, no cloud sync, nothing sent anywhere except the data fetches you'd expect (weather, holidays)
- **Free** — no premium tier

## Development

```bash
# Install dependencies
npm install

# Run the application as a local web page
npm run dev

# Build the Chrome extension
npm run build:chrome

# Build the Firefox extension
npm run build:firefox
```

Both extension builds write to `dist`. Building one browser replaces the
previous browser's output. `npm run build` defaults to Firefox unless
`TARGET` is set.

### Chrome

1. Run `npm run build:chrome`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Choose **Load unpacked** and select `dist`.

### Firefox

1. Run `npm run build:firefox`.
2. Open `about:debugging#/runtime/this-firefox`.
3. Choose **Load Temporary Add-on**.
4. Select `dist/manifest.json`.

## Privacy

Panorama Tab doesn't have accounts or a backend. Settings are stored locally and never leave your device except for the weather/holiday API calls needed to show that data.
