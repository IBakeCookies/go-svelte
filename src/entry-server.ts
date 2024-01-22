import "./app.css";

const entryMap = {
  index: () => import("./App.svelte"),
  about: () => import("./App2.svelte"),
  spa: () => import("./App3.svelte"),
  spa1: () => import("./App4.svelte"),
  spa2: () => import("./App5.svelte"),
};

export function render(data) {
  console.log(data);
  const App = entryMap[data.name]().then((m) => {
    return m.default.render({
      ...data,
    });
  });

  return App;
}
