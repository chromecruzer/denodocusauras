// import { serve } from "https://deno.land/std@0.198.0/http/server.ts";
// import { serveFile } from "https://deno.land/std@0.198.0/http/file_server.ts";
// import { join } from "https://deno.land/std@0.198.0/path/mod.ts";

// // Front-end client (/** Docusaurus */)
// const clientBuildPath = join(Deno.cwd(), "build");
// console.log(clientBuildPath);

// // Routes
// async function handler(req: Request): Promise<Response> {
//   const url = new URL(req.url);
  
//   // Handle API routes
//   if (url.pathname.startsWith("/api")) {
//     return new Response(
//       JSON.stringify({ msg: "This data comes from Backend Deno Server" }),
//       { headers: { "Content-Type": "application/json" } },
//     );
//   }

//   // Serve static files from the build directory
//   try {
//     const filePath = url.pathname === "/" ? "index.html" : url.pathname;
//     const fullPath = join(clientBuildPath, filePath);
//     return await serveFile(req, fullPath);
//   } catch (error) {
//     console.error("Error serving file:", error);
//     return new Response("Not Found", { status: 404 });
//   }
// }

// // Start server
// const port = Deno.env.get("PORT") || 3000;
// console.log(`Server is running at http://localhost:${port}`);
// await serve(handler, { port: Number(port) });


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import { Application, send } from "https://deno.land/x/oak@v12.2.0/mod.ts";

// const app = new Application();
// const PORT = Deno.env.get("PORT") || 8000;

// // Middleware to serve static files from the build directory
// app.use(async (ctx) => {
//   const filePath = ctx.request.url.pathname;
//   await send(ctx, filePath, {
//     root: `${Deno.cwd()}/build`,
//     index: "index.html",
//   });
// });


// console.log(`Server running on http://localhost:${PORT}`);
// await app.listen({ port: PORT });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { Application, send, Router } from "https://deno.land/x/oak@v12.2.0/mod.ts";
import { resolve } from "https://deno.land/std@0.183.0/path/mod.ts";

const app = new Application();
const router = new Router();
const PORT = 8000;

// Define your API endpoint
router.get('/api', async (ctx) => {
  ctx.response.status = 200;
  ctx.response.headers.set('Content-Type', 'application/json');
  ctx.response.body = { msg: 'This data comes from Backend Deno Server' };
});

// Middleware to serve static files
app.use(async (ctx, next) => {
  await next();

  // If the response status is still 404 after static file serving
  if (ctx.response.status === 404) {
    await send(ctx, '/404.html', {
      root: `${Deno.cwd()}/build`,
    });
  }
});

// Use router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Middleware to serve static files
app.use(async (ctx) => {
  const filePath = ctx.request.url.pathname;
  const fullPath = resolve(`${Deno.cwd()}/build`, filePath);
  try {
    await send(ctx, filePath, {
      root: `${Deno.cwd()}/build`,
      index: 'index.html',
    });
  } catch {
    // 404 is handled by the previous middleware if file is not found
    ctx.response.status = 404;
  }
});

console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
