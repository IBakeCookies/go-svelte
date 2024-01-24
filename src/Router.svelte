<script lang="ts">
import { routerStore } from './routerStore';

export let path = '';
export let routes = [];
export let component;
export let ssrData = {};

const { 
    path: routerPath,
    component: routerComponent,
 } = routerStore;

routerStore.path.set(path);
routerStore.component.set(component);
routerStore.routes.set(routes);

$: currentRoute = routes.find((route) => route.path === $routerPath);

$: {
    (async () =>{
        if(!currentRoute) {
            return;
        }

        if(typeof currentRoute.component === 'function') {
            const module = await currentRoute.component();
            component = module.default;
            routerStore.component.set(component);

            return;
        } 

        component = currentRoute.component
        routerStore.component.set(component);      
    })()
}

</script>

{#if $routerComponent}
    {#key $routerPath}
        <svelte:component this={$routerComponent} {ssrData} routeProps={currentRoute.props} />
    {/key}
{/if}
