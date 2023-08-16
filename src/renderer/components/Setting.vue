<template>
  <p>账户信息</p>
  <a-form :model="form" :style="{width:'600px'}" auto-label-width @submit="handleSubmit">
    <a-form-item field="userName" label="用户名">
      <a-input v-model="form.userName" disabled />
    </a-form-item>
    <a-form-item field="password" label="密码">
      <a-input-password v-model="form.password" placeholder="请输入密码" />
    </a-form-item>
    <a-form-item field="confirm_password" label="再次密码">
      <a-input-password v-model="form.confirm_password" placeholder="请再次输入密码" />
    </a-form-item>
    <a-form-item>
      <a-button html-type="submit">提交</a-button>
    </a-form-item>
  </a-form>
  <a-divider />
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
        <a-option value="section one">人鱼精灵</a-option>
        <a-option value="section two">Section Two</a-option>
        <a-option value="section three">Section Three</a-option>
      </a-select>
    </a-form-item>
    <a-form-item>
      <a-button html-type="submit">切换</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { reactive,onMounted  } from 'vue';
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
    })

    const handleSubmit = (data) => {
      console.log(data)
    }

    const saveLocalConfig = ()=>{
           window.intel_configs.save("local_setting",JSON.stringify(storageForm))
    }

    onMounted(async () => {
      const defaultConfig = await window.intel_configs.get("local_setting")
      if (defaultConfig!=null) {
        const existedStorageConfig = JSON.parse(defaultConfig)
        storageForm.assetStorage = existedStorageConfig.assetStorage
        storageForm.projectStorage = existedStorageConfig.projectStorage
      }
     
      console.log(storageForm)
    });

    return {
      form,
      handleSubmit,
      storageForm,
      teamForm,
      saveLocalConfig
    }
  },
}
</script>
