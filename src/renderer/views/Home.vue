<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { ref,onMounted } from "vue";
  import Login from '../components/Login.vue'
  const router = useRouter();
  const route = useRoute();
  const clickTasks = () => {
    router.replace({path:'/pending_tasks'});
  }

  const tabChange = (key) => {
    if (key==1) {
      router.replace({path:'/pending_tasks'});
    } else if (key==2) {
      router.replace({path:'/plugins'});
    } else if (key==3) {
      router.replace({path:'/scripts'});
    } else if (key==4) {
      router.replace({path:'/setting'});
    }
  }

  onMounted(() => {
    router.replace({path:'/pending_tasks'});
  })

  const showLogin = ref(false);
  const handleOk = () => {
    showLogin.value = true;
  };
  const handleCancel = () => {
    showLogin.value = false;
  }
</script>

<template>

 <div>
   <!-- 在这里添加按钮并进行右对齐 -->
  <a-tabs @tab-click="tabChange">

    <a-tab-pane key="1">
      <template #title>
        <icon-calendar/> 我的任务
      </template>
    </a-tab-pane>

    <a-tab-pane key="2">
      <template #title>
        <icon-calendar/> 插件市场
      </template>
    </a-tab-pane>

    <a-tab-pane key="3">
      <template #title>
        <icon-calendar/> 应用脚本
      </template>
    </a-tab-pane>

    <a-tab-pane key="4">
      <template #title>
        <icon-clock-circle/> 偏好设置
      </template>
<!--       <p>{{ $t('welcome') }}</p>-->
    </a-tab-pane>
   </a-tabs>

   <div style="padding: 10px;"><router-view /></div>

   <a-button type="primary" class="floating-button larger-button" size="medium" @click="handleOk">登录</a-button>
   <a-modal v-model:visible="showLogin" @ok="handleOk" @cancel="handleCancel">
     <template #title>
       登录系统
     </template>
     <Login></Login>
   </a-modal>
 </div>
</template>

<style scoped>
/* 使用 Flexbox 布局将按钮和 a-tabs 放在同一行并右对齐 */
.tab-container {
  display: flex;
  justify-content: space-between;
  /*align-items: center;*/
}
.floating-button {
  position: absolute;
  bottom: 0;
  right: 0;
}
/* 自定义更大的按钮样式 */
.larger-button {
  font-size: 20px; /* 根据需要调整字体大小 */
  padding: 16px 24px; /* 根据需要调整内边距 */
}
.menu-demo {
  /*box-sizing: border-box;*/
  width: 100%;
  height: 100%;
  padding: 10px;
  /*background-color: var(--color-neutral-2);*/
}
</style>
