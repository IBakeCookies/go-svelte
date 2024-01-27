<script lang="ts">
import { router } from './router.svelte';

function link(element: HTMLElement) {
    element.addEventListener('click', (event) => {

        const href = element.getAttribute('href');

        if(!href || href === '#') {
            return;
        }

        event.preventDefault();

        router.push(href);
    });
}
</script>

<h1>You are on {router.path}</h1>


<div class="flex justify-center py-4">
    <a class="text-white mx-2 px-4 py-2 rouded bg-gray-600" href='/' use:link>
        home
    </a>

    <a class="text-white mx-2 px-4 py-2 rouded bg-gray-600" href='/about' use:link>
        about
    </a>

    <a class="text-white mx-2 px-4 py-2 rouded bg-gray-600" href='/spa' use:link>
        spa
    </a>
    
    <a class="text-white mx-2 px-4 py-2 rouded bg-gray-600" href='/spa1' use:link>
        spa1
    </a>
    
    <a class="text-white mx-2 px-4 py-2 rouded bg-gray-600" href='/ssr' use:link>
        ssr
    </a>
    
    <a class="text-white mx-2 px-4 py-2 rouded bg-gray-600" href='/ssr1' use:link>
        ssr1
    </a>

    <a  class="text-white mx-2 px-4 py-2 rouded bg-gray-600" href='/slug/1' use:link>
        slug with id 1
    </a>
    
    <a  class="text-white mx-2 px-4 py-2 rouded bg-gray-600" href='/slug/2' use:link>
        slug with id 2
    </a>
</div>