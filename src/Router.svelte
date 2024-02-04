<script lang="ts">
import { router } from './router1.svelte';
// import Loader from './loader.svelte';
import { getContext, onDestroy, setContext } from 'svelte';
// import { routerState } from './routerState.svelte';


// const routeProps = $derived(
//     router.state.currentRoute &&
//     router.state.currentRoute.props && 
//     router.state.currentRoute.props(router.state.currentRoute)
// );

let { sidekick } = $props<{ sidekick: string }>();

const parentStore = getContext('router-store');

let childrenStore = $state({ state: { children: [] } });

setContext('router-store', childrenStore);

parentStore.state.children.forEach(route => {
    if(!route.children?.length) {
        return;
    }

    route.children.forEach(child => {
        childrenStore.state.children.push(child);
    });
})

let component = $state(null);

function hack () {
    parentStore.state.children.forEach((childRoute) => {
        const match = router.matches[childRoute.path || `${childRoute.parent.path}-index`];

        if(!match) {
            return;
        }

        component = match.component.default;
    })
}

hack();

$inspect(router.path, hack());
</script>

{#if component}
    <svelte:component this={component}>
    </svelte:component>
{/if}

<!-- {#if !router.state.isMounted && !isServer}
    <Loader />
{/if} -->

<!-- {#if router.state.component}
    <svelte:component 
        this={router.state.component} 
        {...routeProps}
    >
    </svelte:component>
{/if} -->
