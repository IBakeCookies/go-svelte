<script lang="ts">
import { router } from './router.svelte';
import Loader from './loader.svelte';

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
    >
        <!-- <RouterView /> -->
    </svelte:component>
{/if}

