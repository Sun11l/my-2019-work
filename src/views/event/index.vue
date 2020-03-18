<template>
  <div class="event-container pagecontainer">
    <div v-if="$route.name==='Event'">

      <!-- 新建事件 -->
      <el-dialog :modal-append-to-body='false' :visible="addEventDialog" width="50%" :before-close='closeDialog' @close='closeDialog' @closed='closeDialog'>
        <div slot="title" class="dialog-title">
          添加事件
        </div>
        <el-form ref="addEvent" :model="addEvent" label-width="100px" size="small">
          <el-form-item
            label="事件名称"
            prop="name"
            :rules="[{ required: true, message: '事件名称不能为空', trigger: 'blur' }, { max: 128, message: '名称长度过长，请重新输入', trigger: 'blur' }]">
            <el-input v-model="addEvent.name" style="width: 90%;"></el-input>
          </el-form-item>
          <el-form-item
            label="事件描述"
            prop="description">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="addEvent.description"
              style="width: 90%;">
            </el-input>
          </el-form-item>
          <el-form-item
            label="事件等级"
            prop="severity"
            :rules="[{ required: true, message: '事件等级不能为空', trigger: 'change' }]">
            <el-select v-model="addEvent.severity" style="width: 90%;">
              <el-option label="高" value="High"></el-option>
              <el-option label="中" value="Medium"></el-option>
              <el-option label="低" value="Low"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="事件状态"
            prop="status"
            :rules="[{ required: true, message: '事件状态不能为空', trigger: 'blur' }]">
            <el-select v-model="addEvent.status" style="width: 90%;">
              <el-option value="New"></el-option>
              <el-option value="In-Progress"></el-option>
              <el-option value="Closed"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size='small' @click="confirmAddEvent">确定</el-button>
          <el-button size='small' @click="cancelAddEvent">取消</el-button>
        </div>
      </el-dialog>

      <!-- 编辑事件 -->
      <el-dialog :visible.sync='editEventDilaog' width="50%">
        <div slot="title" class="dialog-title">编辑事件</div>
        <div class="dialog-edit-event-form">
          <el-form ref="editForm" :model="editForm" label-width="100px" size="small">
            <el-form-item
              label="事件名称"
              prop="name"
              :rules="[{ required: true, message: '事件名称不能为空', trigger: 'blur' }]">
              <el-input v-model="editForm.name" style="width: 90%;" clearable></el-input>
            </el-form-item>
            <el-form-item
              label="事件描述"
              prop="description">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="editForm.description"
                style="width: 90%;">
              </el-input>
            </el-form-item>
            <el-form-item
              label="事件等级"
              prop="severity"
              :rules="[{ required: true, message: '事件等级不能为空', trigger: 'change' }]">
              <el-select v-model="editForm.severity" style="width: 90%;">
                <el-option label="高" value="High"></el-option>
                <el-option label="中" value="Medium"></el-option>
                <el-option label="低" value="Low"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="事件状态"
              prop="status"
              :rules="[{ required: true, message: '事件状态不能为空', trigger: 'blur' }]">
              <el-select v-model="editForm.status" style="width: 90%;">
                <el-option value="New"></el-option>
                <el-option value="In-Progress"></el-option>
                <el-option value="Closed"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class='dialog-footer'>
          <el-button type="primary" size="small" @click="confirmEditEvent">确定</el-button>
          <el-button size="small" @click="editEventDilaog=false">取消</el-button>
        </div>
      </el-dialog>

      <section class="event-dashboard">
        <el-row>
          <el-col :xs='{span: 18, offset: 3}' :sm='{span: 12, offset: 6}' :lg='{span: 8, offset: 3}'>
              <div class='panel-board'>
                <p class="panel-board-title">事件等级统计 <i @click="resetSeverity" class="el-icon-refresh" style="vertical-align:middle;cursor:pointer"></i></p>
                <el-row class="panel-board-list">
                  <el-col :span="8">
                    <div @click="selectSeverity('high')" class="panel-board-list-item">
                      <h2 :class="{activeColor:changeActive2 === 'high'}">{{ eventFilter.high }}</h2>
                      <p :class="{activeColor:changeActive2 === 'high'}">高</p>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div @click="selectSeverity('medium')" class="panel-board-list-item">
                      <h2 :class="{activeColor:changeActive2 === 'medium'}">{{ eventFilter.medium }}</h2>
                      <p :class="{activeColor:changeActive2 === 'medium'}">中</p>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div @click="selectSeverity('low')" class="panel-board-list-item last">
                      <h2 :class="{activeColor:changeActive2 === 'low'}">{{ eventFilter.low }}</h2>
                      <p :class="{activeColor:changeActive2 === 'low'}">低</p>
                    </div>
                  </el-col>
                </el-row>
              </div>
          </el-col>
          <el-col :xs='{span: 18, offset: 3}' :sm='{span: 12, offset: 6}' :lg='{span: 8, offset: 2}'>
              <div class='panel-board'>
                <p class="panel-board-title">事件状态统计 <i @click="resetStatus" class="el-icon-refresh" style="vertical-align:middle;cursor:pointer"></i></p>
                <el-row class="panel-board-list">
                  <el-col :span="8">
                    <div @click="selectStatus('new')" class="panel-board-list-item">
                      <h2 :class="{activeColor:changeActive === 'new'}">{{ eventFilter.new }}</h2>
                      <p :class="{activeColor:changeActive === 'new'}">新</p>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div @click="selectStatus('in-progress')" class="panel-board-list-item">
                      <h2 :class="{activeColor:changeActive === 'in-progress'}">{{ eventFilter['in-progress'] }}</h2>
                      <p :class="{activeColor:changeActive === 'in-progress'}">进行中</p>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div @click="selectStatus('closed')" class="panel-board-list-item last">
                      <h2 :class="{activeColor:changeActive === 'closed'}">{{ eventFilter.closed }}</h2>
                      <p :class="{activeColor:changeActive === 'closed'}">关闭</p>
                    </div>
                  </el-col>
                </el-row>
              </div>
          </el-col>
        </el-row>
      </section>
      <div class="event-lists">
        <el-table
          :data="eventLists"
          style="width: 100%"
          :row-style="{cursor: 'pointer'}"
          @row-click='goToDetail'
          class="event-table">
          <el-table-column
            prop="name"
            label="名称"
            show-overflow-tooltip
            min-width="25%">
            <template slot="header" slot-scope="scope">
                   <span style="vertical-align: middle;font-weight: 700;">名称</span>
                   <el-input
                      style="width:80%;vertical-align: middle;"
                      v-model="search"
                      size="mini"
                      @keyup.native.enter="getEventsLists"
                      placeholder="请输入名称搜索 "/>
                </template>
                <template slot-scope="scope">
                  <span class="fuck-long-name">
                    {{ scope.row.name }}
                  </span>
                </template>
          </el-table-column>
          <el-table-column
            prop="severity"
            label="等级"
            min-width="7%"
            align="center">
            <template slot-scope="scope">
              <i style="display:inline-block;width:10px;height:8px;" :style="{background: filterSeverityColor(scope.row.severity)}"></i>
              {{ scope.row.severity | filterSeverity }}
            </template>
          </el-table-column>
          <el-table-column
            prop="source"
            label="数据来源"
            align="center"
            min-width="18%">
          </el-table-column>
          <el-table-column
            label="创建时间"
            min-width="15%"
            align="center">
            <template slot-scope="scope">{{ scope.row.created | formatTime }}</template>
          </el-table-column>
          <el-table-column
            label="更新时间"
            min-width="15%"
            align="center">
            <template slot-scope="scope">{{ scope.row.updated | formatTime }}</template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="事件状态"
            align="center"
            min-width="10%">
          </el-table-column>
          <el-table-column
            prop="action"
            label="操作"
            min-width="10%"
            align="center"
            fixed="right">
            <template slot-scope="scope">
                <el-button :disabled='!checkPermission("event")' type="text" size="small" @click="edit(scope)">编辑</el-button>
                <el-button :disabled='!checkPermission("event")' type="text" size="small" @click="remove(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @current-change='handleCurrentChange'
          @size-change="handleSizeChange"
          layout="prev, pager, next, total, sizes"
          :page-sizes="[10, 20, 50, 100]"
          :page-size.sync="limit"
          :current-page.sync="offset"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import Search from '@/components/HeaderSearch'
