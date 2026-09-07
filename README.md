# Panorama Tab

Panorama Tab swaps your browser's new tab for a simple glanceable summary laid over a background you choose, in a beautiful glass-panel UI. No widgets to arrange, nothing competing for your attention or time.

## Features

- **One-line summary** — time, weather, in a single readable line
- **Date and holidays** — see the current date and upcoming holidays on your country
- **Background images** — set your own scene behind the summary
- **Easy to customize** — click the clock to switch 12h/24h, click the temperature to switch °F/°C
- **Local-only** — no accounts, no cloud sync, nothing sent anywhere except the data fetches you'd expect (weather, holidays)
- **Free** — no premium tier

## Tech stack

- [Svelte 5](https://svelte.dev/) (runes)
- Vite — dual build targets (`dist/web`, `dist/extension`) from a single project
- TypeScript

## Development

```bash
# install dependencies
npm install

# run the web app locally
npm run dev

# build the browser extension
npm run build
```

To load the extension build locally: open your browser's extensions page, enable developer mode, and load `dist/extension` as an unpacked extension.

## Privacy

Panorama Tab doesn't have accounts or a backend. Settings are stored locally and never leave your device except for the weather/holiday API calls needed to show that data.
