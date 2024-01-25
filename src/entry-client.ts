import { router } from "./router";
import Router from "./Router.svelte";
import { random } from "./ssrStore";

async function mount() {
  // const entry = router.entryMap[window.location.pathname];
  // const ssrData = window.__ssrData__;
  // let isGuardPassed = true;

  // if (entry.guard) {
  //   isGuardPassed = entry.guard(ssrData);
  // }

  // if (!isGuardPassed) {
  //   return;
  // }

  // const module = await entry.component();

  random.set(window.__ssrData__.random);

  await router.push(window.location.pathname);

  new Router({
    target: document.getElementById("app"),
    hydrate: true,
  });
}

mount();
