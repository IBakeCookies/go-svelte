import "./app.css";
// import App from "../App.svelte";
// import App2 from "../App2.svelte";

export function render(data) {
  if (data.name === "index") {
    // @ts-ignore
    const App = import("./App.svelte").then((m) => {
      return m.default.render({
        // a: "HELLO FROM SERVER",
        ...data,
      });
    });

    return App;

    // return App.render({
    //   // a: "HELLO FROM SERVER",
    //   ...data,
    // });
  }

  if (data.name === "spa") {
    const App = import("./App3.svelte").then((m) => {
      return m.default.render({
        // a: "HELLO FROM SERVER",
        ...data,
      });
    });

    return App;
  }

  if (data.name === "spa1") {
    const App = import("./App4.svelte").then((m) => {
      return m.default.render({
        // a: "HELLO FROM SERVER",
        ...data,
      });
    });

    return App;
  }

  if (data.name === "spa2") {
    const App = import("./App5.svelte").then((m) => {
      return m.default.render({
        // a: "HELLO FROM SERVER",
        ...data,
      });
    });

    return App;
  }

  const App = import("./App2.svelte").then((m) => {
    return m.default.render({
      // a: "HELLO FROM SERVER",
      ...data,
    });
  });

  return App;

  // return App2.render({
  //   // a: "HELLO FROM SERVER",
  // });
}
