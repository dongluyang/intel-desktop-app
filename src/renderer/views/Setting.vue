<template>
  <p>本地存储</p>
  <a-form :model="storageForm" :style="{width:'600px'}" auto-label-width @submit="handleSubmit">
    <a-form-item field="assetStorage" label="资产地址">
      <a-input v-model="storageForm.assetStorage" placeholder="请输入资产本地存储地址" />
    </a-form-item>
    <a-form-item field="projectStorage" label="项目地址">
      <a-input v-model="storageForm.projectStorage" placeholder="请输入项目本地存储地址" />
    </a-form-item>
    <a-form-item>
      <a-button @click="saveLocalConfig">提交</a-button>
    </a-form-item>
  </a-form>
  <a-divider />
  <p>团队信息</p>
  <a-form :model="teamForm" :style="{width:'600px'}" auto-label-width @submit="handleSubmit">
    <a-form-item field="groupId" label="团队">
      <a-select v-model="teamForm.groupId" placeholder="请选择团队" allow-clear>
        <a-option v-for="item of teamForm.teams" :value="item.id" :label="item.groupName" />
      </a-select>
    </a-form-item>
    <a-form-item>
      <a-button @click="handleTeamSelectOk">切换</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { reactive,onMounted  } from 'vue';
import {listSyncOfProjects} from '../utils/api'
export default {
  setup() {
    const form = reactive({
      userName: 'dongluyang',
      password: '',
      confirm_password: '',
    })
    const storageForm = reactive({
      assetStorage: '',
      projectStorage: '',
    })
    const teamForm = reactive({
      groupId: '',
      teams:[]
    })

    const handleSubmit = (data) => {
      console.log(data)
    }


  const handleTeamSelectOk = async () => {

    if (teamForm.groupId!='') {
      const team = teamForm.teams.find(obj => obj.id === teamForm.groupId);
      window.intel_configs.save("current_team_setting",JSON.stringify(team))
    }
  };

    const saveLocalConfig = ()=>{
           window.intel_configs.save("local_storage_setting",JSON.stringify(storageForm))
    }

    onMounted(async () => {
      const defaultConfig = await window.intel_configs.get("local_storage_setting")
      if (defaultConfig!=null) {
        const existedStorageConfig = JSON.parse(defaultConfig)
        storageForm.assetStorage = existedStorageConfig.assetStorage
        storageForm.projectStorage = existedStorageConfig.projectStorage
      }
     
      const teamsConfig = await window.intel_configs.get("teams_info")

      if (teamsConfig!=null) {
       teamForm.teams = JSON.parse(teamsConfig)
      }


      const currentTeamConfig = await window.intel_configs.get("current_team_setting")

      if (currentTeamConfig!=null) {
       teamForm.groupId = JSON.parse(currentTeamConfig).id
      }


    });

    return {
      form,
      handleSubmit,
      storageForm,
      teamForm,
      saveLocalConfig,
      handleTeamSelectOk
    }
  },
}
</script>
