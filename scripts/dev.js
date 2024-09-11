const path = require('path');
const { spawn } = require('child_process');
const webpack = require('webpack');
const nodemon = require('nodemon');

const getWebpackConfig = require('../config/webpack.config');

module.exports = (projectRoot) => {
  const config = getWebpackConfig(projectRoot);
  config.mode = 'development';
  config.watch = true;

  const compiler = webpack(config);

  compiler.watch({}, (err, stats) => {
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

  const serverPath = path.join(projectRoot, 'dist', 'index.js');

  nodemon({
    script: serverPath,
    watch: [path.join(projectRoot, 'dist')],
    delay: 1000, // 1 second delay
  });

  nodemon.on('start', () => {
    console.log('Server has started');
  }).on('quit', () => {
    console.log('Server has quit');
    process.exit();
  }).on('restart', (files) => {
    console.log('Server restarted due to: ', files);
  });
};
