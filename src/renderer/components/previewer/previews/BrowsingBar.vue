<template>
<div class="left flexrow">
  <button-simple
    class="flexrow-item"
    icon="left"
    title="上一个"
    @clickEvent="$emit('previous-clicked')"
    v-if="isBigDisplay || !isMovie"
  />

  <div
    class="flexrow-item bar-element current-index"
    title="'文件位置'"
    @click="$emit('current-index-clicked')"
    v-if="isBigDisplay || !isMovie"
  >
    <span>{{ currentIndex }}</span>
    <span v-if="fullScreen || !isMovie"> / {{ previews.length }}</span>
  </div>

  <button-simple
    class="flexrow-item"
    icon="right"
    title="下一个"
    @clickEvent="$emit('next-clicked')"
    v-if="isBigDisplay || !isMovie"
  />

<!--  <button-simple-->
<!--    class="flexrow-item"-->
<!--    icon="plus"-->
<!--    title="添加"-->
<!--    @clickEvent="$emit('add-preview-clicked')"-->
<!--    v-if="(isAssigned || !readOnly) && !fullScreen"-->
<!--  />-->

<!--  <button-simple-->
<!--    class="flexrow-item"-->
<!--    icon="delete"-->
<!--    title="删除"-->
<!--    @clickEvent="$emit('remove-preview-clicked')"-->
<!--    v-if="!readOnly && !fullScreen && !light"-->
<!--  />-->

  <div class="separator" v-if="isBigDisplay">
  </div>
</div>
</template>

<script>
import ButtonSimple from '../widgets/ButtonSimple.vue'

export default {
  name: 'browsing-bar',

  components: {
    ButtonSimple
  },

  props: {
    currentIndex: {
      type: Number,
      default: 0
    },
    fullScreen: {
      type: Boolean,
      default: false
    },
    isAssigned: {
      type: Boolean,
      default: false
    },
    light: {
      type: Boolean,
      default: false
    },
    previews: {
      type: Array,
      default: () => []
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },

  computed: {

    isBigDisplay () {
      return (!this.light || this.fullScreen) && this.previews.length > 1
    },

    isMovie () {
      if (this.previews.length < this.currentIndex) {
        return false
      } else {
        return (this.previews[this.currentIndex - 1].extension === 'mp4'
          ||this.previews[this.currentIndex - 1].extension === 'mov')
      }
    }
  },

  watch: {}
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';
.error {
  margin-top: 1em;
}

.buttons .button {
  background: $dark-grey-2;
  border-radius: 0;
  color: #BBB;
  border: 0;
  margin: 0;
  transition: all 0.3 ease;

  &:first-child {
    border-bottom-left-radius: 5px;
  }

  &:hover {
    border-radius: 5px;
    transform: scale(1.2);
  }
}

.buttons .button.active,
.buttons .button:hover {
  color: #43B581;
}

.bar-element {
  color: $light-grey;
  padding-left: 1em;
}

.current-index {
  cursor: pointer;
}
</style>
