<script lang="ts">
import './global.css';
import Router from './Router.svelte';
import { type Context, createSharedContext }  from './sharedContext.svelte';
import { router } from './router1.svelte';
import { setContext } from 'svelte';
import { routerState } from './routerState.svelte'; 

let { ctx } = $props<{ 
    ctx: Context; 
}>();

createSharedContext(ctx.data);

setContext('router-store',  routerState);

const isServer = import.meta.env.SSR;

$effect(() => { 
    if(!isServer) {
        console.log('[router enter]', { router })
    }
});

$inspect(router);
</script>

<main class="bg-gray-900 p-4">
    <h2>app.svelte</h2>
    <Router />
    
    <!-- not working yet -->
    <!-- <Router name="footer" /> -->
</main>

<!-- <Router name="test" /> -->
