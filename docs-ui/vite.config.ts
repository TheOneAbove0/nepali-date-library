import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: 'nepali-date-library-react',
        replacement: path.resolve(__dirname, '../react/src/index.ts'),
      },
      {
        find: /^nepali-date-library$/,
        replacement: path.resolve(__dirname, '../js/src/index.ts'),
      },
      {
        find: /^nepali-date-library\/(.+)$/,
        replacement: path.resolve(__dirname, '../js/src/$1.ts'),
      },
    ],
  },
});
