const path = require('path');
const nodeExternals = require('webpack-node-externals');
// const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const { NODE_ENV = 'production' } = process.env;

module.exports = (projectRoot) => ({
  entry: path.resolve(projectRoot, 'src/index.js'),
  mode: NODE_ENV,
  target: 'node14',
  output: {
    path: path.resolve(projectRoot, 'dist'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  node: '14'
                }
              }],
              '@babel/preset-react'
            ]
          }
        }
      }
    ]
  },
  plugins: [
    // new WebpackShellPluginNext({
    //   onBuildEnd: {
    //     scripts: ['npm run start:dev'],
    //     blocking: false,
    //     parallel: true
    //   }
    // }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(projectRoot, 'public'), to: 'public' },
        { from: path.resolve(projectRoot, 'layouts'), to: 'layouts' },
        { from: path.resolve(projectRoot, 'routes'), to: 'routes' }
      ],
    }),
    new Dotenv()
  ]
});
