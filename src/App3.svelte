<script>
import Nav from './nav.svelte'
import { getSharedContext } from './sharedContext.svelte'

const user = getSharedContext('user');
const fullname = $derived(`${user?.firstname} ${user?.lastname}`);

setTimeout(() => {
    if(!user) {
        return;
    }

    user.firstname = 'JANE';

    console.log(user);
}, 1000);
</script>

<Nav/>

<div>SPA</div>
<div>shared context: {fullname}</div>