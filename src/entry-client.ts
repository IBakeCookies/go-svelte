import { createRoot } from 'svelte';
import { router } from './router.svelte';
import Router from './Router.svelte';

async function mount() {
    const target = document.getElementById('app');

    if (!target) {
        throw new Error('App container not found');
    }

    await router.push(window.location.pathname);

    createRoot(Router, {
        target,
        props: {
            ctx: window.__ctx__,
        },
    });

    delete window.__ctx__;
}

mount();
