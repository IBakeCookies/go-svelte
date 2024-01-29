import type { Route, RouteEnhanced } from './router.svelte';

/*
    @isSsr - means that the route will be rendered on the server side
    @isSpa - means that the push method will do SPA side navigation
    @group - names of groups that are getting hydrated
*/

export const routes = [
    {
        path: '/',
        component: () => import('./App.svelte'),
        isSpa: true,
        isSsr: true,
        beforeEnter: async () => {
            console.log('[before enter home page]');
        },
    },
    {
        path: '/about',
        component: () => import('./App2.svelte'),
        isSpa: true,
        isSsr: true,
        beforeEnter: async () => {
            console.log('[before enter about page]');
        },
        // children: [
        //     {
        //         path: '/',
        //         component: () => import('./lib/Counter.svelte'),
        //         isSpa: true,
        //         isSsr: true,
        //         beforeEnter: async () => {
        //             console.log('[before enter child page]');
        //         },
        //     },
        // ],
    },
    {
        path: '/spa',
        component: () => import('./App3.svelte'),
        isSpa: true,
        isSsr: false,
        group: {
            names: new Set('a'),
        },
    },
    {
        path: '/spa1',
        component: () => import('./App4.svelte'),
        isSpa: true,
        isSsr: false,
        group: {
            names: new Set(['a', 'b']),
        },
    },
    {
        path: '/ssr',
        component: () => import('./App5.svelte'),
        isSpa: false,
        isSsr: true,
    },
    {
        path: '/ssr1',
        component: () => import('./App6.svelte'),
        isSpa: false,
        isSsr: true,
    },
    {
        path: '/slug/:id',
        component: () => import('./App7.svelte'),
        isSpa: true,
        isSsr: true,
        props: (route: RouteEnhanced) => {
            return {
                id: route.params?.id,
                test: 123,
            };
        },
    },
];
