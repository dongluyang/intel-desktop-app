<script setup>
  import { ref,onMounted } from "vue";
  import {listPluginList} from '../utils/api.js';
  const plugs = ref([

  ])
  const emit = defineEmits(['exceptionTrigger'])
  onMounted(async () => {

listPluginList().then(async(response)=>{
  plugs.value = response
  for (let plugin of plugs.value) {
        const pluginVersion = await window.plugins.get_maya(plugin.name)
        plugin.installedVersion = pluginVersion
        console.log(plugin.installedVersion)
    }
}).catch(exp=>{
      // 触发名为 "messageToParent" 的自定义事件，并传递消息数据
      emit('exceptionTrigger', '401');
})


  })


  function downloadFile(downloadUrl) {

    // 创建下载链接元素
    var downloadLink = document.getElementById('downloadLink');
    downloadLink.href = downloadUrl;

    // 设置下载链接的下载属性和文件名
   // downloadLink.download = 'your-file-name.extension';

    // 模拟点击下载链接
    downloadLink.click();
}
</script>
<template>
<div class="plugin-main" >
    <a-card v-for="plugin in plugs"  :style="{ width: '380px' , margin:'10px 0'}"   hoverable>
      <div class="plugin-item">
        <div class="left">
          <a-image
            width="60"
            height="60"
            :src=plugin.iconUrl
          />
          <div class="text">
            <div class="title">{{plugin.name}}</div>
            <div class="desc">{{plugin.createBy}}</div>      
          </div>
        </div>
        <div class="down-btn">
           <a id="downloadLink" style="display: none;"></a>
          <a-button type="outline" shape="round" @click="downloadFile(plugin.downloadUrl)" v-if="plugin.installedVersion=='-1'">下载</a-button>
           <a-button type="outline" shape="round" @click="downloadFile(plugin.downloadUrl)" v-if="plugin.installedVersion!='-1'" :disabled="plugin.installedVersion!='-1' && plugin.installedVersion=== plugin.v">更新</a-button>
          <div class="state">{{plugin.installedVersion!='-1'?'本地已安装'+plugin.installedVersion:''}}</div>
        </div>

        <!-- 01   添加这一行 -->
        <div class="new-icon" v-if="plugin.installedVersion=='-1' || plugin.installedVersion!= plugin.v" ><img src="../../../resources/new.png" alt=""></div>
        <!-- 以上 -->


      </div>
    </a-card>
  </div>
</template>
<style  scoped >
  .plugin-main{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .plugin-item{
    position: relative;
    min-width: 348px;
    display: flex;
    justify-content: space-between;

    /* 02 添加这个样式 */
    align-items: center;
    /* 以上 */

  }
  /* 03 添加以上样式 */
  .plugin-item .new-icon{
    position: absolute;
    top: -16px;
    right: -16px;
    width: 36px;
  }
  .plugin-item .new-icon img{
    width: 36px;
  }

  .plugin-item .left{
    display: flex;
  }
  .plugin-item .text{
    display: flex;
    height: 60px;
    flex-direction: column;
    justify-content: space-around;  
    margin-left: 20px;
  }
  .plugin-item .title{
    font-size: 18px;
    color: #333;
  } 


  .plugin-main .state{
    font-size: 12px;
    color: #666;
    margin-top: 10px;
  }

</style>

