import type { SvelteComponent } from 'svelte';
import { newRoutes } from './routes.ts';
import { routerState } from './routerState.svelte';

interface RouteShared {
    path: string;
    component: () => Promise<any>;
    props?: (route: RouteEnhanced) => Record<string, unknown>;
    beforeEnter?: (route: RouteEnhanced) => Promise<void>;
    group?: {
        names: Set<string>;
    };
}

export interface Route extends RouteShared {
    isSpa?: boolean;
    isSsr?: boolean;
    children?: Route[];
}

export interface RouteEnhanced extends RouteShared {
    isSpa: boolean;
    isSsr: boolean;
    params?: Record<string, unknown>;
    children?: RouteEnhanced[];
}

export interface RouterState {
    path: string;
    component: null | SvelteComponent;
    childComponent: null | SvelteComponent;
    currentRoute: null | RouteEnhanced;
    enteredGroupNames: Set<string>;
    isMounted: boolean;
}

const isServer = import.meta.env.SSR;

function wait(milliseconds: number = 0): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), milliseconds);
    });
}

class Router {
    public routes: RouteEnhanced[];
    public state: RouterState;
    private _path = $state('');
    public matches = $state([]);

    constructor(routes: Readonly<Route[]>) {
        // this.routes = routes.map(this.createEnhancedRoute)
        this.routes = routes;
        this.state = this.createState();
        // this.path = path;
        this.matches = this.matches;

        !isServer && this.addWindowListeners();
    }

    private createState(): RouterState {
        const state = $state<RouterState>({
            path: '',
            component: null,
            childComponent: null,
            currentRoute: null,
            enteredGroupNames: new Set(''),
            isMounted: false,
        });

        return state;
    }

    private createEnhancedRoute(route: Route): RouteEnhanced {
        return {
            isSpa: true,
            isSsr: true,
            ...route,
        };
    }

    public findRoutes(routes: Route[], targetPath: string, parentPath = ''): Route[] {
        return routes.reduce((matchingRoutes, route) => {
            const fullPath = parentPath + route.path;

            if (fullPath === targetPath) {
                matchingRoutes.push(route);
            }

            if (route.children) {
                const childMatches = this.findRoutes(route.children, targetPath, fullPath + '/');
                matchingRoutes.push(...childMatches);
            }

            return matchingRoutes;
        }, [] as Route[]);
    }

    public findRoute(path: string): RouteEnhanced | void {
        return this.routes;
        // for (const route of this.routes) {
        //     const routeParts = route.path.split('/');
        //     const pathParts = path.split('/');

        //     if (routeParts.length !== pathParts.length) {
        //         continue;
        //     }

        //     let params: Record<string, unknown> = {};
        //     let isMatch = true;

        //     for (let i = 0; i < routeParts.length; i++) {
        //         if (routeParts[i].startsWith(':')) {
        //             params[routeParts[i].substring(1)] = pathParts[i];
        //         } else if (routeParts[i] !== pathParts[i]) {
        //             isMatch = false;
        //             break;
        //         }
        //     }

        //     if (isMatch) {
        //         if (Object.keys(params).length) {
        //             return {
        //                 ...route,
        //                 params,
        //             };
        //         }

        //         return route;
        //     }
        // }
    }

    private async importComponent(route: Route): Promise<SvelteComponent> {
        if (typeof route.component === 'function') {
            const module = await route.component();

            return module.default;
        }

        return route.component;
    }

    private async importChildrenComponents(currentRoute: RouteEnhanced) {
        if (currentRoute.children) {
            for (let child of currentRoute.children) {
                if (child.path === '') {
                    const module = await child.component();

                    this.state.childComponent = module.default;
                }
            }

            return;
        }

        this.state.childComponent = null;
    }

    private addWindowListeners() {
        this.listenToPopState();
    }

    private listenToPopState() {
        window.addEventListener('popstate', async (e: PopStateEvent) => {
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

            return this.push(location.pathname);
        });
    }

    private hydrateEnteredGroupNames(targetRoute: RouteEnhanced) {
        targetRoute.group?.names &&
            targetRoute.group.names.forEach((name) => {
                this.state.enteredGroupNames.add(name);
            });
    }

