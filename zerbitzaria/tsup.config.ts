import { resolve } from 'path';
import { defineConfig } from 'tsup';

export default defineConfig({
    clean: true,
    entry: ['src/main.ts'],
    esbuildOptions(options, _) {
        options.alias = {
            '@': resolve(import.meta.dirname, 'src')
        };
    },
    format: 'esm',
    splitting: true,
    tsconfig: 'tsconfig.prod.json'
});
