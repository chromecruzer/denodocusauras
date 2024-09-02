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

import { serve } from "https://deno.land/std@0.198.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.198.0/http/file_server.ts";
import { join } from "https://deno.land/std@0.198.0/path/mod.ts";

// Front-end client (/** Docusaurus */)
const clientBuildPath = join(Deno.cwd(), "build");
console.log(clientBuildPath);

// Routes
async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Handle API routes
  if (url.pathname.startsWith("/api")) {
    return new Response(
      JSON.stringify({ msg: "This data comes from Backend Deno Server" }),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  // Serve static files from the build directory
  try {
    const filePath = url.pathname === "/" ? "index.html" : url.pathname;
    const fullPath = join(clientBuildPath, filePath);

    // Attempt to serve the requested file
    try {
      return await serveFile(req, fullPath);
    } catch (error) {
      // If the file is not found, serve the 404.html file
      if (error instanceof Deno.errors.NotFound) {
        return await serveFile(req, join(clientBuildPath, "404.html"));
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Error serving file:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Start server
const port = Deno.env.get("PORT") || 3000;
console.log(`Server is running at http://localhost:${port}`);
await serve(handler, { port: Number(port) });


