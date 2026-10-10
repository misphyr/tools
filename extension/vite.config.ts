import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { packExtension } from './scripts/pack.mjs';

const extensionRoot = fileURLToPath(new URL('.', import.meta.url));
const siteSrc = resolve(extensionRoot, '../src');

export default defineConfig({
  root: extensionRoot,
  base: './',
  plugins: [
    react(),
    {
      // Gera manifest + ícones e monta as versões Chrome e Firefox a cada build
      name: 'pack-extension',
      apply: 'build',
      closeBundle: () => packExtension(extensionRoot),
    },
  ],
  resolve: {
    alias: [
      { find: /^@\//, replacement: `${siteSrc}/` },
      { find: 'next/link', replacement: resolve(extensionRoot, 'src/shims/next-link.tsx') },
    ],
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist/chrome',
    emptyOutDir: true,
    target: 'es2022',
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: {
        popup: resolve(extensionRoot, 'popup.html'),
        panel: resolve(extensionRoot, 'panel.html'),
        app: resolve(extensionRoot, 'app.html'),
      },
      output: {
        manualChunks: (id) => (/node_modules\/(react|react-dom|scheduler)\//.test(id) ? 'react' : undefined),
      },
      onwarn(warning, warn) {
        // As páginas do Next têm 'use client', que não faz sentido aqui
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
    },
  },
});
