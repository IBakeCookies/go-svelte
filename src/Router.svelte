<script lang="ts">
import { type Context, createSharedContext, getSharedContext }  from './sharedContext.svelte';
import { router } from './router.svelte';
import Loader from './loader.svelte';
import './global.css';

let { ctx } = $props<{ 
    ctx: Context; 
}>();

createSharedContext(ctx.data);

const context = getSharedContext();

$inspect(context);

// @todo move into a hydrator function?
router.path = ctx.path;

function getCurrentRouteProps() {
    if(!router.currentRoute || !router.currentRoute.props) {
        return {};
    }

    // ????? does this even make senes?
    return router.currentRoute.props(router.currentRoute);
}

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
    <svelte:component 
        this={router.component} 
        props={getCurrentRouteProps()}
    />
{/if}

