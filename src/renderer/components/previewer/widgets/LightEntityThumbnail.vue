<template>
<img
  class="thumbnail-picture"
  :style="{
    width: width,
    height: height,
    'max-width': maxWidth,
    'max-height': maxHeight
  }"
  :src="url"
  :key="previewFileId"
  v-if="previewFileId"
/>
<span
  :class="{
    'thumbnail-picture': true,
    'thumbnail-empty': true
  }"
  :style="{
    width: width,
    height: emptyHeight ? emptyHeight : height,
  }"
  v-else>
</span>
</template>



<script>
export default {
  name: 'light-entity-thumbnail',
  functional: true,

  props: {
    previewFileId: {
      default: '',
      type: String
    },
    url:{
      default: '',
      type: String
    },
    width: {
      default: '150px',
      type: String
    },
    height: {
      default: '50px',
      type: String
    },
    maxHeight: {
      default: 'auto',
      type: String
    },
    maxWidth: {
      default: 'auto',
      type: String
    },
    emptyHeight: {
      type: String
    },
    type: {
      default: 'thumbnails',
      type: String
    }
  },
}
</script>

<style lang="scss">
@import '../variables.scss';
.dark .thumbnail-picture {
  background-color: $dark-grey-lighter;
  border-color: $dark-grey-light;
}

span.thumbnail-empty {
  background: $white-grey;
  display: block;
  margin: 0;
}
</style>
