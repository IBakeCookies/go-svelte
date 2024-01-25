import { random } from "./ssrStore";
import { router } from "./router";
import Router from "./Router.svelte";

export async function render(data) {
  console.log("entry-server:", { data });

  random.set(data.ssrData.random);

  await router.push(data.url);

  return Router.render();
}
