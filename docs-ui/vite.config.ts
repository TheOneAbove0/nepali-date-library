import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'nepali-date-library-react': path.resolve(__dirname, '../react/src/index.ts'),
    },
  },
});
