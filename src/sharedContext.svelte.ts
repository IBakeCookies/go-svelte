import { setContext, getContext } from 'svelte';

export interface Context {
    data: {
        user?: User;
    };

    path: string;
}

interface User {
    firstname: string;
    lastname: string;
}

type UserKey = keyof User;

export interface SharedContextState {
    user:
        | {
              [K in UserKey]: User[K];
          }
        | null;
}

type SharedContextKey = keyof SharedContextState;

function createUserState(user: User): SharedContextState['user'] {
    const userState = $state({
        firstname: user.firstname,
        lastname: user.lastname,
    });

    return userState;
}

export function createSharedContext(data: Context['data']): void {
    setContext<SharedContextState>('shared', {
        user: data.user ? createUserState(data.user) : null,
    });
}

export function getSharedContext<T extends never>(): SharedContextState;

export function getSharedContext<T extends SharedContextKey>(key: T): SharedContextState[T];

export function getSharedContext<T extends SharedContextKey>(
    key?: T,
): SharedContextState | SharedContextState[T] {
    const context = getContext<SharedContextState>('shared');

    if (!key) {
        return context;
    }

    return context[key];
}
