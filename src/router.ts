import { routes } from "./routes";
import { component, path as routerPath } from "./routerStore";

interface Route {
  path: string;
  component: () => Promise<any>;
  isSpa: boolean;
  isSsr: boolean;
  props?: any;
}

async function importComponent(route: Route): Promise<void> {
  if (typeof route.component === "function") {
    const module = await route.component();
    component.set(module.default);
  }
}

export function createRouter(routes: Route[]) {
  const isServer = typeof window === "undefined";

  function listenToPopState() {
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

  if (!isServer) {
    listenToPopState();
  }

  async function push(path: string) {
    const targetRoute = routes.find((route) => route.path === path);

    if (!targetRoute) {
      throw new Error(`Route ${path} not found`);
    }

    if (isServer) {
      if (!targetRoute.isSsr) {
        // avoid data leak
        component.set(null);

        return;
      }

      return importComponent(targetRoute);
    }

    const currentRoute = routes.find(
      (route) => route.path === window.location.pathname
    );

    if (!currentRoute) {
      return;
    }

    // in pop case current and target will be the same but its wrong: fix it
    if (currentRoute.path === targetRoute.path) {
      return importComponent(targetRoute);
    }

    if (!targetRoute.isSpa) {
      window.location.href = path;

      return;
    }

    window.history.pushState({}, "", path);

    routerPath.set(path);

    return importComponent(targetRoute);
  }

  return {
    routes,
    push,
  };
}

export const router = createRouter(routes);
