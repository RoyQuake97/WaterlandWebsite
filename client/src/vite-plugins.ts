// Vite plugins for performance optimization
import viteCompression from 'vite-plugin-compression';
import viteImagemin from 'vite-plugin-imagemin';
import type { Plugin } from 'vite';

// Export plugins as a function to avoid direct import in vite.config.ts
export function getOptimizationPlugins(): Plugin[] {
  return [
    // Compression for text assets (JS, CSS, HTML, SVG)
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    
    // Image optimization
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 5,
      },
      mozjpeg: {
        quality: 65,
        progressive: true,
      },
      pngquant: {
        quality: [0.7, 0.8],
        speed: 4,
      },
      webp: {
        quality: 70,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
    }),
  ];
}

// Build configuration for optimization
export const optimizedBuildConfig = {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: [
          'react',
          'react-dom',
          'framer-motion',
          'wouter',
          'embla-carousel-react',
          'react-hook-form',
          '@tanstack/react-query',
        ],
        ui: [
          '@radix-ui/react-accordion',
          '@radix-ui/react-dialog',
          '@radix-ui/react-dropdown-menu',
          '@radix-ui/react-select',
          '@radix-ui/react-toast',
          'class-variance-authority',
          'clsx',
          'tailwind-merge',
        ],
      },
    },
  },
  cssCodeSplit: true,
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  },
};