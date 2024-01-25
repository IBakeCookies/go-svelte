<script lang="ts">
import { routerStore } from './routerStore';

export let ssrData = {};

const { component } = routerStore;
</script>

{#if $component}
    <svelte:component this={$component} />
{/if}