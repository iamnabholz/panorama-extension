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
}