import { mapGetters } from 'vuex'
export default {
  name: 'Event',
  data () {
    return {
      search: '',
      status: '',
      severity: '',
      activeColor: '',
      changeActive: '',
      changeActive2: '',
      eventFilter: {
        high: 0,
        medium: 0,
        low: 0,
        new: 0,
        'in-progress': 0,
        closed: 0,
      },
      // runPlaybookDialog: false,
      editEventDilaog: false,
      addEvent: {
        name: '',
        description: '',
        severity: '',
        status: '',
        owner: ''
      },
      editForm: {},
      chosePlaybook: {
        selected: ''
      },
      eventLists: [],
      totalCount: 0,
      pbs: [
        { label: '分析钓鱼邮件', value: '1' },
        { label: '系统账号分析与响应', value: '2' }
      ],
      limit: 10,
      offset: 1
    }
  },
  components: {
    Search
  },
  activated () {
    this.getEventsLists()
    this.getEventsCounts()
  },
  computed: {
    ...mapGetters([
      'addEventDialog'
    ]),
  },
  watch: {
    $route (to, from) {
      if (from.path === '/event/index') {
        this.severity = ''
        this.status = ''
        this.search = ''
      }
    }
  },
  methods: {
    formatObjectKeysToLowerCase (object) {
      let obj = {}
      for (let i in object) {
        obj[i.toLowerCase()] = object[i]
      }
      return obj
    },
    selectSeverity (severity) {
      this.offset = 1
      this.severity = severity
      this.getEventsLists()
      this.changeActive2 = severity
    },
    selectStatus (status) {
      this.offset = 1
      this.status = status
      this.getEventsLists()
      this.changeActive = status
    },
    resetStatus () {
      this.offset = 1
      this.status = ''
      this.getEventsLists()
      this.changeActive = ''
    },
    resetSeverity () {
      this.offset = 1
      this.severity = ''
      this.getEventsLists()
      this.changeActive2 = ''
    },
    filterSeverityColor (severity) {
      switch (severity.toLowerCase()) {
        case 'high':
          return '#ff0000'
        case 'medium':
          return '#ffcc33'
        case 'low':
          return '#00cc00'
        default:
          return '#ccc'
      }
    },
    getEventsCounts () {
      this.$store.dispatch('events/getCounts').then(res => {
        if (res.status === 200) {
          // this.eventFilter = this.formatObjectKeysToLowerCase(res.data.event_level_count)
          // this.eventFilter = this.formatObjectKeysToLowerCase(res.data.event_status_count)
          this.eventFilter = res.data
        }
      })
    },
    getEventsLists () {
      let params = {
        limit: this.limit,
        offset: this.offset,
        status: this.status,
        severity: this.severity,
        search: this.search
      }
      this.$store.dispatch('events/getEventsList', params).then(res => {
        const { count, results } = res.data
        this.eventLists = results
        this.totalCount = count
      })
    },
    handleCurrentChange (offset) {
      this.offset = offset
      let params = {
        limit: this.limit,
        offset: this.offset,
        status: this.status,
        severity: this.severity,
        search: this.search
      }
      this.$store.dispatch('events/getEventsList', params).then(res => {
        const { count, results } = res.data
        this.eventLists = results
        this.totalCount = count
      })
    },
    handleSizeChange (limit) {
      this.offset = 1
      this.limit = limit
      let params = {
        limit: this.limit,
        offset: this.offset,
        status: this.status,
        severity: this.severity,
        search: this.search
      }
      this.$store.dispatch('events/getEventsList', params).then(res => {
        const { count, results } = res.data
        this.eventLists = results
        this.totalCount = count
      })
    },
    confirmAddEvent () {
      this.$refs.addEvent.validate((valid) => {
        if (valid) {
          let data = Object.assign({source: 'other'}, this.addEvent)
          this.$store.dispatch('events/addEvent', data).then(res => {
            if (res.status === 201) {
              this.getEventsLists()
              this.getEventsCounts()
              this.closeDialog()
              this.$refs.addEvent.resetFields()
            }
          })
        } else {
          return false
        }
      })
    },
    cancelAddEvent () {
      this.closeDialog()
      this.$refs.addEvent.resetFields()
    },
    confirmChosePlaybook () {
      this.$refs.chosePlaybook.validate(valid => {
        if (!valid) return false
        // 运行逻辑写在这里
      })
    },
    confirmEditEvent () {
      this.$refs.editForm.validate(valid => {
        if (!valid) return false
        let {
          id,
          name,
          severity,
          source,
          status,
          description
        } = this.editForm
        let data = {
          name,
          severity,
          source,
          status,
          description
        }
        this.$store.dispatch('events/editEvent', {id, data}).then(res => {
          if (res.status === 200) {
            this.$message.success('修改成功!')
            this.editEventDilaog = false
            this.getEventsLists()
            this.getEventsCounts()
          }
        })
      })
    },
    goToDetail (row, column) {
      if (column.label === '操作') return false
      this.$router.push({
        path: '/event/index/detail',
        query: {id: row.id}
        // name: 'EventDetail',
        // params: row,
      })
    },
    // run ({row}) {
    //   this.runPlaybookDialog = true
    // },
    edit ({row}) {
      this.editEventDilaog = true
      this.editForm = Object.assign({}, row)
    },
    remove ({row}) {
      let id = row.id
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('events/deleteEvent', id).then(() => {
          this.offset = 1
          this.getEventsLists()
          this.getEventsCounts()
        })
      })
    },
    closeDialog () {
      this.$store.dispatch('bus/closeEventDialog')
    },
  },
}
</script>

