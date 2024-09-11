'use strict';

var path = require('path');
var childProcess = require('child_process');
var spawn = childProcess.spawn;
var execSync = childProcess.execSync;

module.exports = function(projectRoot) {
  console.log('Building project...');
  try {
    execSync('hydra-scripts build', { stdio: 'inherit', cwd: projectRoot });
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }

  var distIndexPath = path.join(projectRoot, 'dist', 'index.js');

  console.log('Starting server: node ' + distIndexPath);

  var child = spawn('node', [distIndexPath], {
    cwd: projectRoot,
    stdio: 'inherit'
  });

  child.on('error', function(error) {
    console.error('Error running server: ' + error.message);
    process.exit(1);
  });

  child.on('exit', function(code) {
    console.log('Server exited with code ' + code);
    process.exit(code);
  });
};
