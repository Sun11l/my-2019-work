<template>
  <div>
    <el-input size="small" prefix-icon="el-icon-search" ref='headerSearchSelect' :placeholder="placeholder" :value='search'>
    </el-input>
  </div>
</template>

<script>

export default {
  name: 'HeaderSearch',
  props: {
    placeholder: {
      type: String,
      default: '请输入搜索内容'
    },
    search: {
      type: String,
      default: ''
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
