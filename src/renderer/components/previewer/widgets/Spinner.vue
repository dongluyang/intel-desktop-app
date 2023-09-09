<template>
<div
  class="has-text-centered"
  :style="sizeStyle"
>
  <square-grid :style="{ margin: 'auto'}" v-if="isProcessing"/>
  <origami :style="{ margin: 'auto'}" v-if="isStylish" />
</div>
</template>

<script>
import Origami from '../spinners/Origami.vue'
import SquareGrid from '../spinners/SquareGrid.vue'

export default {
  name: 'spinner',
  components: {
    SquareGrid,
    Origami
  },

  props: {
    isWhite: {
      type: Boolean,
      default: false
    },
    isProcessing: {
      type: Boolean,
      default: false
    },
    isStylish: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number
    }
  },

  computed: {
    sizeStyle: function () {
      return {
        width: this.size ? this.size + 'px' : 'auto'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
