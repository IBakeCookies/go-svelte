<script lang="ts">
import { router } from './router.svelte';

let { href, modifier, preload } = $props<{
    href: string
    modifier: string
    preload: boolean
}>();

function handleClick (this: HTMLElement, event: MouseEvent) {
    const href = this.getAttribute('href');

    if(!href || href === '#') {
        return;
    }

    event.preventDefault();

    router.push(href);
}

function handleMouseEnter(this: HTMLElement) {
    if(!preload) {
        return;
    }

    const href = this.getAttribute('href');

    if(!href || href === '#') {
        return;
    }

    const route = router.findRoute(href);

    route && route.component();
}
</script>


<a {href} class={modifier} on:click={handleClick} on:mouseenter={handleMouseEnter}>
    <slot></slot>
</a>