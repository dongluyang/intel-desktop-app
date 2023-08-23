<template>


  <a-layout>
    <a-layout-sider>
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
            <a-button type="text" @click="clickTasks">
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
    </a-layout-sider>
    <a-layout-content>
      <div style="padding: 10px;">
         <a-space direction="horizontal" size="large" style="margin:10px" >
            <a-select :style="{width:'320px'}" placeholder="请选择项目">
              <a-option>Beijing</a-option>
              <a-option>Shanghai</a-option>
              <a-option>Guangzhou</a-option>
              <a-option disabled>Disabled</a-option>
            </a-select>
            <a-button type="primary">搜索</a-button>
         </a-space>
        <a-alert style="margin:10px">双击下面的任务，会自动开启DCC软件，进入制作</a-alert>
        <a-spin :loading="loading" dot >
            <a-table :columns="columns" :data="data.list" @row-dblclick="doubleClickRow" />
        </a-spin>
      </div>
    </a-layout-content>
  </a-layout>


</template>

<script>
import { reactive,ref,onMounted } from 'vue';
import request from '../utils/request'
export default {
  setup() {
    const doubleClickRow = async (row)=> {
     
     loading.value = true
     let currentProject;

     for (let j=0;j<data.projects.length;j++) {
              if (row.projectName === data.projects[j].name) {
                  currentProject = data.projects[j]
                   break;
               }
           }
      
      const documentPath = await window.envs.getRootDocument()

      window.files.write(documentPath+"\\CGTeam\\CGClientMayaSwap.ini",
      JSON.stringify( 
      {
        "myRootURL":"http://api.cgyun.cn/system/user/login",
        "myProxyURL": "http://cgyun.cn",
        "accessToken": userInfoForm.accessToken,
        "teamInfo":  userInfoForm.team,
        "userName": userInfoForm.userName,
        "assetStorageDir":storageForm.assetStorage,
        "storageDir":storageForm.projectStorage,
         "currentTask":row,
        "currentProject":currentProject,
        "loadFlag":true,
        "textureReadFlag":true,
        "taskTextureFileID":row.textureFileID
      }))      
      window.plugins.open("maya2018")

      loading.value = false
    }
    const columns = [
      {
        title: '任务名',
        dataIndex: 'name',
        ellipsis: true,
        tooltip: true,
        width: 150
      },
      {
        title: '场次名',
        dataIndex: 'projectName',
        width: 150
      },
      {
        title: '项目名',
        dataIndex: 'parentProject',
        ellipsis: true,
        width: 150,
      },
      {
        title: '阶段',
        dataIndex: 'stage',
        ellipsis: true,
        tooltip: {position: 'left'},
        width: 100,
      },
    ];
    const data = reactive({
      list:[],
      projects:[]
    });


    const userInfoForm = reactive({
      userName: '',
      accessToken: '',
      team:''
    })

    const storageForm = reactive({
      assetStorage: '',
      projectStorage: '',
    })

    const apiUrl = ref('')
    const loading = ref(false)
    onMounted(async () => {

      let defaultConfig = await window.intel_configs.get("local_storage_setting")
      if (defaultConfig!=null) {
        const existedStorageConfig = JSON.parse(defaultConfig)
        storageForm.assetStorage = existedStorageConfig.assetStorage
        storageForm.projectStorage = existedStorageConfig.projectStorage
      }



      defaultConfig = await window.intel_configs.get("user_info")
      if (defaultConfig!=null) {
        const existedUserInfoConfig = JSON.parse(defaultConfig)
        userInfoForm.userName = existedUserInfoConfig.userName
        userInfoForm.accessToken = existedUserInfoConfig.accessToken
      }

      const teamConfig = await window.intel_configs.get("current_team_setting")
      if (teamConfig!=null) {
        const existedTeamInfoConfig = JSON.parse(teamConfig)
        userInfoForm.team = existedTeamInfoConfig
        apiUrl.value = existedTeamInfoConfig.apiUrl
      }
      loading.value = true
      getAllProjects().then(ret1=>{
        data.projects = ret1
        getMyAllTasks().then(ret2=>{
           data.list = ret2
           for (let i=0;i<data.list.length;i++) {
                for (let j=0;j<data.projects.length;j++) {
                   if (data.list[i].projectName === data.projects[j].name) {
                     data.list[i].parentProject = data.projects[j].projectAlias+"("+data.projects[j].project+")";
                     break;
                   }
                }
           }
           loading.value = false
      })
      })

    });



       const getMyAllTasks = ()=>{
            const payload = {"user":userInfoForm.userName}
            console.log(apiUrl.value+"/cgteam/cgteam/getMyAllTasks")
            return request.post(apiUrl.value+"/cgteam/cgteam/getMyAllTasks",payload)
       }


       const getAllProjects = ()=>{
            console.log(apiUrl.value+"/cgteam/cgteam/getAllProjects")
            return request.post(apiUrl.value+"/cgteam/cgteam/getAllProjects",{})
       }



    return {
      columns,
      data,
      loading,
      doubleClickRow,
      getMyAllTasks
    }
  },
}
</script>
