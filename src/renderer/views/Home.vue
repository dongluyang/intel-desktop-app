<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { ref,onMounted } from "vue";
  import Login from '../components/Login.vue'
  import request from '../utils/request'
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
  const showTeamSelect = ref(false);
  const userName = ref('');
  const password = ref('');
  const teamList = ref([]);
  const groupId = ref(null);

// 事件处理函数
const updateUserName = (input) => {
	userName.value = input;
}

// 事件处理函数
const updatePassword = (input) => {
  console.log("ddddddddd")
	password.value = input;
}


   const login = ()=>{

      const payload='userName='+userName.value+'&password='+password.value
      const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      console.log(payload)
      return request.post('http://api.cgyun.cn/system/user/login',payload,{headers:headers}  )
   }

  const openDialog = () => {
    showLogin.value = true;
  };

  const handleOk = (done) => {
    if (userName.value!='' && password.value!='') {
    login().then(resp=>{
           teamList.value = resp.data.teams
           console.log(teamList.value)
           showTeamSelect.value = true
           done(true)
      }).catch(error=>{
        done(false)
      })
    } else {
      done(false)
    }
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
     <p>{{ $t('welcome') }}</p>
    </a-tab-pane>
   </a-tabs>

   <div style="padding: 10px;"><router-view /></div>

   <a-button type="primary" class="floating-button larger-button" size="medium" @click="openDialog">登录</a-button>
   <a-modal v-model:visible="showLogin" :on-before-ok="handleOk" @cancel="handleCancel">
     <template #title>
       登录系统
     </template>
     <Login @updateUserName="updateUserName"  @updatePassword="updatePassword"></Login>
   </a-modal>



   <a-modal v-model:visible="showTeamSelect" :on-before-ok="handleOk" @cancel="handleCancel">
     <template #title>
       选择团队
     </template>
     <a-select  v-model="groupId" :style="{width:'320px'}" placeholder="请选择团队">
         <a-option v-for="item of teamList" :value="item.id" :label="item.groupName" />
     </a-select>
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
