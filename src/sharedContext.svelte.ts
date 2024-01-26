import { setContext, getContext } from "svelte";
import { type Writable, type Readable, writable, derived } from "svelte/store";

export interface Context {
  data: {
    user: User;
  };

  path: string;
}

interface User {
  firstname: string;
  lastname: string;
}

type UserKey = keyof User;

export interface SharedContextState {
  user: {
    [K in UserKey]: Writable<User[K]>;
  } & { fullname: Readable<string> };
}

type SharedContextKey = keyof SharedContextState;

export function createSharedContext(data: Context["data"]): void {
  const firstname = writable(data.user.firstname);
  const lastname = writable(data.user.lastname);
  const fullname = derived([firstname, lastname], ([$firstname, $lastname]) => {
    return `${$firstname} ${$lastname}`;
  });

  // const state = $state({
  //   firstname: ctx.firstname,
  //   lastname: ctx.lastname,
  //   a: 1,
  //   b: 3,
  //   get fullname() {
  //     console.log(111);
  //     return `${this.firstname} ${this.lastname}`;
  //   },
  // });

  // let firstname = $state(ctx.firstname);
  // let lastname = $state(ctx.lastname);
  // const fullname = $derived(`${firstname} ${lastname}`);

  setContext<SharedContextState>("shared", {
    user: {
      firstname,
      lastname,
      fullname,
    },
  });
}

export function getSharedContext<T extends SharedContextKey>(
  key: T
): SharedContextState[T] {
  const context = getContext<SharedContextState>("shared");

  return context[key];
}
