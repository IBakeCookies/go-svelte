import { routes } from './routes';
import type { SvelteComponent } from 'svelte';

export interface Route {
    path: string;
    component: () => Promise<any>;
    isSpa: boolean;
    isSsr: boolean;
    props?: any;
    beforeEnter?: () => Promise<void>;
    group?: {
        names: Set<string>;
    };
}

export interface RouteEnhanced extends Route {
    params: Record<string, string>;
}

function createEnhancedRoute(route: Route): RouteEnhanced {
    return {
        ...route,
        params: {},
    };
}

const isServer = import.meta.env.SSR;

function wait(milliseconds: number = 0): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), milliseconds);
    });
}

interface RouterState {
    path: string;
    push: (path: string) => Promise<void>;
    routes: Route[];
    component: null | SvelteComponent;
    isLoadingComponent: boolean;
    currentRoute: null | Route;
    enteredGroupNames: Set<string>;
}

// @todo review code from copilot
function findRouteAndExtractParams(routes: Route[], path: string): RouteEnhanced | void {
    for (const route of routes) {
        const routeParts = route.path.split('/');
        const pathParts = path.split('/');

        if (routeParts.length !== pathParts.length) {
            continue;
        }

        let params = {};
        let isMatch = true;

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                params[routeParts[i].substring(1)] = pathParts[i];
            } else if (routeParts[i] !== pathParts[i]) {
                isMatch = false;
                break;
            }
        }

        if (isMatch) {
            return {
                params,
                ...route,
            };
        }
    }
}

async function listenToPopState(push: RouterState['push']) {
    window.addEventListener('popstate', async function (e: PopStateEvent) {
        const target = e.currentTarget;

        if (!target) {
            return;
        }

        // @ts-ignore
        const location = target.location;

        if (!location) {
            return;
        }

        e.preventDefault();

        return push(location.pathname);
    });
}

async function importComponent(route: Route): Promise<SvelteComponent> {
    if (typeof route.component === 'function') {
        const module = await route.component();

        return module.default;
    }

    return route.component;
}

export function createRouter(routes: RouteEnhanced[]): RouterState {
    !isServer && listenToPopState(push);

    const state = $state<RouterState>({
        routes,
        push,
        path: '',
        component: null,
        childComponent: null,
        isLoadingComponent: false,
        currentRoute: null,
        enteredGroupNames: new Set(''),
    });

    function hydrateEnteredGroupNames(targetRoute: RouteEnhanced) {
        targetRoute.group?.names &&
            targetRoute.group.names.forEach((name) => {
                state.enteredGroupNames.add(name);
            });
    }

    async function push(path: string) {
        const targetRoute = findRouteAndExtractParams(routes, path);

        if (!targetRoute) {
            throw new Error(`Route ${path} not found`);
        }

        state.currentRoute = targetRoute;

        if (isServer) {
            if (!targetRoute.isSsr) {
                // avoid data leak
                state.component = null;

                return;
            }

            const component = await importComponent(targetRoute);

            // if (targetRoute.children) {
            //     for (let child of targetRoute.children) {
            //         if (child.path === '/') {
            //             const module = await child.component();
            //             state.childComponent = module.default;
            //         }
            //     }
            // }

            state.component = component;

            return;
        }

        const currentRoute = findRouteAndExtractParams(routes, window.location.pathname);

        if (!currentRoute) {
            return;
        }

        if (currentRoute.path === path) {
            targetRoute.beforeEnter && (await targetRoute.beforeEnter());

            await wait(250);

            const component = await importComponent(targetRoute);

            // if (currentRoute.children) {
            //     for (let child of currentRoute.children) {
            //         if (child.path === '/') {
            //             const module = await child.component();
            //             state.childComponent = module.default;
            //         }
            //     }
            // }

            state.component = component;

            hydrateEnteredGroupNames(targetRoute);

            return;
        }

        if (!targetRoute.isSpa) {
            window.location.href = path;

            return;
        }

        if (targetRoute.group) {
            const withinGroup = [...targetRoute.group.names].every((name) => {
                return state.enteredGroupNames.has(name);
            });

            if (!withinGroup) {
                window.location.href = path;

                return;
            }
        }

        state.isLoadingComponent = true;

        targetRoute.beforeEnter && (await targetRoute.beforeEnter());

        await wait(250);

        const component = await importComponent(targetRoute);

        state.component = component;
        state.isLoadingComponent = false;
        state.path = path;

        hydrateEnteredGroupNames(targetRoute);

        window.history.pushState({}, '', path);
    }

    return state;
}

const enhancedRoutes = routes.map(createEnhancedRoute);

export const router = createRouter(enhancedRoutes);
