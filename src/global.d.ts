import type { Context } from './sharedContext.svelte';

interface Window {
    __ctx__: Context;
}
