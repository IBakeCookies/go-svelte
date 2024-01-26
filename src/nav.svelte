<script lang="ts">
  import { router } from './router';
  import { getRouterContext } from './routerStore';

  const { path } = getRouterContext();

  function push(event) {
    event.preventDefault();

    const href = this.getAttribute('href');

    router.push(href);
  }
</script>

<h1>You are on {$path}</h1>

<div class="flex">
  <a href='/' on:click={push}>home</a>
  <a href='/about' on:click={push}>about</a>
  <a href='/spa' on:click={push}>spa</a>
  <a href='/spa1' on:click={push}>spa1</a>
  <a href='/ssr' on:click={push}>ssr</a>
  <a href='/ssr1' on:click={push}>ssr1</a>
</div>

<style>
  .flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>