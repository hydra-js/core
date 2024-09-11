#!/usr/bin/env node

var yargs = require('yargs/yargs');
var hideBin = require('yargs/helpers').hideBin;

var build = require('../scripts/build');
var serve = require('../scripts/serve');
var dev = require('../scripts/dev');

yargs(hideBin(process.argv))
  .command('build', 'Build the project', {}, function(argv) {
    build(process.cwd()).then(function() {
      console.log('Build completed successfully');
    }).catch(function(error) {
      console.error('Build failed:', error);
      process.exit(1);
    });
  })
  .command('serve', 'Serve the project', function(yargs) {
    return yargs.option('dev', {
      alias: 'd',
      type: 'boolean',
      description: 'Run in development mode'
    });
  }, function(argv) {
    if (argv.dev) {
      dev(process.cwd());
    } else {
      serve(process.cwd());
    }
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv;
