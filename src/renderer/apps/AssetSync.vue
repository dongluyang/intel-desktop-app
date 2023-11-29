<template>
  <div class="app-container">
   <a-alert style="margin:10px">点击配置按钮，完成数据同步调度任务</a-alert>

    <a-row class="mb8">
      <a-col :span="2">
        <a-button
          type="primary"
          plain
          @click = "openCron=true"
        >配置</a-button>
      </a-col>

      <a-col :span="10" v-if="status=='inactive'">
        <a-alert type="warning">系统还没生效，请点击配置按钮，配置调度任务！</a-alert>
      </a-col>
    </a-row>

    <a-row class="mb8">
      <a-col :span="10">
        <a-select v-model = "selectedSubProjects" :style="{width:'360px'}" placeholder="请选择同步项目" multiple 
                  :scrollbar="scrollbar">
          <a-option v-for="subproject in projectList" :value="subproject.mainProjectId" :label = "subproject.mainProjectName"></a-option>
        </a-select>

      </a-col>

    </a-row>


    <CrontabResult v-if="crontabValueString!=''" :ex="crontabValueString"></CrontabResult>

    <a-modal  v-model:visible="openCron" width="100%" :footer="footer" >
     <template #title>
      Cron表达式生成器
    </template>
      <crontab @hide="openCron=false" @fill="crontabFill" :expression="crontabValueString"></crontab>
    </a-modal>


  </div>
</template>

<script>
import Crontab from '../components/Crontab/index.vue'
import CrontabResult from '../components/Crontab/result.vue'
import {listSyncOfProjects,getAssetsOfProjectLimit} from '../utils/api'
import { reactive,ref,onMounted } from 'vue';
export default {
    //组件的注册
  components: {
    Crontab,
    CrontabResult
  },
  setup() {


   const openCron = ref(false) 
   const footer = ref(false) 
   const crontabValueString = ref('')
   const status = ref('')
   const projectList = ref([])
   const selectedSubProjects = ref([])
   let subprojects = []
   onMounted(async () => {
    crontabValueString.value = await window.intel_configs.get("cron_expression")
    status.value = await window.rclone.get_status()
    const teamConfig = await window.intel_configs.get("current_team_setting")
      if (teamConfig!=null) {
        const team = JSON.parse(teamConfig)
        listSyncOfProjects(team.id).then(ret=>{
           subprojects = ret.subprojectList
           projectList.value = ret.subprojectList     

      })
      }

})

    /** 确定后回传值 */
    const crontabFill = async (cronExpression)=> {
      crontabValueString.value = cronExpression
      const teamConfig = await window.intel_configs.get("current_team_setting")
      if (teamConfig!=null) {
        const team = JSON.parse(teamConfig)
        const projs =subprojects.filter(subject=>selectedSubProjects.value.includes(subject.mainProjectId))
        const names = projs.map(subject=>subject.subprojectName)
        const projectNames = names.join(',');
        console.log(projectNames)
    
        console.log(projs)
        getAssetsOfProjectLimit(projectNames).then(assets=>{
                 window.rclone.launch_cron_job(cronExpression,projs,assets,team.clientId)
                 status.value = 'active'
        });   
      }
    }

    return {
       openCron, 
       crontabValueString,
       crontabFill,
       footer,
       status,
       projectList,
       selectedSubProjects
    }
  },
}
</script>
<style scoped>
  .mb8{
    align:10px
  }
</style>