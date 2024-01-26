<script lang="ts">
import { type Context, createSharedContext }  from './sharedContext.svelte';
import { router } from './router.svelte';
import Loader from './loader.svelte';

let { ctx, props } = $props<{ 
    ctx: Context; 
    props: unknown
}>();

createSharedContext(ctx.data);

router.path = ctx.path;

$effect(() => {
    if(!import.meta.env.SSR) {
        console.log('[router enter]', { router })
    }
});
</script>

{#if router.isLoadingComponent}
    <Loader />
{/if}

{#if router.component}
    <svelte:component this={router.component} {props} />
{/if}

