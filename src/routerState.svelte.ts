import { newRoutes } from './routes.ts';

export let test = $state({ name: 'asd' });

function getParentPath(childPath: string, parentPath: string): string {
    if (!parentPath) {
        return '/';
    }

    const parentSplitted = parentPath.split('/');
    const childSplitted = childPath.split('/');

    if (childPath === '') {
        return parentPath;
    }

    if (childSplitted[0] === '' && parentPath.length > 1) {
        return childPath;
    }

    if (parentSplitted[0] !== '/' && parentPath.length > 1) {
        return `${parentPath}/${childPath}`;
    }

    return `${parentPath}${childPath}`;
}

function createFullPath(routes, parentPath, parentRoute) {
    if (!routes.children) {
        return;
    }

    routes.children.forEach((route) => {
        route.fullPath = getParentPath(route.path, parentPath);
        route.parent = parentRoute || {};

        createFullPath(route, route.fullPath, route);
    });
}

createFullPath(newRoutes);

export const routerState = $state({ state: newRoutes });
