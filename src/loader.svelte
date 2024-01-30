<script lang="ts">
export let relative = false;

const loaderClasses =
        'loader bg-purple-500 transition-all';
const additionalClasses = relative ? 'relative' : 'absolute w-full h-1 top-0 left-0 scale-x-0';
</script>

<div class="{loaderClasses} {additionalClasses} {$$props.class || ''}"></div>

<style scoped>
.loader {
    transform-origin: 0;
    animation: scale-x-up 1s ease-in-out forwards;
}

@keyframes scale-x-up {
    0% {
        transform: scaleX(0);
    }
    25% {
        transform: scaleX(0.23);
    } 
    50% {
        transform: scaleX(0.46);
    }
    75% {
        transform: scaleX(0.69);
    }
    100% {
        transform: scaleX(0.92);
    }
}
</style>
