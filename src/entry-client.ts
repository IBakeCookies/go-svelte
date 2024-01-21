import "./app.css";
import App from "./App.svelte";

new App({
  target: document.getElementById("app"),
  hydrate: true,
  props: {
    order: window.__order__,
    // order: {"id":"1","quantity":85.085430407177}
  },
});
