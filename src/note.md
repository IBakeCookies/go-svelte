Route should support nested routes.

It seems its impossible to just do <Router /> like in Vue with <router-view> that doesnt take any properties and infers its hiarchy from the Vue instance. So since there is no Svelte instance we cannot know where a <Router /> is in the tree.

Biggest issue is dynamic imports and path matching. (I suck working with strings / regex)

Example that should work

```
routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '', // this should be matched by '/'
                component: HomePage
            },
            {
                path: 'about', // this should be matched by parent path + / + child path = '/about'
                component: AboutPage
            },
            {
                path: 'carrier',
                component: CarrierPage
            }
        ]
    },
    // this component has completely different layout so we move it out of the children array for example
    {
        path: '/login',
        component: LoginPage
    }

]
```

<!-- MainLayout.svelte -->
<Header />
<Router {routes} />
<Footer />

<!-- AboutPage path /about -->
<h1>About</h1>

<!-- CarrierPage path /carrier -->
<h1>Carrier</h1>

Approaches to consider:

## 1

Have a <Router {routes} /> component take top level routes. and then have nested <Router {otherRoutes} /> where needed. This means each <Router> has its own Context probably.
Also idk how the nested route infers parent route path. Maybe it doesnt and we just have to pass it in? Idk. One could create a shared <Router> Context that routers push to, but no idea as of now.

## 2

Create a <Route path=''> component and throw several of those components where needed. This would be the easiest to implement but also the most verbose and least flexible.

<!-- MainLayout.svelte -->
<Header />
    <Route path='/'>
    <Route path='about'>
    <Route path='carrier'>
<Footer />

## 3 use a combination of <Router> and <Route> components somehow

## refs

-   https://github.com/ItalyPaleAle/svelte-spa-router/blob/HEAD/Advanced%20Usage.md#nested-routers

-   https://www.npmjs.com/package/svelte-routing

-   This seems to do it all, but it doesnt do dynamic import, which is the harders part and this whole router could not even be adjusted to do that https://github.com/jorgegorka/svelte-router
