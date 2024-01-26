<script lang="ts">
  import { getSharedContext } from './sharedContext.svelte'
  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/Counter.svelte'
  import Nav from './nav.svelte'
  
  // add ability to pass props to route components
  // export let routeProps = {};
  // console.log(routeProps)

  const { fullname } = getSharedContext('user');
</script>

<Nav/>

<main>
  <div>shared context: {$fullname}</div>

  <h2>HOME PAGE</h2>
  
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