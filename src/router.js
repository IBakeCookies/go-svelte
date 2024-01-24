export const router = {
  routes: [
    {
      path: "/",
      component: () => import("./App.svelte"),
      isSpa: true,
      isSsr: true,
      props: {
        test: 123,
      },
    },
    {
      path: "/about",
      component: () => import("./App2.svelte"),
      isSpa: true,
      isSsr: true,
    },
    {
      path: "/spa",
      component: () => import("./App3.svelte"),
      isSpa: true,
      isSsr: true,
    },
    {
      path: "/spa1",
      component: () => import("./App4.svelte"),
      isSsr: false,
      isSpa: true,
    },
    {
      path: "/ssr",
      component: () => import("./App5.svelte"),
      isSsr: true,
      isSpa: false,
    },
  ],
};

export const entryMap = router.routes.reduce((result, route) => {
  result[route.path] = {
    component: route.component,
    isSsr: route.isSsr,
  };

  return result;
}, {});
