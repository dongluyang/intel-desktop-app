<template>
  <div class="app-container">
   <a-alert style="margin:10px">点击新建，输入配置，开启代理转发服务</a-alert>

    <a-row class="mb8">
      <a-col :span="2">
        <a-button
          type="primary"
          plain
          @click = "visible=true"
        >新建</a-button>
      </a-col>
    </a-row>

    <a-table :columns="columns" :data="data">

       <template #action="{ record }">
          <a-button type="text" v-if="record.status=='stop'" @click="clickRecord(record)">启动</a-button>
          <a-button type="text" v-if="record.status=='start'" @click="clickRecord(record)">关闭</a-button>
           <a-button type="text" @click="clickRecord(record)">编辑</a-button>
       </template>

    </a-table>

      <a-modal v-model:visible="visible" @cancel="handleCancel" :on-before-ok="start" unmountOnClose>
    <template #title>
      代理配置
    </template>
    <div>
      <a-form :model="form" :style="{ width: '80%' }">
    <a-form-item field="port" tooltip="代理服务监听端口" label="端口">
      <a-input
        v-model="form.port"
        placeholder="请输入端口"
      />
    </a-form-item>
    <a-form-item field="admission" tooltip="控制哪些客户端可以访问" label="控制器">
      <a-input v-model="form.admission" placeholder="请输入准入客户端ip或是网段，多项请逗号隔开" />
    </a-form-item>
  </a-form>
    </div>
  </a-modal>

  </div>
</template>


<script>
import { reactive,ref,onMounted } from 'vue';
export default {
  setup() {

    const columns = [
      {
        title: '端口',
        dataIndex: 'port',
      },
      {
        title: '控制器',
        dataIndex: 'admission',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '操作',
        slotName: 'action'
      },
    ];



   const loading = ref(false) 
   const visible = ref(false) 
   const data = ref([]) 
  
    const form = reactive({
      port: '',
      admission:''
    })
   
   const start = ()=>{
    window.gost.start(form.port,form.admission)
   }

   const clickRecord = (record)=>{
        if (record.status =='start') {
            window.gost.stop(record.pid) 
        } else {
            window.gost.start(record.port,record.admission) 
        }
   }

   onMounted(async () => {
    let proxyInfo= await window.intel_configs.get("proxy_info")
    if (proxyInfo!=null) {
        data.value.push(proxyInfo)
    }
   })

    return {
        form,
        visible,
        columns,
        data,
        start,
        clickRecord
    }
  },
}
</script>