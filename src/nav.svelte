<script lang="ts">
  import { routerStore } from './routerStore';

  const { path, routes } = routerStore;

  function push(event) {
    event.preventDefault();

    const href = this.getAttribute('href');
    const route = $routes.find((route) => route.path === href);

    if(!route?.isSpa) {
      window.location.href = href;
    }

    routerStore.path.set(href);
    window.history.pushState({}, '', href);
  }
</script>

<h1>You are on {$path}</h1>

<a href='/' on:click={push}>home</a>
<a href='/about' on:click={push}>about</a>
<a href='/spa' on:click={push}>spa</a>
<a href='/spa1' on:click={push}>spa1</a>
<a href='/ssr' on:click={push}>ssr</a>
