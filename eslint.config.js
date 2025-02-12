import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: { globals: globals.browser },
    plugins: {
      js: pluginJs,
      prettier: eslintPluginPrettier,
    },
    ignores: ['public', 'dist', 'node_modules'],
    rules: {
      'no-console': 'off',
      'no-promise-executor-return': 'off',
      'no-plusplus': 'off',
      'no-loop-func': 'off',
      'array-callback-return': 'error',
      'object-curly-newline': 'off',
      'max-len': ['error', { code: 140 }],
      // eslint v8.53.0 之後的版本，棄用格式化規則
      // quotes: ['error', 'single'],
      'arrow-body-style': 'off',
      'import/extensions': 'off',
      'import/prefer-default-export': 'off',
      'implicit-arrow-linebreak': 'off',
      'no-unused-vars': 'off',
      // Add Prettier as a rule
      'prettier/prettier': [
        'error',
        {
          tabWidth: 2,
          semi: true,
          printWidth: 120,
          singleQuote: true,
          trailingComma: 'all',
          endOfLine: 'auto',
        },
      ],
    },
  },
];
