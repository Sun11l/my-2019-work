<template>
  <div>
    <el-table
      :data="loginlog['results']"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        align="center"
        min-width="10%">
      </el-table-column>
      <el-table-column
        prop="info"
        label="操作记录"
        min-width="50%">
        <template slot-scope="scope">
          用户&nbsp;&nbsp;'<span class="user">{{scope.row.user}}</span>'&nbsp;&nbsp;
          <span>{{scope.row.action}}</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="ip_addr"
          label="登录IP"
          align="center"
          min-width="15%">
      </el-table-column>
      <el-table-column
        prop="action_time"
        label="操作时间"
        align="center"
        min-width="15%">
      </el-table-column>
      <el-table-column
        prop="result"
        label="操作结果"
        align="center"
        min-width="10%">
        <template slot-scope="scope">
          {{scope.row.result === true ? '成功' : '失败'}}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :total="loginlog['count']"
      @current-change='handleCurrentChange'
      @size-change='handleSizeChange'
      :current-page.sync="offset"
      :page-size.sync="limit"
      layout="prev, pager, next, sizes, total"
      :page-sizes="[10, 20, 50, 100]"
      >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    loginlog: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      offset: 1,
      limit: 10
    }
  },
  methods: {
    updateLoginLogs () {
      let params = {
        offset: this.offset,
        limit: this.limit
      }
      this.$store.dispatch('config/getLoginLog', params).then(res => {
        this.emitLoginLog(res.data)
      })
    },
    handleCurrentChange (offset) {
      this.offset = offset
      this.updateLoginLogs()
    },
    handleSizeChange (limit) {
      this.offset = 1
      this.limit = limit
      this.updateLoginLogs()
    },
    emitLoginLog (value) {
      this.$emit('updateLoginList', value)
    }
  },
}
</script>

<style scoped lang='scss'>
.user{
  color: rgb(0, 127, 255);
}
.el-pagination{
    text-align: center;
    padding-top: 16px;
}
</style>
