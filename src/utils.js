const cleanLocalStorage = () => {
  if (!localStorage.getItem("CLEANED")) {
    localStorage.clear();
    localStorage.setItem("CLEANED", "DONE")
  }
}

cleanLocalStorage();

export const checkTimerDone = (timeInMs, hoursForDone = 1) => {
  const hoursInMs = (hoursForDone * 60 * 60 * 1000);
  const timerEnd = timeInMs + hoursInMs;
  return timerEnd < Date.now();
}

export const attemptLocationRequest = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        const coordinates = {
          lat: location.coords.latitude.toFixed(3),
          lon: location.coords.longitude.toFixed(3),
        };
        resolve(coordinates);
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true }
    );
  });
};

const colors = [
  "green",
  "#638deb",
  "#1ba2e0",
  "#ffc92c",
  "#f96c1d",
  "#cb3e1e",
];

// Create a map to store assigned colors for subreddits
const subredditColorMap = new Map();
let colorIndex = 0;

// Function to assign a color based on the subreddit name
export const getColorForSubreddit = (subreddit) => {
  // If the subreddit already has an assigned color, return it
  if (subredditColorMap.has(subreddit)) {
    return subredditColorMap.get(subreddit);
  }

  // Otherwise, assign the next color in the array
  const assignedColor = colors[colorIndex % colors.length];
  subredditColorMap.set(subreddit, assignedColor);

  // Move to the next color in the list
  colorIndex++;

  return assignedColor;
}