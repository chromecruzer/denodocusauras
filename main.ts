// export function add(a: number, b: number): number { 
//   return a + b;
// }

// // Learn more at https://deno.land/manual/examples/module_metadata#concepts
// if (import.meta.main) {
//   console.log("Add 2 + 3 =", add(2, 3));
// }

//  npm node imports no deno //

import express, {Request, Response} from "express"
import compression from "compression"
//import cors from "cors"
//import morgan from "morgan"
import 'colors'
import  * as path  from '@std/path';

//  server configs
const app = express()
app.use(compression())
//app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//app.use(morgan('tiny'))

// front-end client (/** Docusauras */)
const clientBuildPath = path.join(Deno.cwd(), "build");
const fullPath = path.join(clientBuildPath);
app.use(express.static(clientBuildPath));
console.log(fullPath.bgYellow)

// Handle SPA routing, return index.html for all unknown routes
app.get('*', (req: Request,res: Response, next: () => any ) => {
 // if (req.path.startsWith('/api') || req.path === '/restapi') {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});
//  routes
app.get('/api',async (_req: Request,res: Response)=>{
  await res.status(200).json({msg: `This data comes from Backend Deno Server`}) 
})

//
const port = Deno.env.get("PORT") || 3000 
app.listen(port, ()=>{   
  console.log(`server is running at http://localhost:${port}`.bgGreen.bold)
})
