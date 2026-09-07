/**
 * Schema of everything this app stores.
 * Add new keys here — this is the single source of truth
 * for what's storable and what type each key holds.
 */
export interface StateSchema {
  useMetric: boolean;
  use24Hour: boolean;
  sentenceVisible: boolean;
  imageUpdateFrequency: string;

  displayGreeting: boolean;
  displayTime: boolean;
  displayWeather: boolean;

  background: {
    type: string;
    value: string;
  };
  "color-cache": {
    gradient: boolean;
    startColor: string;
    endColor?: string;
  };

  "image-cache"?: BackgroundImage;
  "weather-cache"?: WeatherData;
  "holiday-cache"?: {
    holidays: HolidayData[];
    fetchedAt: number;
    cacheDuration: number;
  };
}

// Weather information
export interface WeatherResponse {
  coord: { lon: number; lat: number };
  weather: { id: number; main: string; description: string; icon: string }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: { speed: number; deg: number };
  clouds: { all: number };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface WeatherData {
  temperature: number; // Celsius, raw from API
  description: string;
  icon: string;
  location: string;
  fetchedAt: number;
  cacheDuration: number;
}

// Background image
export interface BackgroundImage {
  query: string;
  url: string;
  author: string;
  link: string;
  fetchedAt: number;
}

//Holidays
export interface HolidayData {
  country: string;
  iso: string;
  year: number;
  date: string; // "YYYY-MM-DD"
  day: string; // "Monday", "Tuesday", etc.
  name: string;
}

export interface HolidayCache {
  holidays: HolidayData[];
  fetchedAt: number;
  cacheDuration: number;
}
