<template>
  <div class="app-container">

    <a-row class="mb8">
      <a-col :span="2">
        <a-button
          type="primary"
          plain
          @click = "openCron=true"
        >新增</a-button>
      </a-col>
      <a-col :span="2">
        <a-button
          type="success"
          plain
          icon="el-icon-edit"
        >修改</a-button>
      </a-col>
    </a-row>


    <a-modal  v-model:visible="openCron" width="100%" :footer="footer" >
     <template #title>
      Cron表达式生成器
    </template>
      <crontab @hide="openCron=false" @fill="crontabFill" :expression="expression"></crontab>

      <template #footer>
    </template>
    </a-modal>


  </div>
</template>

<script>
import Crontab from '../components/Crontab/index.vue'
import {listSyncOfProjects} from '../utils/api'
import { reactive,ref,onMounted } from 'vue';
export default {
    //组件的注册
  components: {
    Crontab
  },
  setup() {


   const openCron = ref(false) 
   const footer = ref(false) 
   const expression = ref('')

    /** 确定后回传值 */
    const crontabFill = async (cronExpression)=> {
      const teamConfig = await window.intel_configs.get("current_team_setting")
      if (teamConfig!=null) {
        const team = JSON.parse(teamConfig)
        listSyncOfProjects(team.id).then(ret=>{
           let storageDir = ret.storagePath
           let subprojects = ret.subprojectList
           window.rclone.launch_cron_job(cronExpression,subprojects,storageDir+team.groupName+"/")
      })
      }

    }

    return {
       openCron, 
       expression,
       crontabFill,
       footer
    }
  },
}
</script>
