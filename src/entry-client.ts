import "./app.css";
import App from "./App.svelte";

new App({
  target: document.getElementById("app"),
  hydrate: true,
  props: {
    initialData: window.__initialData__,
  },
});
