import { resolve } from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'acmsClient',
      fileName: '[format]/acms-js-sdk',
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
