<script setup>
  import { ref,onMounted } from "vue";
  import { defineProps } from 'vue';
  
const { original, processed,images } = defineProps(['original', 'processed','images']);


 // const rightsrc=ref('https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp ');
  const rightsrc = ref(processed)
  const leftsrc = ref(original)
  const clickMyPic=(index)=>{
    console.log(images[index])
    leftsrc.value = images[index].src
    rightsrc.value=images[index].dest
  
  }


    onMounted(() => {
      console.log(images)
  })


  const boxLeft=ref(0)
  const picCurrent=ref(0)
  const clickMybtn=(dir)=>{
    if(dir==='next'){
      if(picCurrent.value < images.length-4 ){
        boxLeft.value-=210;
        picCurrent.value++;
      }else{
        alert('已经是最后一张啦')
      }
    }else{
      if(picCurrent.value > 0 ){
        boxLeft.value+=210;
        picCurrent.value--;
      }else{
        alert('已经是第一张啦')
      }
    }


    // rightsrc=images[index].src
  }
</script>
<template>
  <div class="top-pic">
    <div class="pic left">
      <img :src="leftsrc" alt="">
    </div>
    <div class="pic right">
       <img :src="rightsrc" alt="">
    </div>
  </div>

  <div class="pic-list">
    <div class="move-box">
      <div class="contain" :style="{ left: boxLeft + 'px' }">
        <div @click="clickMyPic(index)" class="pic" v-for=" (image,index) in images">
          <img :src="image.src" alt="">
        </div>
      </div>
    </div>
    <div class="btn-group">
      <div class="pre-btn mybtn" @click="clickMybtn('pre')"><icon-left /></div>
      <div class="next-btn mybtn" @click="clickMybtn('next')"><icon-right /></div>
    </div>
  </div>
 
</template>
<style  scoped >
 .myCanvasClass {width:100%;height:100%}
 .top-pic{
  width:100%;
  display:flex;
  justify-content:space-between;
 }
 .top-pic .pic{
  width: 48%;
  overflow: hidden;
 }
 .top-pic .pic img{
  width: 100%;
  
 }
 .pic-list{
  position: relative;
  padding: 0 30px;
  height: 200px;
  width: 840px;
  margin-top: 30px;
 }
 .pic-list .move-box{
  width: 840px;
  height: 200px;
  overflow: hidden;
  /* background-color: red; */
 }
 .pic-list .contain{
  display: flex;
  position: relative;
  left: 0;
  transition: .3s;
 }
 .pic-list .pic{
  margin-right: 10px;
 }
 .pic-list .pic img{
 width:200px;
 height:200px;
 }
.pic-list .btn-group .mybtn {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 86px;
}
.pic-list .btn-group .pre-btn{
  left: 0;
}
.pic-list .btn-group .next-btn{
  right: 0;
}
.arco-icon { font-size: 24px;color: #999; }

</style>

