import { type RouteEnhanced } from './router.svelte';

/*
    @isSsr - means that the route will be rendered on the server side
    @isSpa - means that the push method will do SPA side navigation
    @group - names of groups that are getting hydrated
*/

export const routes = {
    children: [
        {
            path: '/',
            name: 'layout',
            component: {
                load: () => import('./Layout.svelte'),
                default: null,
            },
            components: {
                default: {
                    load: () => import('./Layout.svelte'),
                    component: null,
                },
            },
            children: [
                {
                    name: 'home-index',
                    path: '',
                    component: {
                        load: () => import('./page/home.svelte'),
                        component: null,
                    },
                    components: {
                        default: {
                            load: () => import('./page/home.svelte'),
                            component: null,
                        },
                        test: {
                            load: () => import('./page/about.svelte'),
                            component: null,
                        },
                    },
                    children: [
                        {
                            path: 'home',
                            component: {
                                load: () => {},
                                component: null,
                            },
                        },
                        {
                            path: 'work',
                            component: {
                                load: () => {},
                                component: null,
                            },
                        },
                    ],
                },
                {
                    path: '/slug/:id',
                    component: {
                        load: () => import('./page/slug.svelte'),
                        default: null,
                    },
                    props: (route: RouteEnhanced) => {
                        return {
                            id: route.params?.id,
                            test: 123,
                        };
                    },
                    beforeEnter: async (route: RouteEnhanced) => {
                        console.log('[before enter slug page]', { route });
                    },
                    group: {
                        names: new Set('a'),
                    },
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
                            name: 'about-index',
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
