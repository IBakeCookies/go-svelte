import { router } from "./router";
import Router from "./Router.svelte";
import { component, path } from "./routerStore";

export async function render({ ctx, url }) {
  console.log("entry-server:", ctx);

  // avoid data leak
  component.set(null);
  path.set("");

  await router.push(url);

  return Router.render({
    ctx,
  });
}