<style lang='scss' scoped>
.event-container{
  .event-dashboard{
    background: #fff;
    padding: 0 0 20px;
    margin-bottom: 16px;
    .panel-board{
      background: #f2f2f2;
      border-radius: 5px;
      margin-top: 20px;
      &-title{
        background: #d7d7d7;
        text-align: center;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        font-size: 14px;
        font-weight: 700;
        padding: 8px 0;
      }
      &-list{
        padding: 16px 0;
        overflow: hidden;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
        &-item{
          border-right: 1px solid #bcbcbc;
          text-align: center;
          cursor: pointer;
          h2{
            height: 32px;
            font-weight: 700;
            font-size: 24px;
            padding-bottom: 8px;
          }
          &.last{
            border-right: 0px;
          }
        }
      }
    }
    .activeColor{
      color: red;
    }
  }
  .event-lists{
    background: #fff;
    .el-pagination{
      text-align: center;
      padding: 16px 0;
    }
  }
  .chose-playbook-dialog{
    padding: 0 50px;
    .opt-btn{
      margin-bottom: 5px;
      text-align: center;
    }
  }
}
</style>
<style lang="scss">
.event-container{
  .el-dialog{
    /deep/ .el-dialog__body{
      padding-bottom: 16px;
      padding-top: 16px;;
    }
  }
  .event-table{
    /deep/ thead.has-gutter tr th:nth-child(1){
      .cell{
        min-width: 200px;
      }
    }
  }
}
</style>
