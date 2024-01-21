import fs from "node:fs/promises";
import express from "express";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";

const aboutTemplateHtml = isProduction
  ? await fs.readFile("./dist/client/index-about.html", "utf-8")
  : "";

const ssrManifest = isProduction
  ? await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8")
  : undefined;

// Create http server
const app = express();

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

// Serve HTML

const cache = {
  html: "",
  css: "",
};

async function readCss() {
  console.log("reading css");
  return fs.readFile("./src/app.css", "utf-8");
}

/* 
  expected flow with a go server

  - go server is public and gets requests
  - go server gets data needs (db for example) and then does a post request to our node server
  - node server extracts the data needed from the request and uses that to feed into the SSR component
  - node renders the component and returns the html to the go server
  - go server takes the html and inserts it where needed and rends that page back to the client
  - before go sends that page, there one last thing it has to do, which is adding a script tag in the file that will add the data needed to the window object. Something like 
        .replace(<!--app-data-script-->, <script>window.__order__ = ${JSON.stringify(order)}</script>);
  - then the code on the client should use that object on the window to hydrate the component. Something like 
  // for svelte an entry.js file that looks like this
  new App({
    target: document.getElementById("app"),
    hydrate: true,
    props: {
      order: window.__order__,
    },
  });
*/

app.get("/", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.ts")).render;
    } else {
      template = templateHtml;
      render = (await import("./dist/entry-server.js")).render;
    }

    cache.css = cache.css || (await readCss());

    const order = {
      id: "1",
      quantity: Math.random() * 100,
    };

    // const rendered = await render(url, ssrManifest);
    const rendered = await render({ order, name: "index" });

    // const entry = await fs.readFile(
    //   "./src/entry-client-placeholder.ts",
    //   "utf-8"
    // );
    // const entryWithData = entry.replace(
    //   "/* __data__ */",
    //   `order: ${JSON.stringify(order)}`
    // );
    // await fs.writeFile("./src/entry-client.ts", entryWithData);

    // console.log(rendered);

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "")
      .replace(
        `<!--app-css-->`,
        `<style>${cache.css}${rendered.css.code ?? ""}</style>`
      )
      .replace(
        `<!--app-script-->`,
        `
        <script>
          window.__order__ = ${JSON.stringify(order)}
        </script>
      `
      );

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.get("/about", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index-about.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.ts")).render;
    } else {
      template = aboutTemplateHtml;
      render = (await import("./dist/entry-server.js")).render;
    }

    const css = await fs.readFile("./src/app.css", "utf-8");

    const rendered = await render({ name: "about" });
    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "")
      .replace(
        `<!--app-css-->`,
        `<style>${css}${rendered.css.code ?? ""}</style>`
      );

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.get("/spa", async (req, res) => {
  //   const template = await fs.readFile("./index-spa.html", "utf-8");
  //   res.status(200).set({ "Content-Type": "text/html" }).end(template);

  try {
    const url = req.originalUrl.replace(base, "");

    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index-spa.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.ts")).render;
    } else {
      template = aboutTemplateHtml;
      render = (await import("./dist/entry-server.js")).render;
    }

    const css = await fs.readFile("./src/app.css", "utf-8");
    const rendered = await render({ name: "spa" });
    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "")
      .replace(
        `<!--app-css-->`,
        `<style>${css}${rendered.css.code ?? ""}</style>`
      );

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.get("/spa1", async (req, res) => {
  //   const template = await fs.readFile("./index-spa.html", "utf-8");
  //   res.status(200).set({ "Content-Type": "text/html" }).end(template);

  try {
    const url = req.originalUrl.replace(base, "");

    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index-spa1.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.ts")).render;
    } else {
      template = aboutTemplateHtml;
      render = (await import("./dist/entry-server.js")).render;
    }

    const css = await fs.readFile("./src/app.css", "utf-8");
    const rendered = await render({ name: "spa1" });
    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "")
      .replace(
        `<!--app-css-->`,
        `<style>${css}${rendered.css.code ?? ""}</style>`
      );

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.get("/spa2", async (req, res) => {
  //   const template = await fs.readFile("./index-spa.html", "utf-8");
  //   res.status(200).set({ "Content-Type": "text/html" }).end(template);

  try {
    const url = req.originalUrl.replace(base, "");

    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index-spa2.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.ts")).render;
    } else {
      template = aboutTemplateHtml;
      render = (await import("./dist/entry-server.js")).render;
    }

    const css = await fs.readFile("./src/app.css", "utf-8");
    const rendered = await render({ name: "spa2" });
    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "")
      .replace(
        `<!--app-css-->`,
        `<style>${css}${rendered.css.code ?? ""}</style>`
      );

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
