<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref,reactive } from "vue";
const keyword = ref('')
const scripts = [
  {title:'Rembg抠像',desc:'CgYun发布',time:'2020-01-01',icon:'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp'},
  ]
const router = useRouter();

const searchByClick = () => {
   window.versions.ping(keyword.value)
}

const doClick = () => {
  router.replace({path:'/rembg'});
}

</script>
<template>
  <a-row>
   <a-input v-model="keyword" style="width:320px;margin-right:10px;margin-bottom:20px" placeholder="请输入关键词" allow-clear />
   <a-button type="primary" @click="searchByClick">搜索</a-button>
   </a-row>
  <a-list :bordered="false">
    <a-list-item v-for="scriptItem in scripts" :key="idx">
      <div class="script-item">
        <div class="left">
          <div class="icon-pic">
            <a-image
            width="60"
            height="60"
            :src=scriptItem.icon
          />
          </div>
          <div class="text">
            <div class="title">{{ scriptItem.title }}</div>
            <div class="desc">{{ scriptItem.desc }}</div>
          </div>
        </div>
        <div class="right">
          <div class="time">{{scriptItem.time}}</div>
          <div class="down-btn">
            <a-button type="outline" shape="round" @click="doClick">打开</a-button>
          </div>
        </div>
      </div>
    </a-list-item>
  </a-list>




</template>
<style scoped>
.script-item{
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 600px;
}
.script-item .left{
  display: flex;
  align-items: center;
}
.script-item .left .text{
  padding-left: 16px;
}
.script-item .left .title{
  font-size: 18px;
  color: #333;
  font-weight: 600;
}
.script-item .left .desc{
  font-size: 14px;
  color: #888;
}
.script-item .right{
  display: flex;
  align-items: center;
}
.script-item .time{
  color: #999;
}
.script-item .down-btn{
  margin-left: 26px;
}
</style>