    private async pushServer(targetRoute: RouteEnhanced): Promise<void> {
        // if (!targetRoute.isSsr) {
        //     // avoid data leak
        //     this.state = this.createState();
        //     return;
        // }
        // const promises = [targetRoute.component.load];
        // targetRoute.children.forEach((c) => {
        //     if (c.path === '') {
        //         promises.push(c.component.load);
        //     }
        // });
        // const resolved = await Promise.all(promises.map((p) => p()));
        // routerState.children[0].component.default = resolved[0].default;
        // routerState.children[0].children[0].component.default = resolved[1].default;
        // const component = await targetRoute.component.load();
        // const module = component.default;
        // routerState
        // await this.importChildrenComponents(targetRoute);
        // const component = await this.importComponent(targetRoute);
        // this.state.component = component;
        // this.state.currentRoute = targetRoute;
    }

    private async pushClient(path: string, targetRoute: RouteEnhanced): Promise<void> {
        const currentRoute = this.findRoute(window.location.pathname);

        if (!currentRoute) {
            return;
        }

        if (currentRoute.path === path) {
            if (this.state.isMounted) {
                return;
            }

            if (targetRoute.beforeEnter) {
                await targetRoute.beforeEnter(targetRoute);
            }

            await wait(250);
            await this.importChildrenComponents(targetRoute);

            const component = await this.importComponent(targetRoute);

            this.state.component = component;
            this.state.currentRoute = targetRoute;
            this.state.isMounted = true;

            this.hydrateEnteredGroupNames(targetRoute);

            return;
        }

        if (!targetRoute.isSpa) {
            window.location.href = path;

            return;
        }

        if (targetRoute.group) {
            const withinGroup = [...targetRoute.group.names].every((name) => {
                return this.state.enteredGroupNames.has(name);
            });

            if (!withinGroup) {
                window.location.href = path;

                return;
            }
        }

        targetRoute.beforeEnter && (await targetRoute.beforeEnter(targetRoute));

        this.state.isMounted = false;

        await wait(250);
        await this.importChildrenComponents(targetRoute);

        const component = await this.importComponent(targetRoute);

        this.state.component = component;
        this.state.isMounted = true;
        this.state.path = path;
        this.state.currentRoute = targetRoute;

        this.hydrateEnteredGroupNames(targetRoute);

        window.history.pushState({}, '', path);
    }

    public getRoute(path: string) {
        const matches = [];

        if (!this.routes?.children) {
            return matches;
        }

        const stack = [this.routes];

        while (stack.length > 0) {
            const current = stack.pop();
            if (current.children) {
                for (let child of current.children) {
                    stack.push(child);

                    if (child.fullPath === path) {
                        matches.push(child);
                    }
                }
            }
        }

        if (matches.length) {
            let parent = matches[0].parent;

            while (parent.path) {
                matches.unshift(parent);
                parent = parent.parent;
            }
        }

        return matches;
    }

    public get path() {
        return this._path;
    }

    public set path(value: string) {
        this._path = value;
    }

    public async push(path: string): Promise<void> {
        this.matches = [];
        // this.path = '';
        // const targetRoute = this.findRoute(path);

        // console.log(targetRoute[0]);

        // if (!targetRoute) {
        //     throw new Error(`Route ${path} not found`);
        // }

        // if (isServer) {
        //     return this.pushServer(targetRoute[0]);
        // }

        // return this.pushClient(path, targetRoute);

        const target = this.getRoute(path);

        console.log('target', target);

        const promises = [];

        target.forEach((route) => {
            promises.push(route.component.load);
        });

        const results = await Promise.all(promises.map((p) => p()));

        this.matches = target.reduce((result, curr, i) => {
            result[curr.path || `${curr.parent.path}-index`] = curr;
            curr.component.default = results[i].default;

            return result;
        }, {});

        this.path = path;

        !isServer && window.history.pushState({}, '', path);

        console.log('this.state.matches', this.matches);

        console.log('end push', this);
    }
}

export const router = new Router(newRoutes);
