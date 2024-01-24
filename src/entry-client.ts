import { router, entryMap } from "./router";
import Router from "./Router.svelte";

async function mount() {
  const module = await entryMap[window.location.pathname].component();

  new Router({
    target: document.getElementById("app"),
    hydrate: true,
    props: {
      routes: router.routes,
      path: window.location.pathname,
      component: module.default,
      ssrData: window.__ssrData__,
    },
  });
}

mount();
