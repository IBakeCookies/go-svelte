import fs from 'node:fs/promises';
import express from 'express';

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';
const app = express();

app.use(express.json());

let vite;
if (!isProduction) {
    const { createServer } = await import('vite');
    vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        base,
    });
    app.use(vite.middlewares);
} else {
    const compression = (await import('compression')).default;
    const sirv = (await import('sirv')).default;
    app.use(compression());
    app.use(base, sirv('./dist/client', { extensions: [] }));
}

function useRoute() {
    return async (req, res) => {
        if (isProduction) {
            try {
                const render = (await import('./dist/server/entry-server.js')).render;
                const rendered = await render(req.body);
                res.status(200).set({ 'Content-Type': 'text/html' }).end(rendered?.html);
                return;
            } catch (e) {
                vite?.ssrFixStacktrace(e);
                console.log(e.stack);
                res.status(500).end(e.stack);
            }

            return;
        }

        try {
            let template;

            template = await fs.readFile('./index.html', 'utf-8');
            template = await vite.transformIndexHtml(req.originalUrl, template);
            const render = (await vite.ssrLoadModule('./src/entry-server.ts')).render;

            const ctx = {
                data: {
                    user: {
                        firstname: 'John',
                        lastname: 'Doe',
                    },
                },
                path: req.originalUrl,
            };

            if (req.originalUrl !== '/spa' && req.originalUrl !== '/spa1') {
                ctx.data = {};
            }

            const rendered = await render(ctx);

            const html = template
                .replace(`<!--app-head-->`, rendered?.head ?? '')
                .replace(`<!--app-html-->`, rendered?.html ?? '')
                .replace(
                    `<!--app-script-->`,
                    `<script>window.__ctx__ = ${JSON.stringify(ctx)}</script>`,
                );

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
            vite?.ssrFixStacktrace(e);
            console.log(e.stack);
            res.status(500).end(e.stack);
        }
    };
}

!isProduction && app.get('*', useRoute());
isProduction && app.post('*', useRoute());

// Start http server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
