import { routes } from './routes';
import type { SvelteComponent } from 'svelte';

export interface Route {
    path: string;
    component: () => Promise<any>;
    isSpa: boolean;
    isSsr: boolean;
    props?: any;
    beforeEnter?: () => Promise<void>;
}

interface RouteEnhanced extends Route {
    params?: Record<string, string>;
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

export function createRouter(routes: Route[]): RouterState {
    !isServer && listenToPopState(push);

    const state = $state<RouterState>({
        routes,
        push,
        path: '',
        component: null,
        isLoadingComponent: false,
        currentRoute: null,
    });

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

            state.component = component;

            return;
        }

        const currentRoute = findRouteAndExtractParams(routes, window.location.pathname);

        if (!currentRoute) {
            return;
        }

        // in pop case current and target will be the same but its wrong: fix it
        if (currentRoute.path === targetRoute.path) {
            state.isLoadingComponent = true;

            targetRoute.beforeEnter && (await targetRoute.beforeEnter());

            await wait(250);

            const component = await importComponent(targetRoute);

            state.component = component;
            state.isLoadingComponent = false;

            return;
        }

        if (!targetRoute.isSpa) {
            window.location.href = path;

            return;
        }

        state.isLoadingComponent = true;

        targetRoute.beforeEnter && (await targetRoute.beforeEnter());

        await wait(250);

        const component = await importComponent(targetRoute);

        state.component = component;
        state.isLoadingComponent = false;
        state.path = path;

        window.history.pushState({}, '', path);
    }

    return state;
}

export const router = createRouter(routes);
