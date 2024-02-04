<!-- <script lang="ts">
import { router } from './router.svelte';
import RouterLink from './RouterLink.svelte';
console.log('nav');
</script>

<h1>You are on {router.state.path}</h1>

<div class="flex justify-center py-4">
    <RouterLink modifier="text-white mx-2 px-4 py-2 rouded bg-gray-600" href="/">
        spa + ssr + group
    </RouterLink>

    <RouterLink modifier="text-white mx-2 px-4 py-2 rouded bg-gray-600" href="/about">
        spa + ssr 
    </RouterLink>

    <RouterLink modifier="text-white mx-2 px-4 py-2 rouded bg-gray-600" href="/spa" 
    preload>
        spa only
    </RouterLink>
    

    <RouterLink modifier="text-white mx-2 px-4 py-2 rouded bg-gray-600" href="/ssr">
        ssr only
    </RouterLink>
    
    <RouterLink modifier="text-white mx-2 px-4 py-2 rouded bg-gray-600" href="/slug/1">
        spa + ssr slug with id 1
    </RouterLink>
</div> -->