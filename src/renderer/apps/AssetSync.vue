<template>
  <div class="app-container">

    <a-row class="mb8">
      <a-col :span="2">
        <a-button
          type="primary"
          plain
          size="mini"
          @click = "openCron=true"
        >新增</a-button>
      </a-col>
      <a-col :span="2">
        <a-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
        >修改</a-button>
      </a-col>
    </a-row>


    <a-modal  v-model:visible="openCron" width="100%">
     <template #title>
      Cron表达式生成器
    </template>
      <crontab @hide="openCron=false" @fill="crontabFill" :expression="expression"></crontab>
    </a-modal>


  </div>
</template>

<script>
import Crontab from '../components/Crontab/index.vue'

import { reactive,ref,onMounted } from 'vue';
export default {
    //组件的注册
  components: {
    Crontab
  },
  setup() {


   const openCron = ref(false) 
   const expression = ref('')

    /** 确定后回传值 */
    const crontabFill = (value)=> {
      
    }

    return {
       openCron, 
       expression,
       crontabFill,
    }
  },
}
</script>
