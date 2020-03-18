<template>
  <div class="playbooks-container pagecontainer">
    <!-- playbook 列表 翻页 -->
    <section>
      <div class="playbook-table">
        <el-table
          :data="playbookTable"
          class="pb-table">
          <el-table-column
            prop="name"
            label="名称"
            min-width="30%">
            <template slot="header" slot-scope="scope">
                   <span style="vertical-align: middle;font-weight: 700;">名称</span>
                   <el-input
                      style="width:calc(100% - 33px);vertical-align: middle;"
                      v-model="search"
                      size="mini"
                      @keyup.13.native='getPlaybookLists'
                      placeholder="请输入名称搜索 "/>
                </template>
                <template slot-scope="scope">
                  {{ scope.row.name }}
                  <div class="desc">{{ scope.row.description }}</div>
                </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            align="center"
            min-width="7%">
            <template slot-scope="scope">
              {{ scope.row.status | playbookStatus }}
            </template>
          </el-table-column>
          <el-table-column
            prop="tags"
            label="标签"
            align="center"
            min-width="15%">
            <template slot-scope="scope">
                <el-tag style="marginRight: 5px;" size="mini" v-for="(tag, index) of scope.row.tags" :key="index">{{ tag }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
            align="center"
            min-width="15%">
            <template slot-scope="scope">
              {{ scope.row.create_time | formatTime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="update_time"
            label="更新时间"
            align="center"
            min-width="15%">
            <template slot-scope="scope">
              {{ scope.row.update_time | formatTime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="version"
            label="版本"
            align="center"
            min-width="10%">
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            min-width="8%">
            <template slot-scope="scope">
              <div class="operate-btn">
                <el-button
                  :disabled='!checkPermission("playbook")'
                  type="text"
                  size="small"
                  @click="runPlaybook(scope.row.id, scope.row.status)"
                >
                  <i :class="scope.row.status ? 'el-icon-video-pause':'el-icon-video-play'"></i> {{ scope.row.status ? '关闭' : '激活' }}
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="handleShowDetail(scope.row.id, scope.row.name)"
                ><i class="el-icon-view"></i> 查看</el-button>
                <el-button
                  :disabled='!checkPermission("playbook")'
                  type="text"
                  size="small"
                  @click="handleEditDetail(scope.row.id, scope.row.name)"
                ><i class="el-icon-edit"></i> 编辑</el-button>
                <el-button
                  :disabled='!checkPermission("playbook")'
                  type="text"
                  size="small"
                  @click="deletePlaybook(scope.row.id)"
                ><i class="el-icon-delete"></i> 删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="playbook-pagination">
        <el-pagination
          background
          @current-change='handleCurrentChange'
          @size-change="handleSizeChange"
          layout="prev, pager, next, total, sizes"
          :current-page.sync="offset"
          :page-size.sync="limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalCount">
        </el-pagination>
      </div>
    </section>
  </div>
</template>

<script>

export default {

  data () {
    return {
      search: '',
      ordering: '',
      playbookTable: [],
      totalCount: 0,
      offset: 1,
      limit: 10,
    }
  },
  activated () {
    this.getPlaybookLists()
  },
  methods: {
    handleToCreate () {
      this.$router.push('/playbooks/create')
      this.$store.dispatch('app/closeSideBar')
    },
    getPlaybookLists () {
      const params = {
        search: this.search,
        ordering: this.ordering,
        offset: this.offset,
        limit: this.limit
      }
      this.$store.dispatch('playbooks/getPlaybookLists', params).then(res => {
        this.playbookTable = res.results
        this.totalCount = res.count
      })
    },
    runPlaybook (id, status) {
      let data = {
        status: !status
      }
      this.$store.dispatch('playbooks/runPlaybook', {id, data}).then(res => {
        if (res.status === 200) {
          this.$message.success(res.data.detail || (!status ? '已成功激活' : '已成功关闭'))
          this.getPlaybookLists()
        }
      })
    },
    deletePlaybook (id) {
      let data = {
        search: this.search,
        ordering: this.ordering
      }
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('playbooks/deletePlaybook', {id, data}).then(() => {
          this.getPlaybookLists()
        })
      })
    },
    handleCurrentChange (offset) {
      this.offset = offset
      this.getPlaybookLists()
    },
    handleSizeChange (limit) {
      this.offset = 1
      this.limit = limit
      this.getPlaybookLists()
    },
    handleShowDetail (pid, name) {
      this.$router.push({name: 'PlaybooksEditor', params: {fn: 'handleView', pid: pid, name: name, mode: 'view'}})
    },
    handleEditDetail (pid, name) {
      this.$router.push({name: 'PlaybooksEditor', params: {fn: 'handleEdit', pid: pid, name: name, mode: 'edit'}})
    },
  },
}
</script>

<style lang='scss' scoped>
.playbooks-container{
  .operate-btn{
    .el-button + .el-button {
      margin-left: 0;
    }
  }
  .dialog-edit-playbook-form{
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
  }
  section{
    background: #fff;
    .pb-table{
      .desc{
        color: #999999;
      }
    }
    .playbook-pagination{
      text-align: center;
      padding: 16px 0;
    }
  }
}
</style>
<style lang="scss">
.playbooks-container{
  .playbook-table .pb-table{
    /deep/ thead.has-gutter tr th:first-child{
      .cell{
        min-width: 200px;
      }
    }
  }
  .el-dialog{
    /deep/ .el-dialog__body{
      padding-bottom: 16px;
      padding-top: 16px;
      padding-right: 50px;
    }
  }
  .event-table{
    /deep/ thead.has-gutter tr th:nth-child(2){
      .cell{
        min-width: 200px;
      }
    }
  }
}
</style>
