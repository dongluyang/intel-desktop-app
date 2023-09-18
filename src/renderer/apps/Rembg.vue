<template>
  <div>
  <a-space direction="horizontal" size="large" :style="{width: '100%'}">
   <a-form  :style="{width:'600px'}" size="large">
         <a-form-item  label="源目录">
           <a-button id='openBtn' @click="openSrcDirectory" type="primary">  {{srcDir}}</a-button>
         </a-form-item>

         <a-form-item label="存储目录">
           <a-button id='openBtn' @click="openDistDirectory" type="primary" status="success">  {{distDir}}</a-button>
         </a-form-item>

         <a-form-item v-if="loading" >
            <a-spin tip="This may take a while..." v-if="loading" />
         </a-form-item>

        <a-form-item>
         <a-space>
            <a-button @click="rembgExec">提交</a-button>
            <a-button v-if="distDir!='选择存储目录'" @click="openFolder">打开存储目录</a-button>
         </a-space>   
        </a-form-item>

    </a-form>

    <a-table :columns="columns" :data="files" :style="{width:'600px'}">

    <template #action="{ record }">
      <a-button @click="viewImageWithCompare">view</a-button>
    </template>

    </a-table>



  <a-modal v-model:visible="visible" :hide-cancel="true" width="90%">
    <template #title>
      Title
    </template>
      <Image></Image>
  </a-modal>


</a-space>
  </div>
</template>



<script>
import Image from '../components/ImageList.vue'
import { reactive,ref,onMounted } from 'vue';
export default {
    //组件的注册
  components: {
    Image
  },
  setup() {

    const columns = [
      {
        title: '文件名',
        dataIndex: 'name',
      },
      {
        title: '大小',
        dataIndex: 'size',
      },
      {
        title: '操作',
        slotName: 'action'
      },
    ];



   const loading = ref(false) 
   const files = ref([]);
   const srcDir = ref('选择处理目录')
   const distDir = ref('选择存储目录')
   const visible = ref(false)


   const viewImageWithCompare = ()=>{
      visible.value = true
   }



   const openSrcDirectory = async ()=>{
      const ret = await window.files.select_directory()
      srcDir.value = ret.dir
      files.value = ret.files
      console.log(files.value)
   }

   const openDistDirectory = async ()=>{
      const ret = await window.files.select_directory()
      distDir.value = ret.dir
   }

    const rembgExec = async ()=>{
        loading.value = true
        const result = await window.rembg.exec_p(srcDir.value,distDir.value)
        loading.value = false

   }

 const openFolder = async ()=>{
       await window.files.open_directory(distDir.value)

   }


   


    return {
       files, 
       srcDir,
       distDir,
       visible,
       openSrcDirectory,
       openDistDirectory,
       rembgExec,
       columns,
       loading,
       openFolder,
       viewImageWithCompare
    }
  },
}
</script>