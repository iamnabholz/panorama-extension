import { writable } from 'svelte/store';

export const optionsPageOpened = writable(false);

// FEATURES SHOW & HIDE
const createSettingsStore = () => {
  const defaultSettings = {
    dateActive: true,

    backgroundActive: true,
    updateBackground: true,

    weatherActive: true,
    usingMetric: true,

    sitesActive: true,

    redditActive: false,
  };

  // Load settings from localStorage or use default settings
  const storedSettings = localStorage.getItem('settings');
  const initialSettings = storedSettings ? JSON.parse(storedSettings) : defaultSettings;

  // Create a writable store with the initial settings
  const store = writable(initialSettings);

  // Subscribe to store changes and update localStorage whenever the settings change
  store.subscribe((settings) => {
    localStorage.setItem('settings', JSON.stringify(settings));
  });

  return store;
}

export const settings = createSettingsStore();

export const updateSetting = (key, value = null) => {
  settings.update((settings) => {
    if (value === null) {
      value = !settings[key]
    }
    return { ...settings, [key]: value };
  });
};


// WEATHER RELATED STORES
const defaultWeatherCoordinates = { lat: -17.77, lon: -63.18 }
export const weatherCoordinates = writable(
  localStorage.getItem("coords") !== null
    ? JSON.parse(localStorage.getItem("coords"))
    : defaultWeatherCoordinates
);
weatherCoordinates.subscribe(value => localStorage.setItem("coords", JSON.stringify(value)));

// REDDIT RELATED SETTINGS
export const subredditList = writable(
  localStorage.getItem("subr") != null
    ? JSON.parse(localStorage.getItem("subr"))
    : ["nasa", "science", "UpliftingNews"]
);
subredditList.subscribe(value => localStorage.setItem("subr", JSON.stringify(value)));

// BACKGROUND RELATED STORES
const defaultBackgroundQuery = "ocean waves";
export const backgroundQuery = writable(localStorage.getItem("bg-queery") || defaultBackgroundQuery);
backgroundQuery.subscribe(value => localStorage.setItem("bg-queery", value));

export const backgroundColor = writable(localStorage.getItem("bg-color") || "#1fd0cd");
backgroundColor.subscribe(value => localStorage.setItem("bg-color", value));