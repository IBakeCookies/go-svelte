<script lang="ts">
import { component, path, createRouterContext } from './routerStore';
import { createSharedContext }  from './sharedContext';

export let ctx: SharedContext = {} as SharedContext;

interface SharedContext {
    data: unknown;
    path: string;
}

createSharedContext(ctx.data);
createRouterContext();

$path = ctx.path;
</script>

{#if $component}
    <svelte:component this={$component} />
{/if}