import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import App from './App.vue';
import '@arco-design/web-vue/dist/arco.css';
import router from './router';

// import {ipcRenderer } from "electron";
// ipcRenderer.on("downloadProgress", (arg, event) => {
//   let component = router.currentRoute.matched[0].instances.default;
//     component.percentage = event.percent;
//     component.showProgressBar = true
// });

import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  legacy: false, // 如果你使用 Composition API（推荐），请将legacy设置为false
  locale: 'zh', // 默认语言环境
  messages: {
    en: {
      hello: 'Hello',
      welcome: 'Welcome to our app!',
    },
    zh: {
      hello: '你好',
      welcome: '欢迎来到我们的应用！',
    },
  },
});


createApp(App).use(i18n).use(router).use(ArcoVue,{}).use(ArcoVueIcon).mount('#app');