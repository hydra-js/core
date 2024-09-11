const webpack = require('webpack');

const getWebpackConfig = require('../config/webpack.config');

module.exports = (projectRoot) => {
  const config = getWebpackConfig(projectRoot);
  const compiler = webpack(config);

  compiler.run((err, stats) => {
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
};
