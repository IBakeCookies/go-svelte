import { type Writable, writable } from "svelte/store";
import { setContext, getContext } from "svelte";

export interface RouterContext {
  path: Writable<string>;
  component: Writable<any>;
}

export const path = writable("");
export const component = writable();

export function createRouterContext(): void {
  setContext<RouterContext>("router", {
    path,
    component,
  });
}

export function getRouterContext(): RouterContext {
  return getContext<RouterContext>("router");
}
