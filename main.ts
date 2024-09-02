// Importing Node.js modules
import express, { Request, Response } from 'express';
import compression from 'compression';
import path from 'path';

// Server configurations
const app = express();
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Front-end client
const clientBuildPath = path.join(process.cwd(), 'build');
console.log(clientBuildPath.bgYellow);

// Serve static files from the build directory
app.use(express.static(clientBuildPath));

// Handle SPA routing
app.get('*', (req: Request, res: Response, next: () => any) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// API route
app.get('/api', async (_req: Request, res: Response) => {
  await res.status(200).json({ msg: 'This data comes from Backend Node.js Server' });
});

// Port configuration
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`.bgGreen.bold);
});
