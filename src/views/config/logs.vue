<template>
  <div class="logs-container pagecontainer">
    <el-tabs v-model="activeName" type="card" @tab-click='handleClick'>
      <el-tab-pane label="配置索引" name="first">
        <div class="tab-content">
          <config-index v-loading='loading' :configIndexLists='configIndexLists' @updateConfigIndexLists='updateConfigIndexLists'/>
        </div>
      </el-tab-pane>
        <el-tab-pane label="管理索引" name="second">
        <div class="tab-content">
          <manage-index v-loading='indicesloading' :manageIndexLists='manageIndexLists' @updateManageIndex='updateManageIndex'/>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import configIndex from '@/components/ConfigIndex'
import manageIndex from '@/components/ManageIndex'
export default {
  components: {
    configIndex,
    manageIndex
  },
  data () {
    return {
      activeName: 'first',
      offset: 1,
      limit: 10,
      configIndexLists: {
        counts: 0,
        results: []
      },
      manageIndexLists: {
        result: [],
        count: 0
      },
      loading: false,
      indicesloading: false
    }
  },
  activated () {
    this.getConfigIndex()
  },
  computed: {},
  methods: {
    handleClick ({index}) {
      if (index === '0') {
        this.getConfigIndex()
      } else if (index === '1') {
        this.getManageIndex()
      }
    },
    getConfigIndex () {
      this.loading = true
      let params = {
        offset: arguments[0] ? arguments[0] : 1,
        limit: arguments[1] ? arguments[1] : 10
      }
      this.$store.dispatch('config/getLogsConfigIndex', params).then(res => {
        if (res.status === 200) {
          this.configIndexLists = res.data
        }
        this.loading = false
      }).catch(e => {
        console.log(e)
        this.loading = false
      })
    },
    getManageIndex () {
      this.indicesloading = true
      this.$store.dispatch('config/getLogsManageIndices').then(res => {
        if (res.status === 200) {
          this.manageIndexLists = res.data
        }
        this.indicesloading = false
      }).catch(e => {
        console.log(e)
        this.indicesloading = false
      })
    },
    updateConfigIndexLists () {
      this.getConfigIndex(arguments[0], arguments[1])
    },
    updateManageIndex () {
      this.getManageIndex(arguments[0], arguments[1])
    },
  }
}
</script>
<style lang="scss" scoped>
.logs-container{
  /deep/ .el-tabs__nav-scroll{
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .tab-content{
    border: 1px solid #ddd;
    background: #fff;
    padding: 10px 20px;
  }
}
</style>
