import "./app.css";
import App from "./App5.svelte";

new App({
  target: document.getElementById("app"),
  hydrate: true,
});
