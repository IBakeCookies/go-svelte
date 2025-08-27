import type { SvelteComponent } from 'svelte';
import { routes } from './routes.ts';

interface RouteRoot {
    children: Route[];
}

interface RouteShared {
    path: string;
    component: () => Promise<any>;
    props?: (route: RouteEnhanced) => Record<string, unknown>;
    beforeEnter?: (route: RouteEnhanced) => Promise<void>;
    group?: {
        names: Set<string>;
    };
    fullPath?: string;
}

export interface Route extends RouteShared {
    isSpa?: boolean;
    isSsr?: boolean;
    children?: Route[];
}

export interface RouteEnhanced extends RouteShared {
    isSpa: boolean;
    isSsr: boolean;
    fullPath: string;
    params?: Record<string, unknown>;
    children?: RouteEnhanced[];
    parent: RouteEnhanced;
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

function getParentPath(childPath: string, parentPath?: string): string {
    if (!parentPath) {
        return '/';
    }

    const parentSplitted = parentPath.split('/');
    const childSplitted = childPath.split('/');

    if (childPath === '') {
        return parentPath;
    }

    if (childSplitted[0] === '' && parentPath.length > 1) {
        return childPath;
    }

    if (parentSplitted[0] !== '/' && parentPath.length > 1) {
        return `${parentPath}/${childPath}`;
    }

    return `${parentPath}${childPath}`;
}

function createFullPath(routes: Record<string, Route[]>, parentRoute?: RouteEnhanced) {
    const enhancedRoutes: Record<string, RouteEnhanced[]> = { ...routes };

    if (!enhancedRoutes.children) {
        return;
    }

    enhancedRoutes.children.forEach((route) => {
        route.fullPath = getParentPath(route.path, parentRoute?.fullPath);
        route.parent = parentRoute;

        createFullPath(route, route);
    });

    return enhancedRoutes;
}

class Router {
    public routes: RouteEnhanced[];
    private _path = $state('');
    private _matches: RouteEnhanced[] = $state([]);

    constructor(routes: Readonly<Route[]>) {
        // this.routes = routes.map(this.createEnhancedRoute);
        this.routes = createFullPath(routes);

        !isServer && this.addWindowListeners();
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

    private async importComponent(route: Route): Promise<SvelteComponent> {}

    private async importChildrenComponents(currentRoute: RouteEnhanced) {}

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

    public get matches() {
        return this._matches;
    }

    public set matches(value: RouteEnhanced[]) {
        this._matches = value;
    }

    private async importRouteComponents(targetRoute: RouteEnhanced) {
        const promises = [];
        const names = [];

        targetRoute.forEach((route) => {
            Object.keys(route.components).forEach((key) => {
                promises.push(route.components[key].load);
                names.push(key);
            });
        });

        const results = await Promise.all(promises.map((p) => p()));

        return {
            results,
            names,
        };
    }

    public async push(path: string): Promise<void> {
        this._matches = [];
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

        const { results, names } = await this.importRouteComponents(target);

        results.forEach((result) => {
            console.log('dynamic import for component', result.default.name);
        });

        console.log({ target, results, names });

        this._matches = target.reduce((result, curr, i) => {
            result[curr.name || curr.path] = curr;

            Object.keys(curr.components).forEach((key) => {
                const index = names.indexOf(key);

                curr.components[key].component = results[index].default;

                names.splice(index, 1);
                results.splice(index, 1);
            });

            return result;
        }, {});

        this.path = path;

        !isServer && window.history.pushState({}, '', path);
    }
}

export const router = new Router(routes);
