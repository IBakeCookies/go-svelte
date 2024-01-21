import "./app.css";
import App from "./App3.svelte";

new App({
  target: document.getElementById("app"),
  hydrate: true,
});
