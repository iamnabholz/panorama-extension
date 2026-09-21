import { mount } from "svelte";
import "./styles/styles.css";
import App from "./App.svelte";
import { uiState } from "./lib/state.svelte";
import { loadBackground } from "./lib/utils/storage";

function restoreInitialBackground(): void {
  try {
    const background = loadBackground();

    if (!background) {
      uiState.showOnboardAtLaunch = true;
      return;
    }

    let value = "none";

    if (background.type === "image" && background.value !== "") {
      // Quote the URL so its contents cannot escape the CSS url() argument.
      const url = new URL(background.value).href;
      value = `url(${JSON.stringify(url)})`;
    } else if (background.type === "color") {
      value = background.value;
    }

    document.documentElement.style.setProperty("--background-value", value);
  } catch (error) {
    // Early painting is optional; a cache problem must not block mounting.
    console.warn("Could not restore the initial background.", error);
  }
}

restoreInitialBackground();

const target = document.getElementById("app");

if (!target) {
  throw new Error(
    'Cannot start Panorama: the "#app" mount element is missing.',
  );
}

const app = mount(App, { target });

export default app;
