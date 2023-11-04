<template>
  <div class="app-container">
   <a-alert style="margin:10px">点击新建，输入配置，开启代理转发服务</a-alert>

    <a-row class="mb8">
      <a-col :span="2">
        <a-button
          type="primary"
          plain
          @click = "openNew"
        >新建</a-button>
      </a-col>
    </a-row>

    <a-table :columns="columns" :data="data">

       <template #action="{ record }">
         <a-popconfirm content="你确定要启动服务吗?" @ok="clickRecord(record)">
          <a-button type="text" v-if="record.status=='stop'">启动</a-button>
         </a-popconfirm>
         <a-popconfirm content="你确定要关闭服务吗?" @ok="clickRecord(record)">
          <a-button type="text" v-if="record.status=='start'">关闭</a-button>
          </a-popconfirm>

         <a-popconfirm content="你确定要删除服务吗?" @ok="deleteRecord(record)">
          <a-button type="text">删除</a-button>
          </a-popconfirm>

           <a-button type="text" @click="editRecord(record)">编辑</a-button>
       </template>

    </a-table>

      <a-modal v-model:visible="visible" @cancel="handleCancel" :on-before-ok="updateRecord" unmountOnClose>
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

    <a-form-item field="desc"  label="描述">
      <a-textarea  v-model="form.desc" placeholder="请输入描述" />
    </a-form-item>
  </a-form>
    </div>
  </a-modal>

  </div>
</template>


<script>
import { reactive,ref,onMounted } from 'vue';
import { Message } from '@arco-design/web-vue';
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
        title: '描述',
        dataIndex: 'desc',
      },
      {
        title: '操作',
        slotName: 'action'
      },
    ];



   const visible = ref(false) 
   const data = ref([]) 
   let currentRecord = null
    const form = reactive({
      port: '',
      admission:'',
      desc:''
    })
   

    const updateRecord = async()=>{
     if (currentRecord!=null && currentRecord.status=='start') {
         window.gost.stop(form.port) 
         currentRecord.port = form.port
         currentRecord.admission = form.admission
         currentRecord.desc = form.desc
         currentRecord.status = "stop"
     }

     let proxyInfos= await window.intel_configs.get("proxy_infos")
     if (proxyInfos==null) {
        proxyInfos = []
     } 

     let isNew = true
     for (let proxyInfo of proxyInfos) {
         if (proxyInfo.port == form.port) {
            proxyInfo.admission = form.admission
            proxyInfo.desc = form.desc
            proxyInfo.pid = -1
            proxyInfo.status = 'stop'
            isNew = false
         }
     }

     if (isNew) {
        proxyInfos.push({"port":form.port,"admission":form.admission,"pid":-1,"status":"stop","desc":form.desc})
     }
     data.value = proxyInfos
     await window.intel_configs.save("proxy_infos",proxyInfos)

     visible.value =false
   }

   const clickRecord = (record)=>{
        if (record.status =='start') {
            window.gost.stop(record.port)
            record.status = "stop" 
        } else {
            window.gost.start(record.port,record.admission) 
            record.status = "start" 
        }

   }

   const editRecord = async (record)=>{
     visible.value = true
     form.port = record.port
     form.admission = record.admission
     form.desc = record.desc
     currentRecord = record
   }

   const deleteRecord = async (record)=>{
        if (record.status =='start') {
          Message.error('请先关闭服务!')
        } else {
            data.value = await window.gost.delete(record.port) 
        }

   }

   
   const openNew =  ()=>{
     visible.value = true
     currentRecord = null
   }


   onMounted(async () => {
    let proxyInfos= await window.intel_configs.get("proxy_infos")
    console.log(proxyInfos)
    if (proxyInfos!=null) {
        data.value = proxyInfos
    }
   })

    return {
        form,
        visible,
        columns,
        data,
        openNew,
        updateRecord,
        clickRecord,
        editRecord,
        deleteRecord
    }
  },
}
</script>