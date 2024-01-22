<script lang="ts">
  // import { onMount } from 'svelte';

  let href = '';

  let currentComponent;

  async function preventer(event) {
      event.preventDefault();
      history.pushState({}, '', this.href);

      href = this.href;

      if(href === 'http://localhost:5173/spa1') {
        currentComponent = await import('./Page1.svelte').then(m => m.default);
      } else if(href === 'http://localhost:5173/spa2') {
        currentComponent = await import('./Page2.svelte').then(m => m.default);
      } else {
        currentComponent = await import('./Page.svelte').then(m => m.default);
      }
  }

// onMount(async () => {
//   if(href === 'http://localhost:5173/spa1') {
//     currentComponent = await import('./Page1.svelte').then(m => m.default);
//   } else if(href === 'http://localhost:5173/spa2') {
//     currentComponent = await import('./Page2.svelte').then(m => m.default);
//   } else {
//     currentComponent = await import('./Page.svelte').then(m => m.default);
//   }
// });
</script>

<a href="/">index</a>
<a href="/spa" on:click={preventer}>spa</a>
<a href="/spa1" on:click={preventer}>spa1</a>
<a href="/spa2" on:click={preventer}>spa2</a>

<!-- basically on SSR we render slot and then we render stuff based on click -->
{#if currentComponent}
  <svelte:component this={currentComponent} />
{:else}
  <slot></slot>
{/if}
