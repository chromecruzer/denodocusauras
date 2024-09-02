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

import express, { Request, Response, NextFunction } from "express";
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

// Middleware to serve static files
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    return next(); // Skip serving static files for API routes
  }

  // Construct file path
  const filePath = req.path === "/" ? "index.html" : req.path;
  const fullPath = join(clientBuildPath, filePath);

  // Serve the file if it exists
  Deno.readFile(fullPath)
    .then((fileContent) => {
      res.setHeader('Content-Type', 'text/html');
      res.send(new TextDecoder().decode(fileContent));
    })
    .catch((error) => {
      if (error instanceof Deno.errors.NotFound) {
        next(); // Continue to the next middleware if the file is not found
      } else {
        console.error("Error serving static file:", error);
        res.status(500).send("Internal Server Error");
      }
    });
});

// Handle API routes
app.get('/api', async (_req: Request, res: Response) => {
  await res.status(200).json({ msg: "This data comes from Backend Deno Server" });
});

// Handle SPA routing, return index.html for all unknown routes
app.get('*', (req: Request, res: Response) => {
  if (req.path.startsWith('/api')) {
    return;
  }
  res.sendFile(join(clientBuildPath, "index.html"));
});

// Start server
const port = Deno.env.get("PORT") || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`.bgGreen.bold);
});
