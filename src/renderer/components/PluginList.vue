<script setup>
import { ref,onMounted } from "vue";
const plugins = ['Maya2018','Maya2019','Nuke']
onMounted(() => {
})

</script>

<template>
  <div
      :style="{
      boxSizing: 'border-box',
      width: '100%',
      padding: '40px',
      backgroundColor: 'var(--color-fill-2)',
    }"
  >
    <a-row :gutter="20">
      <a-col v-for="name in plugins" :span="8">
        <a-card>
          <template #actions>
            <span class="icon-hover"> <icon-download /> </span>
          </template>
          <template #cover>
            <div
                :style="{
          height: '204px',
          overflow: 'hidden',
        }"
            >
              <img
                  :style="{ width: '100%', transform: 'translateY(-20px)' }"
                  alt="dessert"
                  src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp"
              />
            </div>
          </template>

          <a-card-meta :title="name" description="CGTeam的Maya任务制作插件">
            <template #avatar>
              <div
                  :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }"
              >
                <a-avatar :size="24" :style="{ marginRight: '8px' }">
                  C
                </a-avatar>
                <a-typography-text>CgYun发布</a-typography-text>
              </div>
            </template>
          </a-card-meta>


        </a-card>
      </a-col>
<!--      <a-col :span="8">-->
<!--        <a-card title="Arco Card" :bordered="false" :style="{ width: '100%' }">-->
<!--          <template #extra>-->
<!--            <a-link>More</a-link>-->
<!--          </template>-->
<!--          Card content-->
<!--        </a-card>-->
<!--      </a-col>-->
<!--      <a-col :span="8">-->
<!--        <a-card title="Arco Card" :bordered="false" :style="{ width: '100%' }">-->
<!--          <template #extra>-->
<!--            <a-link>More</a-link>-->
<!--          </template>-->
<!--          Card content-->
<!--        </a-card>-->
<!--      </a-col>-->
    </a-row>
  </div>
</template>
