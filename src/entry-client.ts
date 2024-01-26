import { createRoot } from 'svelte';
import { router, extractSlug, findRoute } from './router.svelte';
import Router from './Router.svelte';

async function mount() {
    await router.push(window.location.pathname);

    // const slugValue = extractSlug(window.location.pathname);

    // const route = findRoute(router.routes, window.location.pathname);

    // route.params = {
    //     id: slugValue,
    // };

    createRoot(Router, {
        target: document.getElementById('app'),
        hydrate: true,
        props: {
            ctx: window.__ctx__,
            // props: route?.props && route.props(route),
        },
    });
}

mount();
