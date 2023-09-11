<template>
 <a-config-provider :locale="locale">
    <router-view />
 </a-config-provider>
</template>

<script setup>
import { computed,ref } from 'vue';
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
import useLocale from './hooks/locale';

const { currentLocale } = useLocale();

const locale = computed(() => {
  switch (currentLocale.value) {
    case 'zh-CN':
      return zhCN;
    case 'en-US':
      return enUS;
    default:
      return zhCN;
  }
});
const percentage = ref(0);
const showProgressBar = ref(false);
</script>


<style lang="scss">
.filler {
	width: 100%;
}
.back-color{
	background: #fff;
}

</style>