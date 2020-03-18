<template>
  <div>
      <el-table
        :data="actionlog['results']"
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
            用户&nbsp;&nbsp;'<span class="user">{{ scope.row.user }}</span>'&nbsp;&nbsp;
            <span>{{ scope.row.method | filterMethods }}</span><span>{{ scope.row.module }}</span>
            &nbsp;&nbsp;'<span class="obj">{{scope.row.obj}}</span>'
          </template>
        </el-table-column>
        <el-table-column
          prop="ip_addr"
          label="操作IP"
          align="center"
          min-width="15%">
        </el-table-column>
        <el-table-column
          prop="time"
          label="操作时间"
          align="center"
          min-width="15%">
          <template slot-scope='scope'>{{fomatUTCString(scope.row.time)}}</template>
        </el-table-column>
        <el-table-column
          prop="result"
          label="操作结果"
          align="center"
          min-width="10%">
          <template slot-scope="scope">
            {{ scope.row.result === true ? '成功' : '失败' }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      background
      layout="prev, pager, next, sizes, total"
      :page-sizes="[10, 20, 50, 100]"
      @current-change='handleChangeCurrentPage'
      @size-change='handleSizeChange'
      :current-page.sync="offset"
      :page-size.sync="limit"
      :total="actionlog['count']">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    actionlog: {
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
    updateActionLog () {
      let params = {
        offset: this.offset,
        limit: this.limit
      }
      this.$store.dispatch('config/getActionLog', params).then(res => {
        this.emitActionLog(res.data)
      })
    },
    handleChangeCurrentPage (offset) {
      this.offset = offset
      this.updateActionLog()
    },
    handleSizeChange (limit) {
      this.offset = 1
      this.limit = limit
      this.updateActionLog()
    },
    emitActionLog (value) {
      this.$emit('updateActionList', value)
    },
    fomatUTCString (utc) {
      return utc.replace(/T/, ' ').split('.')[0]
    }
  },
  filters: {
    filterMethods (method) {
      switch (method) {
        case 'POST':
          return '创建'
        case 'PUT':
          return '更新'
        case 'PATCH':
          return '更新'
        case 'DELETE':
          return '删除'
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.user,.obj{
  color: rgb(0, 127, 255);
}
.el-pagination{
  text-align: center;
  padding-top: 16px;
}
</style>
