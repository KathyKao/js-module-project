import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends('eslint:recommended', 'plugin:prettier/recommended'),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.node,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    rules: {
      'no-console': 'off',
      'no-promise-executor-return': 'off',
      'no-plusplus': 'off',
      'no-loop-func': 'off',
      'array-callback-return': 'error',
      'object-curly-newline': 'off',

      'max-len': [
        'error',
        {
          code: 140,
        },
      ],

      'arrow-body-style': 'off',
      'import/extensions': 'off',
      'import/prefer-default-export': 'off',
      'implicit-arrow-linebreak': 'off',
      'no-unused-vars': 'off',
    },
  },
];
