# JS 模組化搭配 Vite 打包工具及 ESLint 程式碼規範及 Prettier 格式化

### 1. vite : 是一個現代化大包工具，透過指令建立 vite 專案，vite 必須在 node 18 以上環境執行

- 指令建立 vite 專案

```bash
npm create vite@latest
```

- 打開專案後要立即執行 **npm install**，會依據 package.json 裡的套件去安裝

```bash
npm install
```

### 2. package.json 介紹

- scripts : 我們可以自己去定義 npm script 指令名稱，**npm run 指令名稱**
- 為什麼不直接執行 vite? 因為 **vite 必須透過 npm script 才能執行**
- vite 指令可以幫我們起一個 local dev server，不需要 live server

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 3. index.html 是 vite 預設進入點，其中 index.html 裡會載入一個 main.js，就是整個網站的進入點

在vite 專案裡不會在 index.html 去載入 css、svg（靜態資源）
是透過工具打包轉換 css 內容和載入所需要的靜態資源(svg)
**只要是在 JS 裡要使用的東西都需要 import，唯獨 JS 會需要使用 export 方式模組化丟出來使用**

![image](https://github.com/user-attachments/assets/70a55043-7566-4aa6-818c-98d39c1633ac)

![image](https://github.com/user-attachments/assets/2b9818ed-652a-4bee-95a2-931f01708f71)

### 4. 改變資料夾結構後執行 npm run dev 會有錯誤，因為 vite 預設路徑是最外層的 index.html

改變資料夾結構，vite 也必須要做相對應設定，把路徑指向src 裡面

**新增 vite.config.js 檔案**

```jsx
// vite.config.js
// 從 vite 載入 defineConfig 函式
import { defineConfig } from 'vite';

// defineConfig 裡面的設定會替換掉原本 vite 內容
export default defineConfig({
  root: 'src', // 會指向 src/index.html
});
```

### 5. 新增一個 about.html、about.js、about.css，執行 npm run dev 成功，因為 vite 路徑指向 src

![image](https://github.com/user-attachments/assets/6ceae666-9507-4c58-b11f-192feb6fa6c4)

### 6. 打包(compile) npm run build 的時候只有 index.html，沒有 about.html 且打包後資料夾在 src/dist 裡

![image](https://github.com/user-attachments/assets/fcdb9c2d-093b-4521-acf8-1dbfb7b32141)

- 修改 vite.config.js

```jsx
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    rollupOptions: {
      input: {
        // 只有 index 頁面可以使用 main，其他頁面則要按照他的頁面名稱規則新增
        // 新增頁面的 name，然後指向 src/[name].html，build 的時候就會產生相對應的檔案了
        main: resolve(__dirname, 'src/index.html'),
        about: resolve(__dirname, 'src/about.html'),
      },
      output: {
        dir: resolve(__dirname, 'dist'),
      },
    },
  },
});
```

- path：path 是 Node.js 提供的一個 API 把路徑做一個轉換
- resolve：將路徑或相對路徑轉換成絕對路徑(確保在任何不同環境的 server 路徑正確)
- \_\_dirname：是 Node.js 環境變數，當前模組的絕對路徑

### 7. ESLint：在多人共同協做專案時很常會遇到 coding style 不一樣的問題，利用 ESLlint 解決這個問題(程式碼檢查)，ESLint 在 v9 後 API 有 breaking change，要注意 eslint 安裝版本

- 如何指令安裝 ESLint

```bash
npm install eslint vite-plugin-eslint --save-dev

## 向下相容 eslint 版本
npm install eslint@8.57.0 vite-plugin-eslint --save-dev
```

- vite.config.js 加上 vite-plugin-eslint 套件彈窗檢查，只對 JS file 有作用，TS 需要編譯，所以要使用 vite-plugin-checker 處理 TS 和 Lint

```jsx
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  // ...其他設定
  plugins: [eslint()],
});
```

- package.json 加上 npm scripts

```json
{
  "scripts": {
    "lint": "eslint src/**/*.js --fix",
    // "lint": "eslint . --fix", 也可以使用這段, 因為會判斷 ignore
    "lint:check": "eslint src/**/*.js"
  }
}
```

- **ESLint v8 設定**

```jsx
// .eslintrc.cjs, v9 後 .eslintrc.* 設定檔都被棄用，要改 eslint.config.*
module.exports = {
  // 您的 code 在哪些環境中運作，每個環境都帶有一組特定的全域變數
  env: {
    browser: true,
    es2024: true,
    commonjs: true,
    node: true,
  },
  // 額外擴充功能
  extends: [
    'eslint:recommended',
    // 'plugin:prettier/recommended'
  ],
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
```

- **ESLint v8 migrate to v9**

```bash
npm install eslint@latest -D
npx  @eslint/migrate-config .eslintrc.cjs # 會產生 eslint.config.mjs file
npm install globals @eslint/js @eslint/eslintrc -D
```

```jsx
// eslint.config.mjs
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
  ...compat.extends(
    'eslint:recommended',
    // 'plugin:prettier/recommended'
  ),
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
```

- **ESLint v9**

```bash
npm init @eslint/config@latest
```

```jsx
// eslint.config.js
// 在 ESLint v9 中，配置系統發生了重大變化，從原來的 .eslintrc.* 格式改為新的扁平配置系統（Flat Config）
import globals from 'globals';
import pluginJs from '@eslint/js';
// import eslintConfigPrettier from 'eslint-config-prettier';
// import eslintPluginPrettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  pluginJs.configs.recommended,
  // eslintConfigPrettier,
  {
    // 在 Flat Config ignores 是一個特殊的配置，需要在一個獨立的物件中定義，當 ignores 與其他配置混合在一起時，ESLint 可能無法正確處理檔案忽略邏輯
    ignores: ['public', 'dist', 'node_modules', 'src/common'],
  },
  {
    languageOptions: { globals: globals.browser },
    plugins: {
      js: pluginJs, // 不加這個也可以
      // prettier: eslintPluginPrettier,
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
      // 'prettier/prettier': [
      //   'error',
      //   {
      //     tabWidth: 2,
      //     semi: true,
      //     printWidth: 120,
      //     singleQuote: true,
      //     trailingComma: 'all',
      //     endOfLine: 'auto',
      //   },
      // ],
    },
  },
];
```

- .eslintignore file：ESLint 主要是來檢查程式碼的規範，但是執行非常耗開發的執行效能，加上 .eslintignore 會排除不需要檢查規則的檔案或資料夾（預設全專案檢查，**v9 不再支持 .eslintignore，需配置在 eslint.config.js 中的 ignores 屬性裡**）

```json
public
dist
node_modules
```

### 8. ESLint 棄用格式規則：有關格式化的規則要棄用（v8.53.0之後），建議搭配 Prettier，

棄用原因是維護成本太大

[Deprecation of formatting rules - ESLint - Pluggable JavaScript Linter](https://eslint.org/blog/2023/10/deprecating-formatting-rules/#main)

### 9. 使用別人的 ESLint 的配置：例如 airbnb

```bash
npm install eslint-plugin-import --save-dev
npm install eslint-config-airbnb -D
```

```
// .eslintrc.cjs
module.exports = {
  // ....其他設定
  extends: ['airbnb'],
};
```

### 10. Prettier：ESLint 之後的版本取消格式化規則，因此我們必須仰賴其他的套件去處理格式化

- 使用 Prettier VS Code 自帶 exteion 設定
  - extension 中安裝 Prettier
  - VS Code 裡，檔案 > 喜好設定 > 設定 >，打開工作區及打開 json 設定，會在專案下多了一個 .vscode 資料夾，裡面有 settings.json
  ```json
  {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[javascript]": {
      "editor.formatOnSave": true,
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[css]": {
      "editor.formatOnSave": true,
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[html]": {
      "editor.formatOnSave": true,
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescript]": {
      "editor.formatOnSave": true,
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
    // 如果在 ESLint 有設定 Prettier 套件檢查, VScode settings 有關 Prettier 需要移除
    //   "prettier.tabWidth": 2, // 縮進空格數
    //   "prettier.semi": true, // 是否使用分號
    //   "prettier.printWidth": 120, // 設定代碼最佳長度，超過則執行換行
    //   "prettier.singleQuote": true, // 是否使用單引號
    //   "prettier.trailingComma": "all" // 尾部要不要逗號
  }
  ```
- Prettier 本身並沒有檢查程式碼的能力，但可以利用 ESlint 來檢查程式碼是否符合 Prettier 設置的規則

  - 安裝相關套件

  ```bash
  npm install prettier eslint-config-prettier eslint-plugin-prettier -D
  ```

  - 新增 .prettierrc.json

  ```json
  {
    "tabWidth": 2,
    "semi": true,
    "printWidth": 120,
    "singleQuote": true,
    "trailingComma": "all"
  }
  ```

  - 新增 npm scripts

  ```json
  // package.json
  {
    "scripts": {
      // ...其他設定
      "format": "prettier --write src/**/*.js"
    }
  }
  ```

  - 修改 ESlint 設定檔(.eslintrc.\*, ESLint v8 設定)

  ```jsx
  // .eslintrc.cjs
  module.exports = {
    // ....其他設定
    extends: ['plugin:prettier/recommended'],
  };
  ```

  - 修改 ESlint 設定檔(**eslint.config.\*, ESLint v9 設定**)
    在 ESLint v9 中，配置系統發生了重大變化，從原來的 .eslintrc.\* 格式改為新的扁平配置系統(Flat Config)

  ```jsx
  // eslint.config.js
  import eslintConfigPrettier from 'eslint-config-prettier';
  import eslintPluginPrettier from 'eslint-plugin-prettier';

  /** @type {import('eslint').Linter.FlatConfig[]} */
  export default [
    eslintConfigPrettier,
    {
      plugins: {
        prettier: eslintPluginPrettier,
      },
      rules: {
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
  ```

### 11. Prettier 在 ESLint 8 vs 9 前後比較

|           | Prettier                                                                                                                                                                      |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ESLint v8 | v8 中的 extends: ['plugin:prettier/recommended'] 是一個快速配置，會自動設定 添加 Prettier 插件 配置 Prettier 規則 關閉與 Prettier 衝突的 ESLint 規則                          |
| ESlint v9 | v9 中需要更明確地配置這些內容，因為扁平配置系統(Flat Config)不再支援傳統的 extends 方式，我們需要在 rules 中明確配置 prettier/prettier 規則，這就是為什麼需要額外的配置的原因 |

### 12. 最後的最後

ESLint 和 Prettier 其實是兩個獨立的工具
.prettierrc.json 是 Prettier 的配置文件，控制 Prettier 本身的格式化行為
eslint.config.js 中的 'prettier/prettier' 規則是透過 eslint-plugin-prettier 外掛程式來整合 Prettier，這個外掛程式會在 ESLint 執行時呼叫 Prettier 來檢查程式碼

```bash
npm run format  # 使用 .prettierrc.json 的配置
npm run lint    # 使用 eslint.config.js 的配置
```

**參考連結**

[Getting Started | Vite](https://vite.dev/guide/)

[Find and fix problems in your JavaScript code - ESLint - Pluggable JavaScript Linter](https://eslint.org/)

ESLint 規則說明 [Configure Rules - ESLint - Pluggable JavaScript Linter](https://eslint.org/docs/latest/use/configure/rules)

ESLint 所有的規則 [Rules Reference - ESLint - Pluggable JavaScript Linter](https://eslint.org/docs/latest/rules/)
