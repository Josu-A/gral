// @ts-check

import eslint from '@eslint/js';
import perfectionist from 'eslint-plugin-perfectionist';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { join } from 'node:path';
import tseslint from 'typescript-eslint';

const rootDir = import.meta.dirname;
const bezeroaRootDir = join(rootDir, 'bezeroa');

export default defineConfig(
    {
        name: 'global/ignores',
        ignores: [
            '**/dist/**'
        ]
    },
    {
        name: 'base/ts',
        files: ['**/*.{ts,tsx}'],
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommended,
            perfectionist.configs['recommended-natural']
        ],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: rootDir
            }
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }]
        }
    },
    {
        name: 'app/server',
        files: ['{zerbitzaria,mcp}/**/*.ts'],
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    },
    {
        name: 'app/client',
        files: ['bezeroa/**/*.{ts,tsx}'],
        extends: [
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            eslintPluginBetterTailwindcss.configs.recommended
        ],
        languageOptions: {
            globals: {
                ...globals.browser
            },
            parserOptions: {
                project: ['./tsconfig.app.json', './tsconfig.node.json'],
                tsconfigRootDir: bezeroaRootDir
            }
        },
        settings: {
            'better-tailwindcss': {
                cwd: bezeroaRootDir,
                entryPoint: 'src/styles/index.css'
            }
        }
    }
);
