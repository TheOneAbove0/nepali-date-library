import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/index.css'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  target: 'es2019',
  external: ['react', 'react-dom', 'nepali-date-library', 'nepali-date-library/datepicker-core'],
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
});
