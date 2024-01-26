import { type RenderOutput, render as svelteRenderer } from "svelte/server";
import { router } from "./router";
import Router from "./Router.svelte";
import { type Context } from "./sharedContext.svelte";

export async function render(ctx: Context): Promise<RenderOutput> {
  await router.push(ctx.path);

  return svelteRenderer(Router, {
    props: {
      ctx,
    },
  });
}
