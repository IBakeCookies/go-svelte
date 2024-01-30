import { createRoot } from 'svelte';
import { router } from './router.svelte';
import App from './app.svelte';

async function mount() {
    const target = document.getElementById('app');

    if (!target) {
        throw new Error('App container not found');
    }

    await router.push(window.location.pathname);

    createRoot(App, {
        target,
        props: {
            ctx: window.__ctx__,
        },
    });

    // delete window.__ctx__;
}

mount();
