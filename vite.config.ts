/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'ReactMDViewer',
      fileName: (format) => `react-md-viewer.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  test: {
    global: true,
    environment: 'happy-dom',
    setupFiles: './setupTest.ts',
  },
});
