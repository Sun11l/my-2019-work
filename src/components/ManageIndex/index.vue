<template>
  <div>

    <section>
      <el-table
        :data='lists'>
        <el-table-column prop="index" label="索引名称" min-width="20%"></el-table-column>
        <el-table-column prop="health" label="健康" align="center" min-width="10%"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" min-width="10%"></el-table-column>
        <el-table-column prop="rep" label="分片数" align="center" min-width="10%"></el-table-column>
        <el-table-column prop="pri" label="副本数" align="center" min-width="10%"></el-table-column>
        <el-table-column prop="docscount" label="记录数" align="center" min-width="10%"></el-table-column>
        <el-table-column prop="pristoresize" label="存储大小" align="center" min-width="15%"></el-table-column>
        <el-table-column prop="storesize" label="主存储大小" align="center" min-width="15%"></el-table-column>
      </el-table>
      <div class="table-footer">
        <el-pagination
          background
          @current-change='handleChangeCurrentPage'
          @size-change='handleSizeChange'
          :page-sizes="[10, 20, 50, 100]"
          :current-page.sync="offset"
          :page-size.sync="limit"
          layout="prev, pager, next,total, sizes"
          :total="manageIndexLists['count']">
        </el-pagination>
      </div>
    </section>
  </div>
</template>

<script>
import { slicePage } from '@/utils'
export default {
  props: {
    manageIndexLists: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      offset: 1,
      limit: 10,
    }
  },
  computed: {
    lists (val) {
      return slicePage(this.offset, this.limit, this.manageIndexLists.result)
    }
  },
  methods: {
    getDefaultData () {
      this.$store.dispatch('config/getLogsConfigIndices').then(res => {
        if (res.status === 200) {
          this.$emit('updateManageIndex', res.data)
        }
      })
    },
    setDefaultData () {
      this.lists = slicePage(this.offset, this.limit, this.manageIndexLists.result)
    },
    handleChangeCurrentPage (offset) {
      this.offset = offset
    },
    handleSizeChange (limit) {
      this.offset = 1
      this.limit = limit
    },
  }
}
</script>

<style lang='scss' scoped>
section{
  padding: 8px 0;
  .operator-svg{
    // margin-right: 5px;
  }
  .el-pagination{
    text-align: center;
    padding-top: 16px;
  }
}
</style>
<style lang='scss'>
.logs-container{
  .el-dialog{
    .el-table th{
      background: #fff;
      padding: 4px 0;
      color: #333;
      >.cell{
        font-weight: 900;
      }
    }
  }
}
</style>
