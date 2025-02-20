import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  {
    // 在 Flat Config ignores 是一個特殊的配置，需要在一個獨立的物件中定義，當 ignores 與其他配置混合在一起時，ESLint 可能無法正確處理檔案忽略邏輯
    ignores: ['public', 'dist', 'node_modules', 'src/common'],
  },
  {
    languageOptions: { globals: globals.browser },
    plugins: {
      js: pluginJs, // 不加這個也可以
      prettier: eslintPluginPrettier,
    },
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
