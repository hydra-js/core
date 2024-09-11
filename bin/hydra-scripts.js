#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const build = require('../scripts/build');
const serve = require('../scripts/start');
const dev = require('../scripts/dev');

yargs(hideBin(process.argv))
  .command('build', 'Build the project', {}, () => {
    build(process.cwd());
  })
  .command('serve', 'Serve the built project', {}, () => {
    serve(process.cwd());
  })
  .command('dev', 'Run the project in development mode', {}, () => {
    dev(process.cwd());
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .help().argv;
