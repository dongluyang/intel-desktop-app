import { defineConfig } from 'vite';
import vue from "@vitejs/plugin-vue";
// https://vitejs.dev/config
//https://blog.csdn.net/qq_35052138/article/details/114369984
//https://github.com/2582767744/electron-arco-design-pro/blob/main/src/App.vue
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
          'vue': 'vue/dist/vue.esm-bundler.js',
          // 'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
        }
      }
});
