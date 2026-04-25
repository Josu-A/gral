import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

const monorepoRootDir = fileURLToPath(new URL('..', import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode })  => {
    const env = loadEnv(mode, monorepoRootDir, '');
    return {
        define: {
            __APP_ENV__: JSON.stringify(env.NODE_ENV),
        },
        envDir: monorepoRootDir,
        plugins: [
            react(),
            tailwindcss()
        ],
        resolve: {
            alias: {
                '@': path.resolve(import.meta.dirname, 'src'),
            },
        },
        server: {
            port: env.CLIENT_PORT ? Number(env.CLIENT_PORT) : 5173,
            proxy: {
                [env.VITE_BASE_API_PATH]: {
                    changeOrigin: true,
                    target: env.SERVER_URL || 'http://localhost:3000',
                },
            },
        },
    }
});
