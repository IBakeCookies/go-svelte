<script lang="ts">
import { component, path, createRouterContext } from './routerStore';
import { type Context, createSharedContext }  from './sharedContext.svelte';

export let ctx: Context = {} as Context;

// let { ctx } = $props<SharedContext>(); 

createSharedContext(ctx.data);
createRouterContext();

$path = ctx.path;
</script>

{#if $component}
    <svelte:component this={$component} />
{/if}