import { writable } from "svelte/store";

// const createRouterStore = () => {
//   const path = writable("");
//   const params = writable({});
//   const query = writable({});
//   const hash = writable("");
//   const fullPath = writable("");
//   const name = writable("");
//   const meta = writable({});
//   const matched = writable([]);
//   const redirectedFrom = writable("");

//   const routes = writable([]);

//   return {
//     path,
//     params,
//     query,
//     hash,
//     fullPath,
//     name,
//     meta,
//     matched,
//     redirectedFrom,
//     component,
//     routes,
//   };
// };

// export const routerStore = createRouterStore();

export const routerComponentStore = writable();
