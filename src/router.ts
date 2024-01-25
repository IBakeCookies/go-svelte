import { routes } from "./routes";
import { routerComponentStore } from "./routerStore";

interface Route {
  path: string;
  component: () => Promise<any>;
  isSpa: boolean;
  isSsr: boolean;
  props?: any;
}

export function createRouter(routes: Route[]) {
  const isServer = typeof window === "undefined";

  if (!isServer) {
    addEventListener("popstate", async function (e: PopStateEvent) {
      const target = e.currentTarget;

      if (!target) {
        return;
      }

      const location = target.location;

      if (!location) {
        return;
      }

      e.preventDefault();

      await push(location.pathname);
    });
  }

  async function push(path: string) {
    const targetRoute = routes.find((route) => route.path === path);

    if (!targetRoute) {
      throw new Error(`Route ${path} not found`);
    }

    if (isServer && targetRoute.isSsr) {
      if (typeof targetRoute.component === "function") {
        const module = await targetRoute.component();

        routerComponentStore.set(module.default);
      }

      return;
    }

    if (!isServer) {
      const currentRoute = routes.find(
        (route) => route.path === window.location.pathname
      );

      if (currentRoute?.path === targetRoute.path) {
        if (typeof targetRoute.component === "function") {
          const module = await targetRoute.component();

          routerComponentStore.set(module.default);
        }

        return;
      }

      if (!targetRoute.isSpa) {
        window.location.href = path;
        return;
      }

      window.history.pushState({}, "", path);

      if (typeof targetRoute.component === "function") {
        const module = await targetRoute.component();

        routerComponentStore.set(module.default);
      }
    }
  }

  return {
    routes,
    push,
  };
}

export const router = createRouter(routes);
