<template>
  <div>
   <a-form>
         <a-form-item field="name" label="源目录">
           <a-button id='openBtn' @click="openSrcDirectory" type="primary">  {{srcDir}}</a-button>
         </a-form-item>

         <a-form-item field="name" label="存储目录">
           <a-button id='openBtn' @click="openDistDirectory" type="primary" status="success">  {{distDir}}</a-button>
         </a-form-item>

        <a-form-item>
            <a-button @click="rembgExec">提交</a-button>
        </a-form-item>

    </a-form>
  </div>
</template>



<script>
import { reactive,ref,onMounted } from 'vue';
export default {
  setup() {
   const files = ref([]);
   const srcDir = ref('选择处理目录')
   const distDir = ref('选择存储目录')
   const onChange = (fileList)=> {
      files.value = fileList;
   }


   const openSrcDirectory = async ()=>{
      srcDir.value = await window.files.open_directory()
   }

   const openDistDirectory = async ()=>{
      distDir.value = await window.files.open_directory()
   }

    const rembgExec = async ()=>{
       await window.rembg.exec_p(srcDir.value,distDir.value)
   }


    return {
       files, 
       srcDir,
       distDir,
       openSrcDirectory,
       openDistDirectory,
       rembgExec
    }
  },
}
</script>