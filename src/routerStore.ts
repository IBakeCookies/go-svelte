import { writable } from "svelte/store";
import { setContext } from "svelte";

export const path = writable("");
export const component = writable();

export function createRouterContext() {
  setContext("router", {
    path,
    component,
  });
}
