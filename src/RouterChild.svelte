<script lang="ts">
import { router } from './router.svelte';
</script>


{#if router.childComponent}
    <svelte:component 
        this={router.childComponent} 
    />
{/if}

