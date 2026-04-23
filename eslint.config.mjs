// @ts-check

import eslint from '@eslint/js';
import perfectionist from 'eslint-plugin-perfectionist';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
    {
        ignores: [
            '**/dist/**'
        ]
    },
    eslint.configs.recommended,
    tseslint.configs.recommended,
    perfectionist.configs['recommended-natural'],
    {
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }]
        }
    },
    {
        files: ['zerbitzaria/**/*.ts', 'mcp/**/*.ts'],
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    },
    {
        files: ['bezeroa/**/*.{ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser
            }
        }
    }
);
