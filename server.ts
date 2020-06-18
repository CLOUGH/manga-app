import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync, readdirSync } from 'fs';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/manga-app/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('/chapter-images/:chapterIndex', (req, res, next) => {
    const directoryPath = `C:/Users/clough/Projects/solo-leveling-scraper/chapters/Solo Leveling – Chapter ${req.params.chapterIndex}`;
    const images = getChapterImages(req.params.chapterIndex, directoryPath);

    res.json(images);
  })

  server.get('/chapters', (req, res, next) => {
    const chapterDirectoryPath = 'C:/Users/clough/Projects/solo-leveling-scraper/chapters';

    let chapters = readdirSync(chapterDirectoryPath);
    chapters = chapters.sort((a, b) => {
      return parseInt(a.match(/\d+$/)[0]) - parseInt(b.match(/\d+$/)[0]);
    });


    res.json(chapters);
  });

  server.get('/chapters/:chapterIndex/images/:imageName', (req, res, next) => {
    const filePath = `C:/Users/clough/Projects/solo-leveling-scraper/chapters/Solo Leveling – Chapter ${req.params.chapterIndex}/${req.params.imageName}`;


    res.sendFile(filePath);
  });

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });



  function getChapterImages(chapter, directoryPath) {
    let images = readdirSync(directoryPath);
    images = images.sort((a, b) => {
      return parseInt(a.match(/(\d+)\w{0,}\.\w+/)[1]) - parseInt(b.match(/(\d+)\w{0,}\.\w+/)[1]);
    }).map(image => {
      return `/chapters/${chapter}/images/${image}`;
    });
    return images;
  }

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
