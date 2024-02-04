import { type RouteEnhanced } from './router.svelte';
import { factStore } from './lib/fact.svelte.ts';

/*
    @isSsr - means that the route will be rendered on the server side
    @isSpa - means that the push method will do SPA side navigation
    @group - names of groups that are getting hydrated
*/

export const routes = [
    {
        path: '/',
        component: () => import('./App.svelte'),
        beforeEnter: async (route: RouteEnhanced) => {
            const response = await fetch('https://catfact.ninja/fact');
            const data = await response.json();

            factStore.fact = data.fact;

            console.log('[before enter home page]', { route });
        },
        group: {
            names: new Set('a'),
        },
    },
    {
        path: '/about',
        component: () => import('./App2.svelte'),
        beforeEnter: async (route: RouteEnhanced) => {
            console.log('[before enter about page]', { route });
        },
        // children: [
        //     {
        //         path: '',
        //         component: () => import('./page/about.svelte'),
        //         beforeEnter: async () => {
        //             console.log('[before enter about child page]');
        //         },
        //     },
        //     {
        //         path: 'spa',
        //         component: () => import('./page/spa.svelte'),
        //         beforeEnter: async () => {
        //             console.log('[before enter spa child page]');
        //         },
        //     },
        // ],
    },
    {
        path: '/spa',
        component: () => import('./App3.svelte'),
        isSsr: false,
    },
    {
        path: '/ssr',
        component: () => import('./App5.svelte'),
        isSpa: false,
    },
    {
        path: '/slug/:id',
        component: () => import('./App7.svelte'),
        props: (route: RouteEnhanced) => {
            return {
                id: route.params?.id,
                test: 123,
            };
        },
        beforeEnter: async (route: RouteEnhanced) => {
            console.log('[before enter slug page]', { route });
        },
    },
];

export const newRoutes = {
    children: [
        {
            path: '/',
            name: 'anyName',
            component: {
                load: () => import('./Layout.svelte'),
                default: null,
            },
            children: [
                {
                    path: '',
                    component: {
                        load: () => import('./page/home.svelte'),
                        default: null,
                    },
                    children: [
                        {
                            path: 'home',
                            component: {
                                load: () => {},
                                default: null,
                            },
                        },
                        {
                            path: 'work',
                            component: {
                                load: () => {},
                                default: null,
                            },
                        },
                    ],
                },
                {
                    path: 'about',
                    component: {
                        load: () => import('./page/about.svelte'),
                        default: null,
                    },
                    children: [
                        {
                            path: '',
                            component: {
                                load: () => import('./page/ssr.svelte'),
                                default: null,
                            },
                            children: [
                                {
                                    path: '',
                                    component: {
                                        load: () => import('./page/home.svelte'),
                                        default: null,
                                    },
                                },
                            ],
                        },
                        {
                            path: '/root',
                            component: {
                                load: () => {},
                                default: null,
                            },
                            children: [
                                {
                                    path: '/id/asd',
                                    component: {
                                        load: () => {},
                                        default: null,
                                    },
                                },
                                {
                                    path: '/root2',
                                    component: {
                                        load: () => {},
                                        default: null,
                                    },
                                },
                            ],
                        },
                        {
                            path: 'us',
                            component: {
                                load: () => import('./page/about-child.svelte'),
                                default: null,
                            },
                        },
                    ],
                },
                {
                    path: 'whatever',
                    component: {
                        load: () => {},
                        default: null,
                    },
                },
            ],
        },
    ],
};
