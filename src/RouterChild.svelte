<script lang="ts">
import { router } from './router.svelte';
</script>

{#if router.state.childComponent}
    <svelte:component 
        this={router.state.childComponent} 
    />
{/if}

