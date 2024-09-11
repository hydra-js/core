#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const build = require('../scripts/build');
const serve = require('../scripts/serve');
const dev = require('../scripts/dev');

yargs(hideBin(process.argv))
  .command('build', 'Build the project', {}, async (argv) => {
    try {
      await build(process.cwd());
      console.log('Build completed successfully');
    } catch (error) {
      console.error('Build failed:', error);
      process.exit(1);
    }
  })
  .command('serve', 'Serve the project', (yargs) => {
    return yargs.option('dev', {
      alias: 'd',
      type: 'boolean',
      description: 'Run in development mode'
    });
  }, (argv) => {
    if (argv.dev) {
      dev(process.cwd());
    } else {
      serve(process.cwd());
    }
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv;
