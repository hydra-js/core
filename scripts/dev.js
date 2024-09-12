'use strict';

var path = require('path');
var spawn = require('child_process').spawn;
var webpack = require('webpack');
var nodemon = require('nodemon');

var getWebpackConfig = require('../config/webpack.config');

module.exports = function(projectRoot) {
  var config = getWebpackConfig(projectRoot);
  config.mode = 'development';
  config.watch = true;

  var compiler = webpack(config);

  compiler.watch({}, function(err, stats) {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    console.log(stats.toString({
      chunks: false,
      colors: true
    }));
  });

  var serverPath = path.join(projectRoot, 'dist', 'index.js');

  var nodemonInstance = nodemon({
    script: serverPath,
    watch: [path.join(projectRoot, 'dist')],
    delay: 1000, // 1 second delay
    stdout: false,
    stderr: false
  });

  // Pipe stdout to our console
  nodemonInstance.on('stdout', function (stdout) {
    process.stdout.write(stdout);
  });

  // Pipe stderr to our console
  nodemonInstance.on('stderr', function (stderr) {
    process.stderr.write(stderr);
  });

  nodemonInstance.on('start', function() {
    console.log('Server has started');
  }).on('quit', function() {
    console.log('Server has quit');
    process.exit();
  }).on('restart', function(files) {
    console.log('Server restarted due to: ', files);
  });
};
