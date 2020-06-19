import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
import { Storage } from '@google-cloud/storage';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync, readdirSync } from 'fs';
import { config } from 'dotenv';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  config();
  const server = express();
  const distFolder = join(process.cwd(), 'dist/manga-app/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
  // Creates a client from a Google service account key.
  const storage = new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
  const bucketName = process.env.BUCKET_NAME;

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

  server.get('/chapters/:chapterIndex/images', (req, res, next) => {
    storage.bucket(bucketName).getFiles({
      prefix: `chapters/Solo Leveling – Chapter ${req.params.chapterIndex}/`,
      autoPaginate: false
    }).then(([files, text, meta]) => {
      const images = files.sort((a, b) => {
        return parseInt(a.name.match(/(\d+)\w{0,}\.\w+/)[1]) - parseInt(b.name.match(/(\d+)\w{0,}\.\w+/)[1]);
      }).map(file => {
        const imageName = file.name.split('/')[2];
        return `/chapters/${req.params.chapterIndex}/images/${imageName}`;
      });
      res.json(images);
    });

  });

  server.get('/chapters', (req, res, next) => {
    storage.bucket(bucketName).getFiles({
      prefix: `chapters/`,

      autoPaginate: true
    }).then(([files, text, meta]) => {
      let chapters = [];
      files.forEach((file) => {
        const chapterName = file.name.split('/')[1];
        const index = chapters.findIndex(chapter => {
          return chapterName === chapter;
        });
        if (index < 0) {
          chapters.push(chapterName);
        }
      });

      chapters = chapters.sort((a, b) => {
        return parseInt(a.match(/\d+$/)[0]) - parseInt(b.match(/\d+$/)[0]);
      });
      res.json(chapters);
    });
  });

  server.get('/chapters/:chapterIndex/images/:imageName', (req, res, next) => {
    const srcFilename = `chapters/Solo Leveling – Chapter ${req.params.chapterIndex}/${req.params.imageName}`;
    storage.bucket(bucketName).file(srcFilename).download().then(value => {
      res.send(value[0]);
    });
  });

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

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
