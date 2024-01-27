import type { Route } from './router.svelte';

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
    },
    {
        path: '/spa',
        component: () => import('./App3.svelte'),
        isSpa: true,
        isSsr: false,
    },
    {
        path: '/spa1',
        component: () => import('./App4.svelte'),
        isSpa: true,
        isSsr: false,
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
        props: (route: Route) => {
            return {
                id: route.params.id,
                test: 123,
            };
        },
    },
];
