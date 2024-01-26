<script lang="ts">
export let relative = false;

const loaderClasses =
        'p-10 text-primary z-100 flex items-center justify-center  bg-white opacity-10 transition-opacity';
const additionalClasses = relative ? 'relative' : 'absolute w-full h-full top-0 left-0';
</script>

<div class="{loaderClasses} {additionalClasses} {$$props.class || ''}"></div>
