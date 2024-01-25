import { router, entryMap } from "./router";
import Router from "./Router.svelte";

async function mount() {
  const entry = entryMap[window.location.pathname];
  const ssrData = window.__ssrData__;
  let isGuardPassed = true;

  if (entry.guard) {
    isGuardPassed = entry.guard(ssrData);
  }

  if (!isGuardPassed) {
    return;
  }

  const module = await entry.component();

  new Router({
    target: document.getElementById("app"),
    hydrate: true,
    props: {
      routes: router.routes,
      path: window.location.pathname,
      component: module.default,
      ssrData,
    },
  });
}

mount();
