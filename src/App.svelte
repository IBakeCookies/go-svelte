<script lang="ts">
import svelteLogo from './assets/svelte.svg'
import Counter from './lib/Counter.svelte'
import Nav from './nav.svelte'

let fact = $state('');

// $effect(async () => {
//     const response = await fetch('https://catfact.ninja/fact');
//     const data = await response.json();

//     fact = data.fact;
// });

</script>

<Nav/>

<main>
    {fact}

    <h2>HOME PAGE</h2>

    <div class="card">
        <Counter />
    </div>

    <div>
        <!-- <a href="https://vitejs.dev" target="_blank" rel="noreferrer"> 
            <img src="/assets/vite.svg" class="logo" alt="Vite Logo" />
        </a> -->

        <a href="https://svelte.dev" target="_blank" rel="noreferrer"> 
            <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
        </a>
    </div>
</main>
