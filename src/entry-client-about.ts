import "./app.css";
import App from "./App2.svelte";

new App({
  target: document.getElementById("app"),
  hydrate: true,
  props: {
    // a: "HELLO FROM CLIENT",
  },
});
