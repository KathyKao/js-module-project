module.exports = {
  // 您的 code 在哪些環境中運作，每個環境都帶有一組特定的全域變數
  env: {
    browser: true,
    es2024: true,
    commonjs: true,
    node: true,
  },
  // 額外擴充功能
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  // 解析器設定，可設定解析的 code 的版本、用哪個模組方式來處理等等功能
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  // 設定規則
  // ESLint 規則說明 https://eslint.org/docs/latest/use/configure/rules
  // ESLint 所有的規則 https://eslint.org/docs/latest/rules
  rules: {
    'no-console': 'off',
    'no-promise-executor-return': 'off',
    'no-plusplus': 'off',
    'no-loop-func': 'off',
    'array-callback-return': 'error',
    'object-curly-newline': 'off',
    'max-len': ['error', { code: 140 }],
    // ESLint V8.53.0 之後的版本, 格式化的規則已經 deprecated
    // "quotes": ["error", "single"],
    'arrow-body-style': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-unused-vars': 'off',
  },
};
