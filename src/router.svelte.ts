import { routes } from './routes';
import { type Writable, writable } from 'svelte/store';

interface Route {
    path: string;
    component: () => Promise<any>;
    isSpa: boolean;
    isSsr: boolean;
    props?: any;
}

function wait(milliseconds: number = 0): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), milliseconds);
    });
}

interface Router {
    path: Writable<string>;
    push: (path: string) => Promise<void>;
    pushSsr: (path: string) => Promise<void>;
    routes: Route[];
    component: Writable<any>;
    isLoadingComponent: Writable<boolean>;
}

export function createRouter(routes: Route[]): Router {
    const isServer = typeof window === 'undefined';

    async function listenToPopState() {
        addEventListener('popstate', async function (e: PopStateEvent) {
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

    if (!isServer) {
        listenToPopState();
    }

    let pathStore = writable('');
    let componentStore = writable(null);
    let isLoadingComponent = writable(false);

    async function importComponent(route: Route): Promise<void> {
        if (typeof route.component === 'function') {
            const module = await route.component();

            componentStore.set(module.default);

            return;
        }

        componentStore.set(route.component);
    }

    async function pushSsr(path: string) {
        const targetRoute = routes.find((route) => route.path === path);

        if (!targetRoute) {
            throw new Error(`Route ${path} not found`);
        }

        if (!targetRoute.isSsr) {
            // avoid data leak
            componentStore.set(null);

            return;
        }

        return importComponent(targetRoute);
    }

    async function push(path: string) {
        const targetRoute = routes.find((route) => route.path === path);

        if (!targetRoute) {
            throw new Error(`Route ${path} not found`);
        }

        // if (isServer) {
        //   if (!targetRoute.isSsr) {
        //     // avoid data leak
        //     componentStore.set(null);

        //     return;
        //   }

        //   return importComponent(targetRoute);
        // }

        const currentRoute = routes.find((route) => route.path === window.location.pathname);

        if (!currentRoute) {
            return;
        }

        // in pop case current and target will be the same but its wrong: fix it
        if (currentRoute.path === targetRoute.path) {
            isLoadingComponent.set(true);

            await wait(500);
            await importComponent(targetRoute);

            isLoadingComponent.set(false);

            return;
        }

        if (!targetRoute.isSpa) {
            window.location.href = path;

            return;
        }

        isLoadingComponent.set(true);

        await wait(500);
        await importComponent(targetRoute);

        isLoadingComponent.set(false);
        pathStore.set(path);

        window.history.pushState({}, '', path);
    }

    return {
        routes,
        push,
        pushSsr,
        path: pathStore,
        component: componentStore,
        isLoadingComponent,
    };
}

export const router = createRouter(routes);
