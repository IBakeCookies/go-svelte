<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/Counter.svelte'
  import Nav from './nav.svelte'
  import { getContext } from 'svelte';
  // export let routeProps = {};

  const { fullname } = getContext('shared');
</script>

<Nav/>

{$fullname}

<!-- <div>
  Route props {routeProps?.test}
</div> -->

<main>
  <!-- <div>{ctx.data.firstname}</div>
  <div>{ctx.data.lastname}</div> -->

  HOME
  
  <div class="card">
    <Counter />
  </div>

  <div>
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer"> 
      <img src="/vite.svg" class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer"> 
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
</main>