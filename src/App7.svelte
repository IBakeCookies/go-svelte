<script lang="ts">
import Nav from './nav.svelte'

let { id, test } = $props<{ 
    id: string
    test: string
}>();

console.log('[route props]', id , test);
</script>

<Nav/>
    
<div>SLUG</div>
<div>id: {id}</div>
<div>test: {test}</div>
