import React from 'react';
import ReactDOMServer from 'react-dom/server';
import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import handlebars from 'handlebars';

import logger from './logger';
import { normalizePort, getTemplateRoutes } from './utils';

// default configs
const DEFAULT_PORT = 3000;

let _hydra;

class Hydra {
  constructor() {
    this.state = {};
    this.manifest = {};
  }

  async init(args) {
    const config = dotenv.config();
    if (config.error) throw config.error;

    const { parsed: allEnvs } = config;
    
    // @TODO: Check for required env variables, if not found, throw error

    const { PORT, ...envs } = allEnvs;
    const [__rootdir] = args;

    const __publicdir = path.join(__rootdir, 'public');
    const __routerdir = path.join(__rootdir, 'routes');
    const __templatedir = path.join(__rootdir, 'views');
    const __layoutdir = path.join(__templatedir, '_layouts');
    const __partialsdir = path.join(__templatedir, '_partials');
    const __menifestFilePath = path.join(__rootdir, 'manifest.json');

    const state = {
      PORT: normalizePort(Number(PORT) || DEFAULT_PORT),
      __rootdir,
      __routerdir,
      __publicdir,
      __templatedir,
      __layoutdir,
      __partialsdir,
      __menifestFilePath,
      ...envs,
    };
    this.state = state;

    // Read manifest file
    const manifest = this.getAppManifest();
    this.manifest = manifest;

    return this.state;
  }

  getAppManifest() {
    const manifestPath = path.resolve(this.state.__menifestFilePath);
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    return JSON.parse(manifestContent);
  }

  getPackageManifest() {
    const __rootdir = path.resolve(this.state.__rootdir);
    const manifestContent = fs.readFileSync(
      path.join(__rootdir, 'package.json'),
      'utf8'
    );
    return JSON.parse(manifestContent);
  }

  async registerRoutes() {
    const { __menifestFilePath, __templatedir } = this.state;

    // read Template Routes
    const pkg = this.getPackageManifest();
    const [views] = getTemplateRoutes(__templatedir);

    this.manifest.views = views;
    this.manifest.version = pkg.version;

    fs.writeFileSync(
      __menifestFilePath,
      JSON.stringify(this.manifest, null, 2)
    );

    return this.manifest;
  }

  jsxToHtml = (route, locals) => {
    try {
      // @TODO: There is unidentifed issue with production build, fix it.
      const filePath = path.join(this.state.__templatedir, route.path);
      const reactElement = require(filePath).default;
      const jsx = React.createElement(reactElement, locals);
      const jsxToHtml = ReactDOMServer.renderToString(jsx);

      // Render with master layout
      const layoutPath = path.join(this.state.__layoutdir, 'index.html');
      const withTemplate = handlebars.compile(
        fs.readFileSync(layoutPath, 'utf8')
      );
      const html = withTemplate({ locals, body: jsxToHtml });
      return html;
    } catch (err) {
      logger.error(err);
      return null;
    }
  };

  render = (req, res, next) => {
    try {
      const { views } = this.manifest;
      const route = views[req.path];

      if (route && route.type === 'html')
        return res.render(route.name, this.manifest);

      if (route && route.type === 'jsx') {
        const html = this.jsxToHtml(route, this.manifest);
        if (html) return res.send(html);
      }
    } catch (err) {
      logger.error(err);
    }
    next();
  };

  setState(key, value) {
    this.state[key] = value;
  }

  getState(key) {
    if (!key) return this.state;
    return this.state[key];
  }
}

export default _hydra || new Hydra();
