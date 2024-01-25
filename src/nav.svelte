<script lang="ts">
  import { router } from './router';
  
  function push(event) {
    event.preventDefault();

    const href = this.getAttribute('href');

    router.push(href);
  }
</script>

<!-- <h1>You are on {$path}</h1> -->

<div><a href='/' on:click={push}>home</a></div>
<div><a href='/about' on:click={push}>about</a></div>
<div><a href='/spa' on:click={push}>spa</a></div>
<div><a href='/spa1' on:click={push}>spa1</a></div>
<div><a href='/ssr' on:click={push}>ssr</a></div>
