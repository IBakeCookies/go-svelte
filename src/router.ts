import { routes } from "./routes";
import { routerStore } from "./routerStore";

interface Route {
  path: string;
  component: () => Promise<any>;
  isSpa: boolean;
  isSsr: boolean;
  props?: any;
}

export function createRouter(routes: Route[]) {
  const { component } = routerStore;

  async function push(path: string) {
    const targetRoute = routes.find((route) => route.path === path);

    if (!targetRoute) {
      throw new Error(`Route ${path} not found`);
    }

    if (typeof window !== "undefined") {
      const currentRoute = routes.find(
        (route) => route.path === window.location.pathname
      );

      if (currentRoute?.path === targetRoute.path) {
        if (typeof targetRoute.component === "function") {
          const module = await targetRoute.component();

          component.set(module.default);
        }

        return;
      }

      if (!targetRoute.isSpa) {
        window.location.href = path;
        return;
      }

      window.history.pushState({}, "", path);
    }

    if (typeof targetRoute.component === "function") {
      const module = await targetRoute.component();

      component.set(module.default);
    }
  }

  return {
    push,
  };
}

export const router = createRouter(routes);
