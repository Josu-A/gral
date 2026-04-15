import { defineConfig } from 'tsup';

export default defineConfig({
    clean: true,
    entry: ['src/main.ts'],
    format: 'esm',
    splitting: true,
    tsconfig: 'tsconfig.prod.json'
});
