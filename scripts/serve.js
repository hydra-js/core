const path = require('path');
const { spawn, execSync } = require('child_process');

module.exports = (projectRoot) => {
  console.log('Building project...');
  try {
    execSync('hydra-scripts build', { stdio: 'inherit', cwd: projectRoot });
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }

  const distIndexPath = path.join(projectRoot, 'dist', 'index.js');

  console.log(`Starting server: node ${distIndexPath}`);

  const child = spawn('node', [distIndexPath], {
    cwd: projectRoot,
    stdio: 'inherit'
  });

  child.on('error', (error) => {
    console.error(`Error running server: ${error.message}`);
    process.exit(1);
  });

  child.on('exit', (code) => {
    console.log(`Server exited with code ${code}`);
    process.exit(code);
  });
};
