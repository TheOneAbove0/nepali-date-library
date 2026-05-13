import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    parsers: 'src/parsers.ts',
    validators: 'src/validators.ts',
    conversion: 'src/conversion.ts',
    formatting: 'src/formatting.ts',
    manipulation: 'src/manipulation.ts',
    'datepicker-core': 'src/datepicker-core.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  target: 'es2019',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
});
