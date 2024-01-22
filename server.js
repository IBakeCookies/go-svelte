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

const spaTemplate = isProduction
  ? await fs.readFile("./dist/client/index-spa.html", "utf-8")
  : "";

const spaTemplate1 = isProduction
  ? await fs.readFile("./dist/client/index-spa1.html", "utf-8")
  : "";

const spaTemplate2 = isProduction
  ? await fs.readFile("./dist/client/index-spa2.html", "utf-8")
  : "";

const ssrManifest = isProduction
  ? await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8")
  : undefined;

// Create http server
const app = express();

app.use(express.json());

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
        .replace(<!--app-data-script-->, <script>window.__initialData__ = ${JSON.stringify(order)}</script>);
  - then the code on the client should use that object on the window to hydrate the component. Something like 
  // for svelte an entry.js file that looks like this
  new App({
    target: document.getElementById("app"),
    hydrate: true,
    props: {
      order: window.__initialData__,
    },
  });
*/

function useRoute(templateToRead, name, prodTemplate) {
  return async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, "");

      let template;
      let render;

      if (!isProduction) {
        // Always read fresh template in development
        template = await fs.readFile(templateToRead, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("./src/entry-server.ts")).render;
      } else {
        template = prodTemplate;
        render = (await import("./dist/server/entry-server.js")).render;
      }

      cache.css = cache.css || (await readCss());

      // const order = req.body.order

      const initialData = {
        random: Math.random() * 100,
      };

      // const rendered = await render(url, ssrManifest);
      const rendered = await render({ initialData, name });

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
            window.__initialData__ = ${JSON.stringify(initialData)}
          </script>
        `
        );

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite?.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  };
}

app.get("/", useRoute("./index.html", "index", templateHtml));

app.get("/about", useRoute("./index-about.html", "about", aboutTemplateHtml));

app.get("/spa", useRoute("./index-spa.html", "spa", spaTemplate));

app.get("/spa1", useRoute("./index-spa1.html", "spa1", spaTemplate1));

app.get("/spa2", useRoute("./index-spa2.html", "spa2", spaTemplate2));

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
