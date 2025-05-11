#!/usr/bin/env node

import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildOptimized() {
  console.log('Building with performance optimizations...');

  // Import optimizations
  const { getOptimizationPlugins, optimizedBuildConfig } = await import('./client/src/vite-plugins.js');

  // Build with optimizations
  await build({
    root: path.resolve(__dirname, 'client'),
    configFile: path.resolve(__dirname, 'vite.config.ts'),
    build: {
      ...optimizedBuildConfig,
      outDir: path.resolve(__dirname, 'dist/public'),
      emptyOutDir: true,
    },
    plugins: getOptimizationPlugins(),
  });

  console.log('Frontend built with optimizations');

  // Update Cache-Control headers via .htaccess file
  const htaccessContent = `
# Cache static assets
<FilesMatch "\\.(js|css|jpg|jpeg|png|gif|webp|avif|ico|svg|woff|woff2)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# Enable Brotli compression if available
<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_COMPRESS text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript application/json application/xml
</IfModule>

# Enable gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript application/json application/xml
</IfModule>
`;

  // Write .htaccess file
  fs.writeFileSync(path.resolve(__dirname, 'dist/public/.htaccess'), htaccessContent);

  // Build server code
  console.log('Building server code...');
  // This part would typically call esbuild directly, but we'll use the existing npm script
  const { execSync } = await import('child_process');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { 
    stdio: 'inherit'
  });

  console.log('Build completed successfully with all optimizations');
}

buildOptimized().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});