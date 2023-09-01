<template>
  <div>

  <a-space direction="horizontal" :style="{ width: '100%' }">
    <a-upload  :auto-upload="false" @change="onChange" directory>

      <template #upload-button>
        <a-space>
          <a-button>选择源目录</a-button>
        </a-space>
      </template>


    </a-upload>
  </a-space>


    <!-- 确认按钮 -->
    <div class="confirm-button">
      <arco-button type="primary" @click="handleConfirm">确认</arco-button>
    </div>
  </div>
</template>



<script>
import { reactive,ref,onMounted } from 'vue';
export default {
  setup() {
   const files = ref([]);
   const onChange = (fileList)=> {
      files.value = fileList;
   }

    return {
       files, 
       onChange
    }
  },
}
</script>