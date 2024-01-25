<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/Counter.svelte'
  import Nav from './nav.svelte'
  import { random } from "./ssrStore";

  export let a = '';
  export let routeProps = {};
</script>

<Nav/>

<div>
  Route props {routeProps?.test}
</div>

<main>
  <div>a: { a }</div>
  <div>{$random}</div>

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