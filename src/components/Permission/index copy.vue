<template>
  <div class="permission-manage">

    <el-tabs v-model="activeName" @tab-click='handleClick'>
        <el-tab-pane v-for='(role, index) of rolelist' :key='index' :label="role.role_name" :name='"pane-" + index'>
          <admin :permissionlist='permissionlist' :roleId='role.id' />
        </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import admin from './admin/admin'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      activeName: 'pane-0'
    }
  },
  props: {
    rolelist: {
      type: Array,
      default: () => []
    },
  },
  components: {
    admin,
  },
  computed: {
    ...mapGetters([
      'permissionlist'
    ])
  },
  watch: {
    permissionlist (val) {
      // console.log(val)
      // console.log('permissionlist changed')
      // console.log(this.permissionlist)
    }
  },
  methods: {
    handleClick ({index}) {},
  },
}
</script>

<style lang="scss" scoped>
.permission-manage{
  /deep/ .el-tabs__nav-scroll{
    background: #fff;
    border: 0;
    border-radius: 0;
  }
  .tab{
    font-size: 0;
    border-bottom: 2px solid #e4e7ed;
    span{
      font-size: 14px;
      display: inline-block;
      padding-right: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
}
</style>
