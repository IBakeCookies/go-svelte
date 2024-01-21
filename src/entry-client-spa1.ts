import "./app.css";
import App from "./App4.svelte";

new App({
  target: document.getElementById("app"),
  hydrate: true,
});
