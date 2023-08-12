<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { ref } from "vue";
  import Login from '../components/Login.vue'
  const router = useRouter();
  const route = useRoute();
  const handleClick2 = () => {
        router.replace({path:'/about'});
   }
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
  <a-tabs>



    <a-tab-pane key="1">
      <template #title>
        <icon-calendar/> 我的任务
      </template>

      <div class="menu-demo">
    <a-menu
      :style="{ width: '200px', height: '100%' }"
      :default-open-keys="['0']"
      :default-selected-keys="['0_2']"
      show-collapse-button
      breakpoint="xl"
      default-collapsed="false"
      @collapse="onCollapse"
    >
      <a-menu-item key="0">
        <a-button type="text">
          <template #icon>
            <icon-pen-fill />
          </template>
          <template #default>待我提交</template>
        </a-button>
      </a-menu-item>
      <a-menu-item key="1">
        <a-button type="text">
          <template #icon>
            <icon-tool />
          </template>
          <template #default>待我审验</template>
        </a-button>
      </a-menu-item>
    </a-menu>
  </div>
    </a-tab-pane>

    <a-tab-pane key="2">
      <template #title>
        <icon-calendar/> 插件市场
      </template>

      <div class="menu-demo">
    <a-menu
      :style="{ width: '200px', height: '100%' }"
      :default-open-keys="['0']"
      :default-selected-keys="['0_2']"
      show-collapse-button
      breakpoint="xl"
      default-collapsed="false"
      @collapse="onCollapse"
    >
      <a-sub-menu key="0">
        <template #icon><icon-apps></icon-apps></template>
        <template #title>Navigation 1</template>
        <a-menu-item key="0_0">Menu 1</a-menu-item>
        <a-menu-item key="0_1">Menu 2</a-menu-item>
        <a-menu-item key="0_2">Menu 3</a-menu-item>
        <a-menu-item key="0_3">Menu 4</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="1">
        <template #icon><icon-bug></icon-bug></template>
        <template #title>Navigation 2</template>
        <a-menu-item key="1_0">Menu 1</a-menu-item>
        <a-menu-item key="1_1">Menu 2</a-menu-item>
        <a-menu-item key="1_2">Menu 3</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="2">
        <template #icon><icon-bulb></icon-bulb></template>
        <template #title>Navigation 3</template>
        <a-menu-item key="2_0">Menu 1</a-menu-item>
        <a-menu-item key="2_1">Menu 2</a-menu-item>
        <a-sub-menu key="2_2" title="Navigation 4">
          <a-menu-item key="2_2_0">Menu 1</a-menu-item>
          <a-menu-item key="2_2_1">Menu 2</a-menu-item>
        </a-sub-menu>
      </a-sub-menu>
    </a-menu>
  </div>
    </a-tab-pane>


    <a-tab-pane key="3">
      <template #title>
        <icon-calendar/> 应用脚本
      </template>

      <div class="menu-demo">
    <a-menu
      :style="{ width: '200px', height: '100%' }"
      :default-open-keys="['0']"
      :default-selected-keys="['0_2']"
      show-collapse-button
      breakpoint="xl"
      default-collapsed="false"
      @collapse="onCollapse"
    >
      <a-sub-menu key="0">
        <template #icon><icon-apps></icon-apps></template>
        <template #title>Navigation 1</template>
        <a-menu-item key="0_0">Menu 1</a-menu-item>
        <a-menu-item key="0_1">Menu 2</a-menu-item>
        <a-menu-item key="0_2">Menu 3</a-menu-item>
        <a-menu-item key="0_3">Menu 4</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="1">
        <template #icon><icon-bug></icon-bug></template>
        <template #title>Navigation 2</template>
        <a-menu-item key="1_0">Menu 1</a-menu-item>
        <a-menu-item key="1_1">Menu 2</a-menu-item>
        <a-menu-item key="1_2">Menu 3</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="2">
        <template #icon><icon-bulb></icon-bulb></template>
        <template #title>Navigation 3</template>
        <a-menu-item key="2_0">Menu 1</a-menu-item>
        <a-menu-item key="2_1">Menu 2</a-menu-item>
        <a-sub-menu key="2_2" title="Navigation 4">
          <a-menu-item key="2_2_0">Menu 1</a-menu-item>
          <a-menu-item key="2_2_1">Menu 2</a-menu-item>
        </a-sub-menu>
      </a-sub-menu>
    </a-menu>
  </div>
    </a-tab-pane>





    <a-tab-pane key="4">
      <template #title>
        <icon-clock-circle/> 偏好设置
      </template>
       <p>{{ $t('welcome') }}</p>
    </a-tab-pane>
  </a-tabs>
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
  box-sizing: border-box;
  width: 100%;
  height: 600px;
  padding: 10px;
  background-color: var(--color-neutral-2);
}
</style>
