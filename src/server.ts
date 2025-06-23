import 'zone.js/node';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { PrerenderResolver } from './src/app/resolvers/prerender.resolver';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/your-app-name/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Set up prerendering
  server.get('*', (req, res, next) => {
    if (req.url.includes('/quiz/')) {
      const resolver = new PrerenderResolver();
      const { params } = resolver.resolve();

      // Check if this is a known prerendered route
      const category = req.url.split('/quiz/')[1];
      if (params.some((p: any) => p.category === category)) {
        return ngExpressEngine({
          bootstrap: AppServerModule,
        })(req, res, () => next());
      }
    }
    next();
  });

  // Serve static files
  server.use(express.static(distFolder, { index: false }));

  // Angular Universal express engine
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express REST API endpoints
  server.get('/api/**', (req, res) => { });

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl }
      ]
    });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
if (mainModule && mainModule.filename === __filename) {
  run();
}

export * from './src/main.server';
