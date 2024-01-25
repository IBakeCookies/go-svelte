<script lang="ts">
import { routerStore } from './routerStore';

export let path = '';
export let routes = [];
export let component;
export let ssrData = {};
export let preload = {};

const { 
    path: routerPath,
    component: routerComponent,
 } = routerStore;

routerStore.path.set(path);
routerStore.component.set(component);
routerStore.routes.set(routes);

$: currentRoute = routes.find((route) => route.path === $routerPath);

// $: {
//     (async() => {
//         const preloadData = currentRoute?.preload && (await currentRoute?.preload());
//         preload = preloadData;
//     })();
// }

$: {
    (async () =>{
        if(!currentRoute) {
            return;
        }

        if(typeof currentRoute.component === 'function') {
            const module = await currentRoute.component();
            component = module.default;
            // causes infinite loop?????
            // routerStore.component.set(component);

            return;
        } 

        component = currentRoute.component
        // routerStore.component.set(component);      
    })()
}

</script>


<svelte:component this={component} {ssrData} {preload} routeProps={currentRoute.props} />
