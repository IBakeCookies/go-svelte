<script lang="ts">
import { router } from '../router1.svelte';

$effect(() => {
    setTimeout(() => {
        router.push('/about');
    }, 3000);
})
</script>

<h1>Home page</h1>
