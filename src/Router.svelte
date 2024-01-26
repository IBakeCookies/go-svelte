<script lang="ts">
import { type Context, createSharedContext }  from './sharedContext.svelte';
import { router } from './router.svelte';

export let ctx: Context = {} as Context;

// let { ctx } = $props<Context>(); 

const { path, component, isLoadingComponent } = router;

createSharedContext(ctx.data);

path.set(ctx.path)

if(typeof window !== 'undefined') {
    console.log('[router enter]', { router })
}

let relative = false;

const loaderClasses =
		'p-10 text-primary z-100 flex items-center justify-center  bg-white opacity-10 transition-opacity';
const additionalClasses = relative ? 'relative' : 'absolute w-full h-full top-0 left-0';
</script>

{#if $isLoadingComponent}
    <div class="{loaderClasses} {additionalClasses} {$$props.class || ''}">
        LOADING
    </div>
{/if}

{#if $component}
    <svelte:component this={$component} />
{/if}
