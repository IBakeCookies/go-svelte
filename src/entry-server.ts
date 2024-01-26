import { type RenderOutput, render as svelteRenderer } from 'svelte/server';
import { router, extractSlug, findRoute } from './router.svelte';
import Router from './Router.svelte';
import { type Context } from './sharedContext.svelte';

export async function render(ctx: Context): Promise<RenderOutput> {
    await router.push(ctx.path);

    // const slugValue = extractSlug(ctx.path);

    // const route = findRoute(router.routes, ctx.path);

    // route.params = {
    //     id: slugValue,
    // };

    return svelteRenderer(Router, {
        props: {
            ctx,
            // props: route?.props && route.props(route),
        },
    });
}
