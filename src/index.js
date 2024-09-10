/* eslint-disable */
'use strict';

var express = require('express');
var path = require('path');
var dotenv = require('dotenv');
var exphbs = require('express-handlebars');
var fs = require('fs');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var handlebars = require('handlebars');

var logger = require('./logger');

function bootstrapServer(options) {
  // Load environment variables
  dotenv.config();

  // @TODO: Compose page object with options and route data
  var page = {
    title: 'Welcome to Hydra-JS!',
    description: 'This the welcome page for Hydra-JS application.',
  };

  var app = express();
  var port = options.port || process.env.PORT || 3000;

  app.set('port', port);

  // Set security headers
  app.use(function (req, res, next) {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
  });

  app.disable('x-powered-by'); // Reduce fingerprinting

  // Set up Handlebars as the view engine
  app.engine(
    'html',
    exphbs.engine({
      defaultLayout: 'index',
      layoutsDir: path.join(process.cwd(), 'layouts'),
      extname: '.html',
    })
  );
  app.set('view engine', 'html');
  app.set('views', path.join(process.cwd(), 'routes'));

  // Allow the main app to initialize routes and middleware
  if (options.init) {
    options.init(app);
  }

  // Serve static files from the 'public' directory
  app.use(express.static(path.join(process.cwd(), 'public')));

  app.get('*', function (req, res) {
    // @TODO: Implement route handling properly
    return res.render(req.path.replace(/^\/+/g, ''), { page: page });
  });

  // Request handler
  app.use((err, req, res, next) => {
    // @TODO: Improve
    if (err.hasOwnProperty('view')) {
      // Handle .js files
      if (fs.existsSync(path.join(process.cwd(), 'routes', err.view.name + '.js'))) {
        var handlerPath = path.join(process.cwd(), 'routes', err.view.name + '.js');
        var handler = require(handlerPath)();
        if (handler[req.method.toLowerCase()]) {
          return handler[req.method.toLowerCase()](req, res, next);
        } else {
          return res.render('404', { page: page });
        }
      }
      // Handle .jsx files
      if (fs.existsSync(path.join(process.cwd(), 'routes', err.view.name + '.jsx'))) {
        var reactElementPath = path.join(process.cwd(), 'routes', err.view.name + '.jsx');
        var reactElement = require(reactElementPath).default;
        var jsx = React.createElement(reactElement, {});
        var jsxToHtml = ReactDOMServer.renderToString(jsx);

        var layoutPath = path.join(path.join(process.cwd(), 'layouts', 'index.html'));
        var withTemplate = handlebars.compile(
          fs.readFileSync(layoutPath, 'utf8')
        );
        var html = withTemplate({ body: jsxToHtml });
        return res.send(html);
      }
    }

    logger.error(err);
    return res.render('404', { page: page });
  });

  function startServer() {
    return app.listen(port, function () {
      logger.log('Server running on port ' + port);
    });
  }

  return {
    app: app,
    start: startServer,
  };
}

module.exports = { bootstrapServer };
