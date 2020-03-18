<template>
  <span :style="{'height': height + 'px' ,'width': width + 'px'}" style="display:inline-block;vertical-align: middle">
    <img :src="src" :alt="alt" :height='height + "px"' :width="width + 'px'">
  </span>
</template>

<script>
export default {
  name: 'wfAvatar',
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: '404'
    },
    height: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
  }
}
</script>

<style>

</style>
