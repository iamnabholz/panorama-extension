import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { uiState } from "./lib/state.svelte";

function getCache() {
  const cached = localStorage.getItem("background");
  if (cached) {
    const background = JSON.parse(cached);

    if (background.type === "image") {
      document.documentElement.style.setProperty(
        "--background-value",
        `url("${background.value}")`,
      );
    } else {
      document.documentElement.style.setProperty(
        "--background-value",
        background.value as string,
      );
    }
  } else {
    uiState.showOnboardAtLaunch = true;
  }
}

getCache();

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
