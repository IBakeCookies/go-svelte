import { random } from "./ssrStore";
import { router } from "./router";
import Router from "./Router.svelte";

function hydrateStore(data) {
  random.set(data);
}

export async function render(data) {
  console.log("entry-server:", { data });

  const targetRoute = router.routes.find((route) => route.path === data.url);

  hydrateStore(data.ssrData.random);

  // await router.push(data.url);

  let module = null;

  if (targetRoute.isSsr) {
    module = await targetRoute.component();
    module = module.default;
  }

  return Router.render({
    serverComponent: module,
  });
}
