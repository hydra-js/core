'use strict';

var path = require('path');
var nodeExternals = require('webpack-node-externals');
var CopyPlugin = require('copy-webpack-plugin');
var Dotenv = require('dotenv-webpack');
var babel = require('@babel/core');

var NODE_ENV = process.env.NODE_ENV || 'production';

module.exports = function(projectRoot) {
  return {
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
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                [require.resolve('@babel/preset-env'), {
                  targets: {
                    node: '14'
                  }
                }],
                require.resolve('@babel/preset-react')
              ]
            }
          }
        }
      ]
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: path.resolve(projectRoot, 'public'), to: 'public' },
          { from: path.resolve(projectRoot, 'layouts'), to: 'layouts' },
          { 
            from: path.resolve(projectRoot, 'routes'),
            to: ({ context, absoluteFilename }) => {
              const relativePath = path.relative(context, absoluteFilename);
              return path.join('routes', relativePath).replace(/\.jsx$/, '.js');
            },
            transform(content, absoluteFrom) {
              if (absoluteFrom.endsWith('.jsx') || absoluteFrom.endsWith('.js')) {
                // Transform JSX to JS using Babel
                const result = babel.transformSync(content, {
                  presets: [
                    [require.resolve('@babel/preset-env'), {
                      targets: {
                        node: '14'
                      }
                    }],
                    require.resolve('@babel/preset-react')
                  ],
                  filename: absoluteFrom,
                  comments: false,
                  minified: false
                });
                return result.code;
              }
              return content;
            }
          }
        ],
      }),
      new Dotenv()
    ]
  };
};
