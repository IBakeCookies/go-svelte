<script lang="ts">
import { routerComponentStore } from './routerStore';

export let serverComponent = null;

$: component = serverComponent || $routerComponentStore
</script>

{#if component}
    <svelte:component this={component} />
{/if}