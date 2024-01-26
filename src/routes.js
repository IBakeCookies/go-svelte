export const routes = [
  {
    path: "/",
    component: () => import("./App.svelte"),
    isSpa: true,
    isSsr: true,
    props: {
      test: 123,
    },
    // preload: async () => {
    //   const res = await fetch("https://catfact.ninja/fact");
    //   const data = await res.json();

    //   return data;
    // },
    // guard: (ssrData) => {
    //   if (ssrData.random > 50) {
    //     return true;
    //   }

    //   return false;
    // },
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
    isSsr: false,
  },
  {
    path: "/spa1",
    component: () => import("./App4.svelte"),
    isSpa: true,
    isSsr: false,
  },
  {
    path: "/ssr",
    component: () => import("./App5.svelte"),
    isSpa: false,
    isSsr: true,
  },
  {
    path: "/ssr1",
    component: () => import("./App6.svelte"),
    isSpa: false,
    isSsr: true,
  },
];
