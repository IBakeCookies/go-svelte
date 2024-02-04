import { type Context } from './sharedContext.svelte';
import { type RenderOutput, render as svelteRenderer } from 'svelte/server';
import { router } from './router1.svelte';
import App from './app.svelte';

export async function render(ctx: Context): Promise<RenderOutput> {
    await router.push(ctx.path);

    return svelteRenderer(App, {
        props: {
            ctx,
        },
    });
}
