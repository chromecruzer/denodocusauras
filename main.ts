// Importing Node.js modules
import express, { Request, Response } from 'express';
import compression from 'compression';
import { join, cwd } from "https://deno.land/std@0.190.0/path/mod.ts";

// Server configurations
const app = express();
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Front-end client
const clientBuildPath = join(cwd(), 'build');
console.log(clientBuildPath);

// Serve static files from the build directory
app.use(express.static(clientBuildPath));

// Handle SPA routing
app.get('*', (req: Request, res: Response, next: () => any) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(join(clientBuildPath, 'index.html'));
});

// API route
app.get('/api', async (_req: Request, res: Response) => {
  await res.status(200).json({ msg: 'This data comes from Backend Deno Server' });
});

// Port configuration
const port = parseInt(Deno.env.get("PORT") || "3000", 10);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
