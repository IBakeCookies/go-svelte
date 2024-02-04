<script lang="ts">
import './global.css';
import Router from './Router.svelte';
import { type Context, createSharedContext }  from './sharedContext.svelte';
import { router } from './router1.svelte';
import { getContext, onDestroy, setContext } from 'svelte';
import { routerState } from './routerState.svelte'; 

let { ctx } = $props<{ 
    ctx: Context; 
}>();

createSharedContext(ctx.data);

// @todo move into a hydrator function?
// router.path = ctx.path;

setContext('router-store',  routerState);

const isServer = import.meta.env.SSR;

$effect(() => { 
    if(!isServer) {
        console.log('[router enter]', { router })
    }
});

$inspect(router);
</script>

<Router />
