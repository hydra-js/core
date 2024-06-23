import path from 'node:path';
import fs from 'node:fs';

import logger from './logger';

// export async function loadModule(filePath) {
//   const module = await import(filePath);
//   return module.default();
// }

// Normalize port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) return val;
  if (port >= 0) return port;

  return false;
}

function checkIfStartsWithNumberOrUnderscore(str) {
  return typeof str === 'string' && /^[0-9_]/.test(str);
}

function getTemplateRoutes(__templatedir) {
  const routes = {};
  const underscoreRoutes = {};

  function readdirRecursively(currentPath, currentRoute) {
    let filesAndDirs;
    try {
      filesAndDirs = fs.readdirSync(currentPath);
    } catch (error) {
      logger.error(`Error reading directory: ${currentPath}`, error);
      return;
    }

    filesAndDirs.forEach((fileOrDir) => {
      const fullPath = path.join(currentPath, fileOrDir);
      let stats;
      try {
        stats = fs.statSync(fullPath);
      } catch (error) {
        logger.error(`Error reading stats for: ${fullPath}`, error);
        return;
      }

      if (stats.isDirectory()) {
        if (!fileOrDir.startsWith('_')) {
          const subRoute = path.join(currentRoute, fileOrDir);
          readdirRecursively(fullPath, subRoute);
        }
      } else if (
        stats.isFile() &&
        (path.extname(fileOrDir) === '.jsx' ||
          path.extname(fileOrDir) === '.html')
      ) {
        const fileName = path.basename(fileOrDir, path.extname(fileOrDir));
        let _routeKey =
          fileName === 'index'
            ? currentRoute
            : path.join(currentRoute, fileName);

        // Normalize routeKey to ensure leading slash and replace backslashes with forward slashes
        // eslint-disable-next-line prefer-template
        const routeKey =
          '/' + _routeKey.replace(/\\/g, '/').replace(/^\/+/, '');

        if (fileOrDir.startsWith('_')) {
          underscoreRoutes[routeKey] = fullPath.replace(__templatedir, '');
        } else if (!checkIfStartsWithNumberOrUnderscore(fileOrDir)) {
          // routes[routeKey] = fullPath.replace(__templatedir, '');
          routes[routeKey] = {
            name: routeKey === '/' ? 'index' : _routeKey,
            type: fullPath.split('.')[1],
            path: fullPath.replace(__templatedir, ''),
          };
        }
      }
    });
  }

  if (!__templatedir || typeof __templatedir !== 'string') {
    throw new TypeError('The "basePath" argument must be a non-empty string');
  }

  readdirRecursively(__templatedir, '');
  return [routes, underscoreRoutes];
}

module.exports = {
  normalizePort,
  getTemplateRoutes,
};
