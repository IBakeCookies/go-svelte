<script lang="ts">
import svelteLogo from './assets/svelte.svg'
import { factStore } from './lib/fact.svelte.ts';
import { getSharedContext } from './sharedContext.svelte'
import Counter from './lib/Counter.svelte'
import Nav from './nav.svelte'
import Router from './Router.svelte';

const user = getSharedContext('user');
const fullname = $derived(`${user?.firstname} ${user?.lastname}`);

$effect(() => {
    if(!user) {
        return;
    }

    user.firstname = 'JANE';
});

</script>



<Nav/>

<main>
    <h2>{factStore.fact}</h2>

    {fullname}

    <div class="card">
        <Counter />
    </div>

    <div>
        <!-- <a href="https://vitejs.dev" target="_blank" rel="noreferrer"> 
            <img src="/assets/vite.svg" class="logo" alt="Vite Logo" />
        </a> -->

        <a href="https://svelte.dev" target="_blank" rel="noreferrer"> 
            <img src={svelteLogo} alt="Svelte Logo" />
        </a>
    </div>
</main>


<Router />