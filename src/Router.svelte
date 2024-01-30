<script lang="ts">
import { type Context, createSharedContext }  from './sharedContext.svelte';
import { router } from './router.svelte';
import Loader from './loader.svelte';
import './global.css';

let { ctx } = $props<{ 
    ctx: Context; 
}>();

createSharedContext(ctx.data);

// @todo move into a hydrator function?
router.state.path = ctx.path;

const isServer = import.meta.env.SSR;
const routeProps = $derived(
    router.state.currentRoute &&
    router.state.currentRoute.props && 
    router.state.currentRoute.props(router.state.currentRoute)
); 

$inspect(router);

$effect(() => { 
    if(!isServer) {
        console.log('[router enter]', { router })
    }
});
</script>

{#if !router.state.isMounted && !isServer}
    <Loader />
{/if}

{#if router.state.component}
    <svelte:component 
        this={router.state.component} 
        {...routeProps}
    />
{/if}

