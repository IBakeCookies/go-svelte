<script lang="ts">
// import { router } from '../router1.svelte';
import { getSharedContext } from '../sharedContext.svelte.ts'

const user = getSharedContext('user');

$effect(() => {
    setTimeout(() => {
        // router.push('/about');

        if(!user) {
            return;
        }

        user.firstname = 'Jane';
    }, 1000);
})




</script>

<section class="bg-gray-700 p-4">
    <h2>home.svelte</h2>
    {user?.firstname} {user?.lastname}
</section>


