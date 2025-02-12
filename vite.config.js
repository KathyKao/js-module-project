import { defineConfig } from 'vite';
import { resolve } from 'path';
import eslint from 'vite-plugin-eslint';

// defineConfig 裡面的設定會替換掉原本 vite 內容
export default defineConfig({
  root: 'src',
  build: {
    rollupOptions: {
      input: {
        // 只有 index 頁面可以使用 main，其他頁面則要按照他的頁面名稱規則新增
        // 新增頁面的 name，然後指向 src/[name].html，build 的時候就會產生相對應的檔案了
        /* eslint-disable no-undef */
        main: resolve(__dirname, 'src/index.html'),
        about: resolve(__dirname, 'src/about.html'),
        /* eslint-enable no-undef */
      },
      output: {
        // eslint-disable-next-line no-undef
        dir: resolve(__dirname, 'dist'),
      },
    },
  },
  plugins: [eslint()],
});
