// background.js
const openWeatherUrl = "https://weather-grab.nabholz.workers.dev/";
const unsplashUrl = "https://background-grab.nabholz.workers.dev/?cat=";

// @ts-ignore
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == 'fetch-weather') {
    fetch(
      openWeatherUrl
    ).then(
      (response) => response.json()
    ).then((data) => {
      sendResponse({ response: data });
    }
    ).catch(error => {
      console.error(error);
      sendResponse({ error: 'Failed to fetch weather data' });
    });
  }

  if (request.message == 'fetch-background') {
    fetch(unsplashUrl + request.query
    ).then((response) => response.json()
    ).then((data) => {
      sendResponse({ response: data });
    }
    ).catch(error => {
      console.error(error);
      sendResponse({ error: 'Failed to fetch background data' });
    });
  }

  return true;
});