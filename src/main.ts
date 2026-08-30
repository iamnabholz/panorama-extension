import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";

function getCache() {
  const cached = localStorage.getItem("background");
  if (cached) {
    const background = JSON.parse(cached);

    if (background.type == "image") {
      document.documentElement.style.setProperty(
        "--bg-image",
        `url("${background.value}")`,
      );
    } else {
      document.documentElement.style.setProperty(
        "--bg-color",
        background.value,
      );
    }
  }
}

getCache();

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
