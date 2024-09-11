'use strict';

var webpack = require('webpack');
var getWebpackConfig = require('../config/webpack.config');

module.exports = function(projectRoot) {
  var config = getWebpackConfig(projectRoot);
  var compiler = webpack(config);

  return new Promise(function(resolve, reject) {
    compiler.run(function(err, stats) {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        reject(err);
        return;
      }

      console.log(stats.toString({
        chunks: false,
        colors: true
      }));

      resolve();
    });
  });
};
