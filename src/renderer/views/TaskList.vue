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
            <a-button type="text" @click="clickTaskList">
              <template #icon>
                <icon-pen-fill />
              </template>
              <template #default>待我提交</template>
            </a-button>
          </a-menu-item>
          <a-menu-item key="1">
            <a-button type="text" @click="clickCheckList">
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
            <a-select v-model="keyword" :style="{width:'320px'}" placeholder="请选择项目" allow-search allow-clear>
              <a-option v-for="project in data.projects" :value="project.name" :label="project.name" ></a-option>
            </a-select>
            <a-button type="primary" @click="searchTasks">搜索</a-button>
         </a-space>
        <a-alert style="margin:10px">双击下面的任务，会自动开启DCC软件，进入制作</a-alert>
        <a-spin :loading="loading" dot >
            <a-table :columns="columns" :data="data.taskList" @row-dblclick="doubleClickRow">

              <template #action="{ record }">
                <a-button @click="clickTaskRecord(record)">打开</a-button>
              </template>

            </a-table>
        </a-spin>
      </div>
    </a-layout-content>



			<a-drawer 
             :visible="data.reviewVisible" 
             width="100%" 
             :placement="'right'" 
              @ok="data.reviewVisible=false"
              @cancel="data.reviewVisible=false"
             :esc-to-close="false">

          <template #title>
            {{data.currentTask.name}}
          </template>

          <div>
            <taskReview  :task-id="data.currentTask._id" />
          </div>

				
			</a-drawer>




  </a-layout>


</template>

<script>
import { reactive,ref,onMounted } from 'vue';
import request from '../utils/request'
import taskReview from '../components/myCheckin/taskReview.vue'
export default {
  components: {
    taskReview
  },
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
      console.log(row.designTool)
      window.plugins.open(row.designTool)

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
      {
        title: '操作',
        slotName: 'action'
      },
    ];
    const data = reactive({
      list:[],
      projects:[],
      taskList:[],
      reviewVisible:false,
      currentTask:{'name':''}
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
    const keyword = ref('')

    const searchTasks = () => {
        if (keyword.value=='') {
          data.taskList = data.list
        } else {
          data.taskList = data.list.filter(p=>p.projectName==keyword.value)
        }
    }

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
      if (userInfoForm.accessToken!='') {
        getAllProjects().then(ret1 => {
          data.projects = ret1
          getMyAllTasks().then(ret2 => {
            data.list = ret2
            for (let i = 0; i < data.list.length; i++) {
              for (let j = 0; j < data.projects.length; j++) {
                if (data.list[i].projectName === data.projects[j].name) {
                  data.list[i].parentProject = data.projects[j].projectAlias + "(" + data.projects[j].project + ")";
                  break;
                }
              }
            }
            data.taskList = data.list
            loading.value = false
          })
        })
      } else {
        loading.value = false
      }

    });

      const clickTaskList = ()=>{
        getMyAllTasks().then(ret2 => {
            data.list = ret2
            for (let i = 0; i < data.list.length; i++) {
              for (let j = 0; j < data.projects.length; j++) {
                if (data.list[i].projectName === data.projects[j].name) {
                  data.list[i].parentProject = data.projects[j].projectAlias + "(" + data.projects[j].project + ")";
                  break;
                }
              }
            }
            data.taskList = data.list
            loading.value = false
          })
      }


      const clickCheckList = ()=>{
        getMyCheckinTasks().then(ret2 => {
            data.list = ret2
            for (let i = 0; i < data.list.length; i++) {
              for (let j = 0; j < data.projects.length; j++) {
                if (data.list[i].projectName === data.projects[j].name) {
                  data.list[i].parentProject = data.projects[j].projectAlias + "(" + data.projects[j].project + ")";
                  break;
                }
              }
            }
            data.taskList = data.list
            loading.value = false
          })
      }

      const clickTaskRecord = (record)=>{
        data.currentTask = record
        console.log(data.currentTask.name)
        data.reviewVisible = true
      }



       const getMyAllTasks = ()=>{
            const payload = {"user":userInfoForm.userName}
            console.log(apiUrl.value+"/cgteam/cgteam/getMyAllTasks")
            return request.post(apiUrl.value+"/cgteam/cgteam/getMyAllTasks",payload)
       }


       const getMyCheckinTasks = ()=>{
            const payload = {"user":userInfoForm.userName,'status':'work'}
            console.log(apiUrl.value+"/cgteam/cgteam/getMyCheckinTasks")
            return request.post(apiUrl.value+"/cgteam/cgteam/getMyCheckinTasks",payload)
       }


       const getAllProjects = ()=>{
            console.log(apiUrl.value+"/cgteam/cgteam/getAllProjects")
            return request.post(apiUrl.value+"/cgteam/cgteam/getAllProjects",{})
       }



    return {
      columns,
      data,
      loading,
      keyword,
      doubleClickRow,
      clickTaskList,
      clickCheckList,
      clickTaskRecord,
      searchTasks
    }
  },
}
</script>
