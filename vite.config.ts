import { resolve } from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'acms-js-sdk': resolve(__dirname, 'src/index.ts'),
        'acms-path': resolve(__dirname, 'src/lib/acmsPath/index.ts'),
        'type-guard': resolve(__dirname, 'src/lib/typeGuard/index.ts'),
      },
      name: 'acmsClient',
      fileName: '[format]/[name]',
    },
  },
  plugins: [
    dts({
      outDir: 'dist/types',
    }),
    eslint({
      extensions: ['js', 'ts', 'vue'],
      exclude: ['/node_modules/'],
      emitError: true,
      emitWarning: true,
      failOnError: false,
      fix: true,
    }),
  ],
});
