import { router, entryMap } from "./router";
import Router from "./Router.svelte";

export async function render(data) {
  console.log("entry-server:", { data });

  const entry = entryMap[data.url];
  let isGuardPassed = true;

  if (entry.guard) {
    isGuardPassed = entry.guard(data.ssrData);
  }

  if (!isGuardPassed) {
    return {};
  }

  if (!entry.isSsr) {
    return Router.render({
      ...data,
      routes: router.routes,
      path: data.url,
      ssrData: data.ssrData,
    });
  }

  const module = await entry.component();

  return Router.render({
    ...data,
    component: module.default,
    routes: router.routes,
    path: data.url,
    ssrData: data.ssrData,
  });
}
