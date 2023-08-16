<script setup>
import { ref,reactive } from "vue";
const keyword = ref('')
const searchByClick = () => {
   window.versions.ping(keyword.value)
}

</script>
<template>
  <div>
  <a-row>
   <a-input v-model="keyword" style="width:320px;margin-right:10px;margin-bottom:10px" placeholder="请输入关键词" allow-clear />
   <a-button type="primary" @click="searchByClick">搜索</a-button>
   </a-row>
  <a-list>
    <a-list-item v-for="idx in 4" :key="idx">
      <a-list-item-meta
          title="Beijing Bytedance Technology Co., Ltd."
          description="Beijing ByteDance Technology Co., Ltd. is an enterprise located in China."
      >
        <template #avatar>
          <a-avatar shape="square">
            <img
                alt="avatar"
                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
            />
          </a-avatar>
        </template>
      </a-list-item-meta>
      <template #actions>
        <icon-edit />
        <icon-delete />
      </template>
    </a-list-item>
  </a-list>
  </div>
</template>
