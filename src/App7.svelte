<script lang="ts">
import Nav from './nav.svelte'

// add ability to pass props to route components
// export let routeProps = {};
// console.log(routeProps)

export let props = {};

console.log('[App] props', props);
</script>

<Nav/>
    
<div>SLUG</div>

{JSON.stringify(props)}