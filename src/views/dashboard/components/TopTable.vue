<template>
  <ul class="top5-list">
    <li v-for="(item, index) of data" :key="index">
      <span class="source">{{ item.key }}</span>
      <span class="counts">{{ item.value }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang='scss' scoped>
.top5-list{
  height: 280px;
  width: 100%;
  padding-top: 20px;
  li{
    border: 1px solid #ddd;
    line-height: 30px;
    box-sizing: border-box;
    font-size: 0;
    border-bottom: 0px solid #000;
    height: 45px;
    &:last-child{
      border-bottom: 1px solid #ddd;
    }
    span{
      display: inline-block;
      font-size: 16px;
      vertical-align: top;
      width: 50%;
      text-indent: 2em;
      height: 100%;
      line-height: 45px;
      &:first-child{
        border-right: 1px solid #ddd;
      }
    }
  }
}
</style>
