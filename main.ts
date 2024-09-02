import express, { Request, Response } from "express";
import compression from "compression";
//import cors from "cors";
//import morgan from "morgan";
import 'colors';

// Server configs
const app = express();
app.use(compression());
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(morgan('tiny'));

// Front-end client (/** Docusaurus */)
const clientBuildPath = `${Deno.cwd()}/build`;
console.log(clientBuildPath.bgYellow);

app.use(express.static(clientBuildPath));

// Handle SPA routing, return index.html for all unknown routes
app.get('*', (req: Request, res: Response, next: () => any) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(`${clientBuildPath}/index.html`);
});

// Routes
app.get('/api', async (_req: Request, res: Response) => {
  await res.status(200).json({ msg: `This data comes from Backend Deno Server` });
});

// Start server
const port = Deno.env.get("PORT") || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`.bgGreen.bold);
});
