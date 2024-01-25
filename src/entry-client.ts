import { router } from "./router";
import Router from "./Router.svelte";

async function mount() {
  await router.push(window.location.pathname);

  new Router({
    target: document.getElementById("app"),
    hydrate: true,
    props: {
      ctx: window.__ctx__,
    },
  });
}

mount();
