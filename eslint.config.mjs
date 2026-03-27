import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
    eslint.configs.recommended,
    tseslint.configs.recommended,
    //tseslint.configs.recommendedTypeChecked,
    tseslint.configs.stylistic,
    {
        ignores: [
            'node_modules/',
            'dist/', // exclude specific folder
            '**/*.js', // exclude all JavaScript files
            '**/*.mjs'
        ]
    },
    {
        files: ['**/*.ts'],   
    },
]
);
