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

// Node + deno

import express, { Request, Response } from "express";
import compression from "compression";
import { serveFile } from "https://deno.land/std@0.198.0/http/file_server.ts";
import { join } from "https://deno.land/std@0.198.0/path/mod.ts";
import 'colors';

// Server configs
const app = express();
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Front-end client (/** Docusaurus */)
const clientBuildPath = join(Deno.cwd(), "build");
console.log(clientBuildPath.bgYellow);

// Replace express.static with a custom Deno file serving middleware
app.use(async (req: Request, res: Response, next: () => any) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const filePath = url.pathname === "/" ? "index.html" : url.pathname;
    const fullPath = join(clientBuildPath, filePath);

    // Check if the file exists and serve it
    try {
      const fileContent = await serveFile(req, fullPath);
      res.status(fileContent.status).send(new TextDecoder().decode(await fileContent.arrayBuffer()));
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        next(); // Continue to the next middleware or route
      } else {
        console.error("Error serving static file:", error);
        res.status(500).send("Internal Server Error");
      }
    }
  } catch (error) {
    next(); // If anything goes wrong, let the request pass to the next middleware
  }
});

// Handle SPA routing, return index.html for all unknown routes
app.get('*', (req: Request, res: Response, next: () => any) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(join(clientBuildPath, "index.html"));
});

// Routes
app.get('/api', async (_req: Request, res: Response) => {
  await res.status(200).json({ msg: "This data comes from Backend Deno Server" });
});

// Start server
const port = Deno.env.get("PORT") || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`.bgGreen.bold);
});
