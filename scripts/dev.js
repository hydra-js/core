const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const getWebpackConfig = require('../config/webpack.config');

module.exports = (projectRoot) => {
  const config = getWebpackConfig(projectRoot);
  config.mode = 'development';
  
  const compiler = webpack(config);
  const devServerOptions = {
    hot: true,
    // Add other dev server options as needed
  };

  const server = new WebpackDevServer(devServerOptions, compiler);

  server.start();
};
