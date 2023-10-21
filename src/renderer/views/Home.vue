<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { ref,onMounted,reactive } from "vue";
  import Login from './Login.vue'
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

  onMounted(async () => {
    const defaultConfig = await window.intel_configs.get("user_info")
    if (defaultConfig!=null) {
      const existedUserInfoConfig = JSON.parse(defaultConfig)
      accessToken.value = existedUserInfoConfig.accessToken
      userName.value = existedUserInfoConfig.userName
    }
    router.replace({path:'/pending_tasks'});
    appVersion.value = await window.versions.appVersion()
    console.log(appVersion.value)
  })

  const showLogin = ref(false);
  const showTeamSelect = ref(false);
  const userName = ref('');
  const accessToken = ref('');
  const password = ref('');
  const teamList = ref([]);
  const appVersion = ref('');
  const form = reactive({
        groupId:""
    })

// 事件处理函数
const updateUserName = (input) => {
	userName.value = input;
}

// 事件处理函数
const updatePassword = (input) => {
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

  const onLogout = ()=>{
    window.intel_configs.remove("user_info")
    window.intel_configs.remove("teams_info")
    window.intel_configs.remove("current_team_setting")
    window.location.reload()
  };

  const handleOk = (done) => {
    if (userName.value!='' && password.value!='') {
    login().then(resp=>{
           teamList.value = resp.data.teams
           window.intel_configs.save("teams_info",JSON.stringify(teamList.value))
           accessToken.value = resp.data.accessToken
           window.intel_configs.save("user_info",JSON.stringify({"accessToken":accessToken.value,"userName":userName.value}))
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


  const handleTeamSelectOk = (done) => {
    if (form.groupId!='') {
      const team = teamList.value.find(obj => obj.id === form.groupId);
      window.intel_configs.save("current_team_setting",JSON.stringify(team))
      done(true) 
    } else {
      done(false)
    }
  };


  const handleTeamSelectCancel = () => {
    showTeamSelect.value = false;
  }

  const handleException = (message)=> {
       showLogin.value = true;
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
        <icon-calendar/> 应用中心
      </template>
    </a-tab-pane>

    <a-tab-pane key="4">
      <template #title>
        <icon-clock-circle/> 偏好设置
      </template>
    </a-tab-pane>
   </a-tabs>

   <div class="about-login" v-if="accessToken!=''">
     <div class="user">{{userName}}</div>
     <div class="logOut">
       <a-popconfirm content="你确定要退出吗?" @ok="onLogout">
         <a-button type="primary">退出登录</a-button>
       </a-popconfirm>
     </div>
   </div>

   <div style="padding: 10px;"><router-view @exceptionTrigger="handleException" /></div>

   <a-button v-if="accessToken==''"  type="primary" class="floating-button larger-button" size="medium" @click="openDialog">登录</a-button>
   <a-modal width="100%" v-model:visible="showLogin" :on-before-ok="handleOk" @cancel="handleCancel">
     <template #title>
       登录系统
     </template>
     <Login @updateUserName="updateUserName"  @updatePassword="updatePassword"></Login>
   </a-modal>

   <a-modal width="100%"  v-model:visible="showTeamSelect" :on-before-ok="handleTeamSelectOk" @cancel="handleTeamSelectCancel">
     <template #title>
       选择团队
     </template>
     <a-form :model="form" :style="{width:'600px'}">
      <a-form-item field="groupId" label="团队" validate-trigger="input" required>
        <a-select  v-model="form.groupId" :style="{width:'320px'}" placeholder="请选择团队">
            <a-option v-for="item of teamList" :value="item.id" :label="item.groupName" />
        </a-select>
      </a-form-item>
     </a-form>
   </a-modal>

   <div class="centered-text">{{ $t('version')}}{{appVersion}}</div>


 </div>
</template>

<style scoped>
 /* 使用 CSS 来设置文本样式和居中 */
.centered-text {
      text-align: center; /* 文本水平居中 */
      font-weight: bold;  /* 加粗文本 */
      position: absolute; /* 使用绝对定位 */
      bottom: 0;          /* 放置在底部 */
      width: 100%;        /* 宽度占满整个宽度 */
}
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
.about-login{
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  right: 20px;
}
.about-login .logOut{
  margin-left: 20px;
}
</style>

