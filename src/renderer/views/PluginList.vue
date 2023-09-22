<script setup>
  import { ref,onMounted } from "vue";
  const plugs = ref([
  {title:'Maya2018',desc:'CgYun发布',icon:'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp'},
  {title:'Maya2019',desc:'CgYun发布',icon:'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp'},
  {title:'Nuke',desc:'CgYun发布',icon:'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp'}
  ])
  onMounted(async () => {
    for (let plugin of plugs.value) {
        const pluginVersion = await window.plugins.get_maya(plugin.title)
        plugin.installedVersion = pluginVersion
        console.log(plugin.installedVersion)
    }
  })
</script>
<template>
<div class="plugin-main" >
    <a-card v-for="plugin in plugs"  :style="{ width: '380px' , margin:'10px 0'}"   hoverable>
      <div class="plugin-item">
        <div class="left">
          <a-image
            width="60"
            height="60"
            :src=plugin.icon
          />
          <div class="text">
            <div class="title">{{plugin.title}}</div>
            <div class="desc">{{plugin.desc}}</div>      
          </div>
        </div>
        <div class="down-btn">
          <a-button type="outline" shape="round">下载</a-button>
          <div class="state">{{plugin.installedVersion!='-1'?'本地已安装'+plugin.installedVersion:''}}</div>
        </div>
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
    min-width: 348px;
    display: flex;
    justify-content: space-between;
    align-items: center;
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

