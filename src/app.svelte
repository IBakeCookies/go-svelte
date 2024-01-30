<script lang="ts">
import './global.css';
import Router from './Router.svelte';
import { type Context, createSharedContext }  from './sharedContext.svelte';
import { router } from './router.svelte';

let { ctx } = $props<{ 
    ctx: Context; 
}>();

createSharedContext(ctx.data);

// @todo move into a hydrator function?
router.state.path = ctx.path;
</script>
    
<Router />