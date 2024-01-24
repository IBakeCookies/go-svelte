import { router, entryMap } from "./router";
import Router from "./Router.svelte";

export async function render(data) {
  console.log("entry-server:", { data });

  const entry = entryMap[data.url];

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
