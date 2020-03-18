<template>
  <div>
    <el-dialog :visible.sync="createIndexDialog" width="50%">
      <div class="create-index-form">
          <el-form ref="form" :model="form" size='small' label-width="150px">
              <el-form-item label="索引名称：" prop="index">
                  <el-input v-model="form.index" @blur="getTimeFiled" style="width: 90%;"></el-input>
                  <p>注：允许使用*作为通配符来定义动态索引名称。<br>示例：logstash-*</p>
              </el-form-item>
              <el-form-item label="过滤器字段名称：" prop="filter">
                  <el-select v-model="form.filter" filterable :loading="loading" loading-text='正在加载中...' style="width: 90%;">
                    <el-option v-for="item in timeFiledList" :label="item" :value="item" :key="item"></el-option>
                  </el-select>
                  <p>注：时间过滤器将使用此字段按时间过滤数据。您可以选择不包含时间字段，但无法按时间范围缩小数据范围。</p>
              </el-form-item>
          </el-form>
        </div>
        <div slot="title" class="dialog-title">添加索引</div>
        <div slot="footer" class="dialog-footer">
          <el-button size='small' type="primary" @click="confirmCreateIndex">确 定</el-button>
          <el-button size='small' @click="createIndexDialog = false">取 消</el-button>
        </div>
    </el-dialog>
    <header>
      <el-button v-if="checkPermission('dataconfig')" type="primary" size='small' @click="createIndexDialog=true"><i class="el-icon-plus"></i> 创建索引</el-button>
    </header>
    <section>
      <el-table

        :data='configIndexLists["results"]'>
        <el-table-column prop="index_name" label="索引名称" min-width="25%"></el-table-column>
        <el-table-column prop="field_num" label="字段数" align="center" min-width="20%"></el-table-column>
        <el-table-column prop="time_field" label="事件过滤器字段名称" align="center" min-width="25%"></el-table-column>
        <el-table-column prop="is_default_index" label="默认索引" align="center" min-width="10%">
          <template slot-scope="scope">
            <span>{{ scope.row.is_default_index ? '是':'' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkPermission('dataconfig')"
          label="操作"
          fixed="right"
          align="center"
          min-width="20%">
            <template slot-scope="scope">
                <el-tooltip content="设为默认索引" placement="top" effect='light' :open-delay="200">
                        <svg-icon @click.stop='setDefault(scope.row)' :icon-class="scope.row.is_default_index ? 'collect-solid' : 'collect'" style="margin-right:20px;cursor:pointer" />
                </el-tooltip>
                <el-tooltip content="删除索引" placement="top" effect='light' :open-delay="200">
                        <svg-icon @click.stop='deleteIndex(scope.row)' icon-class="delete-plain" style="cursor:pointer"/>
                </el-tooltip>
            </template>
        </el-table-column>
      </el-table>
    </section>
    <div class="table-footer">
        <el-pagination
          background
          @current-change='handleChangeCurrentPage'
          @size-change='handleSizeChange'
          :current-page.sync="offset"
          :page-size.sync="limit"
          :page-sizes="[10, 20, 50, 100]"
          layout="prev, pager, next, total, sizes"
          :total='configIndexLists["count"]'>
        </el-pagination>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        index: '',
        filter: ''
      },
      sourceIndex: [],
      options: [],
      loading: false,
      timeFiledList: [],
      createIndexDialog: false,
      offset: 1,
      limit: 10
    }
  },
  props: {
    configIndexLists: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    updateConfigIndexLists (offset, limit) {
      this.$emit('updateConfigIndexLists', offset, limit)
    },
    getTimeFiled () {
      let index = this.form.index
      if (!index) return
      let data = {
        index
      }
      this.timeFiledList = []
      this.form.filter = ''
      this.$store.dispatch('config/getLogsTimeField', data).then(res => {
        if (res.status === 201) {
          this.timeFiledList = res.data.result
        } else {
          this.timeFiledList = []
          this.form.filter = ''
        }
      })
    },
    confirmCreateIndex () {
      let data = {
        index_name: this.form.index,
        time_field: this.form.filter
      }
      this.$store.dispatch('config/addLogsConfigIndex', data).then(res => {
        if (res.status === 201) {
          this.$message.success('已成功添加！')
          this.updateConfigIndexLists()
        }
        this.createIndexDialog = false
        this.$refs.form.resetFields()
      })
    },
    setDefault (row) {
      let id = row.id
      let data = {
        is_default_index: !row.is_default_index
      }
      this.$store.dispatch('config/editLogsConfigIndex', {id, data}).then(res => {
        this.updateConfigIndexLists(this.offset, this.limit)
      })
    },
    deleteIndex (row) {
      this.$confirm('此操作将永久删除此条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('config/deleteLogsConfigIndex', row.id)
        this.updateConfigIndexLists(1, this.limit)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleChangeCurrentPage (offset) {
      this.offset = offset
      this.updateConfigIndexLists(this.offset, this.limit)
    },
    handleSizeChange (limit) {
      this.offset = 1
      this.limit = limit
      this.updateConfigIndexLists(this.offset, this.limit)
    },
  }
}
</script>

<style lang='scss' scoped>
section{
  padding: 8px 0;
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
