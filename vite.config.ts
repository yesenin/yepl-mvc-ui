import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (id.includes('@mui') || id.includes('@emotion')) {
            return 'mui';
          }

          if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
            return 'state';
          }

          if (id.includes('react-router')) {
            return 'router';
          }

          if (id.includes('react-hook-form') || id.includes('zod')) {
            return 'forms';
          }

          if (id.includes('react')) {
            return 'react';
          }

          return 'vendor';
        },
      },
    },
  },
});
