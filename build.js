const { build } = require('esbuild');

build({
  entryPoints: ['./src/index.js'],
  bundle: true,
  platform: 'node',
  target: 'node14',
  outdir: 'dist',
  sourcemap: true,
  minify: false,
  format: 'cjs', // CommonJS format for Node.js
  external: [
    'source-map-support',
    '@babel/preset-typescript/package.json',
    '@babel/preset-typescript',
    '@babel/core',
  ],
  loader: {
    '.ts': 'ts',
  },
}).catch(() => process.exit(1));
