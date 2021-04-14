import {
    writable
} from 'svelte/store';


//WEATHER RELATED
export const weather = writable(localStorage.getItem("weather-toggle") || "true");
weather.subscribe(val => localStorage.setItem("weather-toggle", val));

export const latitude = writable(localStorage.getItem("latitude") || 0);
latitude.subscribe(val => localStorage.setItem("latitude", val));

export const longitude = writable(localStorage.getItem("longitude") || 0);
longitude.subscribe(val => localStorage.setItem("longitude", val));


//SEARCH BAR RELATED
export const search = writable(localStorage.getItem("search-toggle") || "true");
search.subscribe(val => localStorage.setItem("search-toggle", val));

export const defaultSearch = writable(localStorage.getItem("engine") || "g");

export const sites = writable(localStorage.getItem("sites-toggle") || "true");
sites.subscribe(val => localStorage.setItem("sites-toggle", val));

export const reddit = writable(localStorage.getItem("reddit-toggle") || "true");
reddit.subscribe(val => localStorage.setItem("reddit-toggle", val));


//BACKGROUND RELATED
export const background = writable(localStorage.getItem("bg-toggle") || "true");
background.subscribe(val => localStorage.setItem("bg-toggle", val));

export const searchBackground = writable(localStorage.getItem("search") || "nasa");
searchBackground.subscribe(val => localStorage.setItem("search", val));

export const backgroundColor = writable(localStorage.getItem("bg-color") || "f2f2f2");