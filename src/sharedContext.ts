import { setContext } from "svelte";
import { writable, derived } from "svelte/store";

export function createSharedContext(ctx) {
  const firstname = writable(ctx.firstname);
  const lastname = writable(ctx.lastname);
  const fullname = derived([firstname, lastname], ([$firstname, $lastname]) => {
    return `${$firstname} ${$lastname}`;
  });

  setContext("shared", {
    firstname,
    lastname,
    fullname,
  });
}
