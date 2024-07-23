<script lang="ts">
let { id, test } = $props<{ 
    id: string
    test: string
}>();

console.log('[route props]', id , test);
</script>
    
<div>SLUG</div>
<div>id: {id}</div>
<div>test: {test}</div>
