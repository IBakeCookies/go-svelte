<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/Counter.svelte'
  import Nav from './nav.svelte'

  export let a = '';
  export let ssrData = {};
  export let routeProps = {};
</script>

<Nav/>


Route props {routeProps.test}

<main>
  <div>a: { a }</div>
  <div>{ssrData.random}</div>

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