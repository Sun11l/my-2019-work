<template>
  <div class="event-detail-container">
      <div class="base-info" v-loading='loading'>
          <div class="base-info-title">基本信息</div>
          <div class="base-info-list">
              <el-row class="line">
                <el-col :xl="12" :lg="12" :md='24' :xs='24'>
                  <div class="label fl" style="">
                      <span>事件名称：</span>
                    </div>
                  <div class="content">
                    <span>{{ baseInfo.name }}</span>
                  </div>
                </el-col>

                <el-col :xl="12" :lg="12" :md='24' :xs='24'>
                  <div class="label fl" style="">
                      <span>所属用户：</span>
                    </div>
                  <div class="content">
                    <span>{{ baseInfo.owner }}</span>
                  </div>
                </el-col>
              </el-row>
              <el-row class="line">

                <el-col :xl="12" :lg="12" :md='24' :xs='24'>
                  <div class="label fl" style="">
                      <span>事件状态：</span>
                    </div>
                  <div class="content">
                    <span>{{ baseInfo.status }}</span>
                    <el-tooltip content="" placement="right" effect='light' :open-delay='500'>
                      <div slot="content">{{ baseInfo.status | describeStatus }}</div>
                      <svg-icon icon-class="question"  class-name='question-svg'/>
                    </el-tooltip>
                  </div>
                </el-col>

                <el-col :xl="12" :lg="12" :md='24' :xs='24'>
                  <el-row>
                    <div class="label fl">
                      <span>工作流：</span>
                    </div>
                    <div class="content">
                      <span>
                        <el-tag size="small" v-for="(pb, idx) of baseInfo.playbookname" :key="idx">{{ pb }}</el-tag>
                      </span>
                    </div>
                  </el-row>
                </el-col>
              </el-row>
              <el-row class="line">
                <el-col :xl="12" :lg="12" :md='24' :xs='24'>
                  <div class="label fl" style="">
                      <span>事件等级：</span>
                    </div>
                  <div class="content">
                    <span><i style="display:inline-block;width:10px;height:8px;" :style="{background: filterSeverityColor(baseInfo.severity)}"></i>
                    {{ baseInfo.severity | filterSeverity }}</span>
                  </div>
                </el-col>

                <el-col :xl="12" :lg="12" :md='24' :xs='24'>
                    <div class="label fl" style="">
                      <span>运行次数：</span>
                    </div>
                    <div class="content">
                      <span>{{ baseInfo.total }}</span>
                    </div>
                </el-col>
              </el-row>
              <el-row class="line">
                <el-col :xl="12" :lg="12" :md='24' :xs='24'>
                  <div class="label fl" style="">
                      <span>数据来源：</span>
                    </div>
                    <div class="content">
                      <span>{{ baseInfo.source }}</span>
                    </div>
                </el-col>

                <el-col :xl="12" :lg="12" :md='24' :xs='24'>
                  <div class="label fl" style="">
                      <span>创建时间：</span>
                    </div>
                    <div class="content">
                      <span>{{ baseInfo.created | formatTime }}</span>
                    </div>
                </el-col>
              </el-row>
              <el-row class="line">
                <el-col :xl="12" :lg="12" :md='24' :xs='24'>
                  <div class="label fl" style="">
                      <span>事件描述：</span>
                    </div>
                    <div class="content">
                      <span>{{ baseInfo.description }}</span>
                    </div>
                </el-col>

                <el-col :xl="12" :lg="12" :md='24' :xs='24'>
                  <div class="label fl" style="">
                      <span>更新时间：</span>
                    </div>
                    <div class="content">
                      <span>{{ baseInfo.updated | formatTime }}</span>
                    </div>
                </el-col>
              </el-row>
          </div>
      </div>

      <div class="primary-info">
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="运行信息" name="first">
            <div class="tab-content" v-loading='loading'>
              <!-- <div class="playbook-preview">这是ID为{{ visiblePlaybooks }}的预览图</div> -->
              <!-- <div class="playbook-preview">暂未支持预览</div> -->
              <div class="playbook-preview">
                <Coa v-on:coaValue="coaValue" :pids='visiblePlaybooks' ref="coa"/>
            </div>
              <div class="playbook-lists">
                <el-table
                  :data="runinfoTable"
                  style="width: 100%"
                  @row-click='handleClick'
                  :row-style='{cursor: "pointer"}'>
                  <el-table-column
                    prop="name"
                    label="工作流名称"
                    min-width='35%'>
                  </el-table-column>
                  <el-table-column
                    prop="nodeNumber"
                    label="节点数"
                    align="center"
                    min-width='12%'>
                  </el-table-column>
                  <el-table-column
                    prop="status"
                    label="当前状态"
                    align="center"
                    min-width='13%'>
                    <template slot-scope="scope">{{scope.row.status ? '关闭' : '失败'}}</template>
                  </el-table-column>
                  <el-table-column
                    prop="startTime"
                    label="开始时间"
                    align="center"
                    min-width='20%'>
                    <template slot-scope="scope">{{scope.row.startTime | formatTime()}}</template>
                  </el-table-column>
                  <el-table-column
                    prop="finishTime"
                    label="结束时间"
                    align="center"
                    min-width='20%'>
                    <template slot-scope="scope">{{scope.row.finishTime | formatTime()}}</template>
                  </el-table-column>
                </el-table>
              </div>
                <el-pagination
                    background
                    layout="prev, pager, next, total, sizes"
                    :total="runinfoSource?runinfoSource.length:0"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="10"
                    @current-change='handlePlaybookCurrentChange'
                    @size-change='handlePlaybookSizeChange'
                    style="text-align:center;padding-top:16px;">
                </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="`关联事件(${relatedSource ? relatedSource.length:0})`" name="second">
            <div class="tab-content" v-loading='loading'>

              <!-- 添加关联事件 -->
              <el-dialog :visible.sync='relatedEventsDialog'>
                <div slot="title" class="dialog-title">添加关联事件</div>
                <div class="dialog-related-events-form">
                  <el-form :model='addRelatedEventsForm' ref="addDataMapForm" label-width='120px' size='small'>
                    <el-form-item
                      label='名称'
                      prop="name">
                      <el-input readonly v-model='baseInfo.name'></el-input>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="dialog-related-events-table">
                  <el-table size="mini" :data="addRelatedEventsForm.data" highlight-current-row>
                    <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.field" :label="column.title">
                        <template slot-scope="scope">

                            <span v-if="column.title === 'CEF字段'">
                                <el-select filterable allow-create v-model="scope.row.cef" size="mini" @visible-change='getCefFieldLists' @change="selectCef">
                                  <el-option v-for="(cef, index) of cefFields" :key="index" :value='cef'>
                                  </el-option>
                                </el-select>
                            </span>
                            <span v-else-if="column.title === 'VALUE'">
                              <el-input v-model="scope.row.value" size="mini"></el-input>
                            </span>

                        </template>
                    </el-table-column>
                    <el-table-column width="100">
                        <template slot-scope="scope">
                            <span class="el-tag el-icon-close el-tag--danger el-tag--mini" @click="deleteRow(scope.row, scope.$index)" style="cursor: pointer;"></span>
                        </template>
                    </el-table-column>
                  </el-table>
                  <div class="el-table-add-row" @click="addCefField"><span>+ 添加CEF字段</span></div>
                </div>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" size='small' @click="confirmAddRelatedEvent">确定</el-button>
                  <el-button size='small' @click="relatedEventsDialog=false">取消</el-button>
                </div>
              </el-dialog>

              <!-- run playbook -->
              <el-dialog :visible.sync="runPlaybookDialog">
                <div slot="title" class="dialog-title">选择工作流</div>
                <div class="dialog-chose-playbook-form">
                  <el-form :model='runPlaybookForm' :rules='runPlaybookRules' ref="runPlaybookForm" label-width='120px' size='small'>

                    <el-form-item prop='playbook' label="工作流">
                      <el-select v-model="runPlaybookForm.playbook">
                        <el-option v-for="playbook of playbookLists" :key="playbook.id" :label="playbook.name" :value="playbook.id"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item prop='mode' label="执行方式">
                      <el-select v-model="runPlaybookForm.mode" @change="selectRunPlaybookMethod">
                        <el-option label="立即运行" :value="0"></el-option>
                        <el-option label="周期运行" :value="1"></el-option>
                        <el-option label="定时运行" :value="2"></el-option>
                      </el-select>
                    </el-form-item>
                    <div class="dialog-run-action-form-select" v-if="runPlaybookForm.mode">

                      <el-form-item prop="taskName" label="任务名称">
                          <el-input v-model="runPlaybookForm.taskName"></el-input>
                      </el-form-item>

                      <el-form-item prop="description" label="任务描述">
                          <el-input type="textarea" :rows="3" v-model="runPlaybookForm.description"></el-input>
                      </el-form-item>

                      <el-form-item v-if="runPlaybookForm.mode === 1" prop='period' label='计划时间'>
                        <el-row :gutter='5' style="margin: 0;">
                          <el-col :span="6" style="padding-left:0">
                            <el-select v-model="runPlaybookForm.period" placeholder="请选择">
                              <el-option label="天" value="days"></el-option>
                              <el-option label="小时" value="hours"></el-option>
                              <el-option label="分" value="minutes"></el-option>
                              <el-option label="秒" value="seconds"></el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="6">
                            <el-input-number style="width: 100%;" :min='0' v-model="runPlaybookForm.number"></el-input-number>
                          </el-col>
                        </el-row>
                      </el-form-item>

                      <el-form-item v-if="runPlaybookForm.mode === 2" prop='timing' label='开始时间'>

                        <el-row :gutter="20">
                          <el-col :span="4" style="padding-left:0">
                            <el-select filterable v-model="runPlaybookForm.month">
                              <el-option v-for="(month, index) in 12" :key="index" :label="month + ' 月'" :value="month"></el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="4">
                            <el-select filterable v-model="runPlaybookForm.date">
                              <el-option v-for="(date, index) in 31" :key="index" :label="date + ' 日'" :value="date"></el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="4">
                            <el-select filterable v-model="runPlaybookForm.hour">
                              <el-option v-for="(hour, index) in 24" :key="index" :label="index + ' 时'" :value="index"></el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="4">
                            <el-select filterable v-model="runPlaybookForm.minute">
                              <el-option v-for="(minute, index) in 60" :key="index" :label="minute + ' 分'" :value="minute"></el-option>
                            </el-select>
                          </el-col>
                        </el-row>

                      </el-form-item>
                    </div>

                  </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" size='small' @click="confirmRunPlaybook">确定</el-button>
                  <el-button size='small' @click="runPlaybookDialog=false">取消</el-button>
                </div>
              </el-dialog>

              <!-- run action  -->
              <el-dialog :visible.sync="runActionsDialog">
                <div slot="title" class="dialog-title">运行Action</div>
                <div class="dialog-run-action-form">
                  <el-form :model="runActionForm" :rules='runActionFormRules' ref="runActionForm" label-width='120px' size='small'>
                    <el-form-item prop='app' label="App">
                      <el-select v-model="runActionForm.app" @change="selectApp">
                        <el-option v-for="app of actionApp" :key="app.id" :label="app.name" :value="app.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop='action' label="Action" v-if="runActionForm.app">
                        <el-select v-model="runActionForm.action" @change="selectAction">
                          <el-option v-for="(act, index) of action" :key="index" :label="act.name" :value="act.name">
                            <span style="float: left">{{ act.name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 12px">{{ act.description }}</span>
                          </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop='parameter' label="Parameter" v-if="runActionForm.app && runActionForm.action && parameters && parameters.length">
                        <el-row :gutter="10" v-for="(label, index) of parameters" :key="index" style="margin:0;">
                          <el-col :span="6">
                              <el-input v-model="label.name"></el-input>
                          </el-col>
                          <el-col :span="18">
                            <el-select filterable allow-create default-first-option v-model="runActionForm.parameter[index]">
                              <el-option v-for="(value, index) of artifacts" :value="'FIELD.' + value" :key="index"></el-option>
                            </el-select>
                          </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item prop='mode' label="执行方式">
                      <el-select v-model="runActionForm.mode" @change="selectMethod">
                        <el-option label="立即运行" :value="0"></el-option>
                        <el-option label="周期运行" :value="1"></el-option>
                        <el-option label="定时运行" :value="2"></el-option>
                      </el-select>
                    </el-form-item>
                    <div class="dialog-run-action-form-select" v-if="runActionForm.mode">

                      <el-form-item prop="taskName" label="任务名称">
                          <el-input v-model="runActionForm.taskName"></el-input>
                      </el-form-item>

                      <el-form-item prop="description" label="任务描述">
                          <el-input type="textarea" :rows="3" v-model="runActionForm.description"></el-input>
                      </el-form-item>

                      <el-form-item v-if="runActionForm.mode === 1" prop='period' label='计划时间'>
                        <el-row :gutter='5' style="margin: 0;">
                          <el-col :span="6" style="padding-left:0">
                            <el-select v-model="runActionForm.period" placeholder="请选择">
                              <el-option label="天" value="days"></el-option>
                              <el-option label="小时" value="hours"></el-option>
                              <el-option label="分" value="minutes"></el-option>
                              <el-option label="秒" value="seconds"></el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="6">
                            <el-input-number style="width: 100%;" :min='0' v-model="runActionForm.number"></el-input-number>
                          </el-col>
                        </el-row>
                      </el-form-item>

                      <el-form-item v-if="runActionForm.mode === 2" prop='timing' label='开始时间'>
                        <!-- <el-date-picker
                          v-model="runActionForm.time"
                          type="datetime"
                          placeholder="选择日期时间"
                          style="width:100%;">
                        </el-date-picker> -->

                        <el-row :gutter="20" style="margin: 0;">
                          <el-col :span="4" style="padding-left:0">
                            <el-select filterable v-model="runActionForm.month">
                              <el-option v-for="(month, index) in 12" :key="index" :label="month + ' 月'" :value="month"></el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="4">
                            <el-select filterable v-model="runActionForm.date">
                              <el-option v-for="(date, index) in 31" :key="index" :label="date + ' 日'" :value="date"></el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="4">
                            <el-select filterable v-model="runActionForm.hour">
                              <el-option v-for="(hour, index) in 24" :key="index" :label="index + ' 时'" :value="index"></el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="4">
                            <el-select filterable v-model="runActionForm.minute">
                              <el-option v-for="(minute, index) in 60" :key="index" :label="minute + ' 分'" :value="minute"></el-option>
                            </el-select>
                          </el-col>
                        </el-row>

                      </el-form-item>
                    </div>
                  </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" size='small' @click="comfirmRunAction">确定</el-button>
                  <el-button size='small' @click="runActionsDialog=false">取消</el-button>
                </div>
              </el-dialog>

              <div class="artifact-header">
                <el-button type="primary"  v-if="checkPermission('event')" size="small" @click="addRelatedEvents">添加关联事件</el-button>
              </div>
              <el-collapse accordion>
                  <el-collapse-item v-for="(related, relatedIndex) of relatedTable" :key="relatedIndex">
                    <template slot="title">
                      <div class="collapse-title">
                        <span class="title id"><i class="el-icon-d-arrow-right arrow-icon" style="font-weight: 700;">
                        </i> ID:{{related.id}}</span>
                        <span class="title name">{{ related.name }}</span>
                        <span class="title time">{{ related.time | formatTime }}</span>
                      </div>
                    </template>
                    <div class="content">
                      <table class='content-table'>
                        <template v-for="(value, key, index) of related.cef">
                          <tr :key="index">
                            <td>{{ key }}</td>
                            <td>{{ value }}</td>
                          </tr>
                        </template>
                      </table>
                      <div class='content-btn' v-if="checkPermission('event')">
                        <el-button plain size="small" @click="runPlaybook(related.id)">运行Playbook</el-button>
                        <el-button plain size="small" @click="runAction(related.id)">运行Action</el-button>
                      </div>

                    </div>
                  </el-collapse-item>
              </el-collapse>
              <el-pagination
                background
                layout="prev, pager, next, total, sizes"
                :total="relatedSource?relatedSource.length:0"
                :page-sizes="[10, 20, 50, 100]"
                @current-change='handleRelatedEventsCurrentChange'
                @size-change='handleRelatedEventsSizeChange'
                style="text-align:center;padding-top:16px;">
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="'任务管理(' + TaskTableCount + ')'" name="third">
            <div class="tab-content" v-loading='loading'>
              <div class="tast-manage-table">
                <el-table :data="taskLists">
                  <el-table-column prop="name" label="名称" min-width='20%'></el-table-column>
                  <el-table-column prop="status" label="状态" align="center" min-width='10%'>
                    <template slot-scope="scope">{{ scope.row.status ? '开启': '关闭' }}</template>
                  </el-table-column>
                  <el-table-column prop="time" label="时间" align="center" min-width='15%'>
                  </el-table-column>
                  <el-table-column prop="updateTime" label="更新时间" align="center" min-width='15%'>
                    <template slot-scope="scope">
                      <span>{{ scope.row.updateTime | formatTime }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="lastRunTime" label="最后执行时间" align="center" min-width='15%'>
                    <template slot-scope="scope">
                      <span>{{ scope.row.lastRunTime | formatTime }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="totalRunCount" label="执行次数" align="center" min-width='10%'>
                  </el-table-column>
                  <el-table-column prop="description" label="描述" align="center" min-width='20%'></el-table-column>
                  <el-table-column
                    v-if="checkPermission('event')"
                    label="操作"
                    fixed="right"
                    align="center"
                    min-width='10%'>
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="updateTaskStatus(scope.row)">{{ scope.row.status ? '关闭' : '开启' }}</el-button>
                      <el-button type="text" size="small" @click="deleteTask(scope.row.id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  background
                  layout="prev, pager, next, total, sizes"
                  :total="TaskTableCount"
                  :current-page.sync="taskOffset"
                  :page-size.sync="taskLimit"
                  :page-sizes="[10, 20, 50, 100]"
                  @current-change='handleTaskTableCurrentChange'
                  @size-change='handleTaskTableSizeChange'
                  style="text-align:center;padding-top:16px;">
                </el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <!-- 版本暂未支持 -->
          <!-- <el-tab-pane label="原始数据" name="forth">
            <div class="tab-content">原始数据</div>
          </el-tab-pane> -->
        </el-tabs>
      </div>
    <div class="playbookMsg" v-show="isDisplay">
      <i class="el-icon-close" @click='closepanel'></i>
      <nodemsg ref='nodemsg'/>
    </div>
  </div>
</template>

<script>
import { slicePage } from '@/utils'
import Coa from './playbookview'
import nodemsg from './nodeMsg'
export default {
  components: {Coa, nodemsg},
  data () {
    return {
      loading: false,
      activeTab: 'first',
      activeCollapse: '1',
      count: 0,
      TaskTableCount: 0,
      eventName: '',
      visiblePlaybooks: '1',
      baseInfo: {},
      primaryInfo: {},
      relatedEventsDialog: false,
      columns: [
        { field: 'cef', title: 'CEF字段' },
        { field: 'value', title: 'VALUE' },
      ],
      addRelatedEventsForm: {
        eventName: '',
        data: [],
      },
      runPlaybookDialog: false,
      runActionsDialog: false,
      runPlaybookForm: {
        app: '',
        mode: 0,
        period: 'days',
        number: 1,
        month: 1,
        date: 1,
        hour: 0,
        minute: 1,
        description: '',
        taskName: ''
      },
      runActionForm: {
        app: '',
        action: '',
        parameter: [],
        mode: 0,
        period: 'days',
        number: 1,
        // time: new Date(),
        month: 1,
        date: 1,
        hour: 0,
        minute: 1,
        description: '',
        taskName: ''
      },
      runPlaybookRules: {
        playbook: [{ required: true, message: '请选择工作流', trigger: 'change' }],
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
      },
      runActionFormRules: {
        app: [{ required: true, message: '请输入App名称', trigger: 'change' }],
        action: [{ required: true, message: '请输入Action名称', trigger: 'change' }],
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
      },
      actionApp: [],
      action: [],
      parameters: [],
      artifacts: [],
      playbookLists: [],
      offset: 1,
      limit: 10,
      pbOffset: 1,
      pbLimit: 10,
      taskOffset: 1,
      taskLimit: 10,
      relatedID: '',
      relatedSource: [],
      runinfoTable: [],
      runinfoTableCount: 0,
      relatedDataCount: 0,
      taskTable: [],
      taskLists: [],
      isDisplay: false,
      relatedTable: [],
      runinfoSource: [],
      cefFields: []
    }
  },
  activated () {
    this.getDetailInfo()
  },
  mounted () {
    // 懒加载路由，mounted只执行一次
    this.getActionAppList()
    this.getArtifacts()
    this.getPlaybookList()
  },
  watch: {
    $route (to) {
      if (to.name === 'EventDetail') {
        this.getDetailInfo()
        this.activeTab = 'first'
      }
    },
  },
  methods: {
    getCefFieldLists () {
      this.$store.dispatch('config/getCefFieldLists').then(res => {
        if (res.status === 200) {
          this.cefFields = res.data
        }
      })
    },
    addCef (cef) {
      this.$store.dispatch('config/addCefField', cef)
    },
    selectCef (cef) {
      for (let item of this.cefFields) {
        if (item === cef) return
      }
      let newOption = {
        cef_name: cef
      }
      this.addCef(newOption)
    },
    filterSeverityColor (severity) {
      if (!severity) return false
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
    handleClick (row, column) {
      if (column.label === '操作') {
        return false
      }
      this.visiblePlaybooks = row.name
      row.name && this.$refs.coa.show(row.name)
      row.name && (this.$refs.nodemsg.name = row.name)
      row.artifact && (this.$refs.nodemsg.artifact = row.artifact)
      row.id && (this.$refs.nodemsg.id = row.id)
    },
    startIt (row) {
      console.log('再次运行name为', row.name)
    },
    pauseIt (row) {
      console.log(`暂停name=${row.name}的任务`)
    },
    stopIt (row) {
      console.log('停止name为', row.name)
    },
    getDetailInfo () {
      const id = this.$route.query.id
      this.$refs.nodemsg.id = id
      this.loading = true
      this.$store.dispatch('events/getEventsDetail', id).then(res => {
        if (res.status === 200) {
          let {name, owner, status, playbookname, severity, total, source, created, description, updated, artifacts, runinfo} = res.data
          this.baseInfo = {name, owner, status, playbookname, severity, total, source, created, description, updated}
          this.runinfoSource = runinfo // 存运行信息源数据
          this.relatedSource = artifacts // 存关联事件源数据
          this.relatedTable = slicePage(this.offset, this.limit, this.relatedSource)
          this.runinfoTable = slicePage(this.pbOffset, this.pbLimit, this.runinfoSource)
          this.getTaskManageList()
          /** 根据获取的工作流信息渲染playbook 如果没有,则传一个空id给playbook */
          if (this.runinfoTable.length > 0) {
            this.runinfoTable[0].name && this.$refs.coa.show(this.runinfoTable[0].name)
            this.runinfoTable[0].name && (this.$refs.nodemsg.name = this.runinfoTable[0].name)
            this.runinfoTable[0].artifact && (this.$refs.nodemsg.artifact = this.runinfoTable[0].artifact)
          } else {
            this.$refs.coa.show('')
          }
        }
        this.loading = false
      }).catch(e => {
        console.log(e)
        this.loading = false
      })
    },
    handleRelatedEventsCurrentChange (offset) {
      this.offset = offset
      this.relatedTable = slicePage(this.offset, this.limit, this.relatedSource)
    },
    handleRelatedEventsSizeChange (limit) {
      this.limit = limit
      this.relatedTable = slicePage(this.offset, this.limit, this.relatedSource)
    },
    handlePlaybookCurrentChange (offset) {
      this.pbOffset = offset
      this.runinfoTable = slicePage(this.pbOffset, this.pbLimit, this.runinfoSource)
    },
    handlePlaybookSizeChange (limit) {
      this.pbLimit = limit
      this.runinfoTable = slicePage(this.pbOffset, this.pbLimit, this.runinfoSource)
    },
    handleTaskTableCurrentChange (offset) {
      this.taskOffset = offset
      this.getTaskManageList()
    },
    handleTaskTableSizeChange (limit) {
      this.taskOffset = 1
      this.taskLimit = limit
      this.getTaskManageList()
    },
    addRelatedEvents () {
      this.relatedEventsDialog = true
      this.addRelatedEventsForm.eventName = this.baseInfo.name
    },
    addCefField () {
      let j = { cef: '', value: '' }
      this.addRelatedEventsForm.data.push(j)
    },
    deleteRow (row, index) {
      this.addRelatedEventsForm.data.splice(index, 1)
    },
    confirmAddRelatedEvent () {
      let cef = {}
      for (let item of this.addRelatedEventsForm.data) {
        cef[item.cef] = item.value
      }
      let data = {
        eventName: this.baseInfo.name,
        cef
      }
      this.$store.dispatch('events/AddRelatedEvent', data).then(res => {
        if (res.status === 201) {
          this.$message.success('添加成功！')
          this.getDetailInfo()
        }
        this.relatedEventsDialog = false
      })
    },
    getActionAppList () {
      this.$store.dispatch('events/getActionApps').then(res => {
        this.actionApp = res.data
      })
    },
    getPlaybookList () {
      this.$store.dispatch('playbooks/getPlaybookLists', {limit: 100}).then(res => {
        this.playbookLists = res.results
      })
    },
    selectApp (id) {
      this.runActionForm.action = '' // reset this value first
      this.$store.dispatch('events/getActions', id).then(res => {
        this.action = res.data
      })
    },
    selectAction (action) {
      // reset runActionForm.parameter[index] first
      for (let i = 0; i < this.runActionForm.parameter.length; i++) {
        this.runActionForm.parameter[i] = ''
      }
      for (let item of this.action) {
        if (item.name === action) {
          this.parameters = item.parameters
        }
      }
    },
    selectMethod (method) {
      // reset taskName & description when change method
      this.runActionForm.taskName = ''
      this.runActionForm.description = ''
    },
    selectRunPlaybookMethod (method) {
      this.runPlaybookForm.taskName = ''
      this.runPlaybookForm.description = ''
    },
    getArtifacts () {
      this.$store.dispatch('config/getArtifacts').then(res => {
        this.artifacts = res.data
      })
    },

    comfirmRunAction () {
      let name = []
      let parameters = {}
      let periodic = []
      this.$refs.runActionForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.parameters.map((item, index) => {
          name[index] = item.name
        })
        for (let j = 0; j < name.length; j++) {
          parameters[name[j]] = '' // fill array first
          for (let i = 0; i < this.runActionForm.parameter.length; i++) {
            if (i === j) {
              parameters[name[j]] = this.runActionForm.parameter[i] // replace element of this array
            }
          }
        }
        if (this.runActionForm.mode === 1) {
          periodic = [this.runActionForm.period, this.runActionForm.number]
        } else if (this.runActionForm.mode === 2) {
          periodic = [this.runActionForm.month, this.runActionForm.date, this.runActionForm.hour, this.runActionForm.minute]
        }
        let data = {
          method: this.runActionForm.mode === 0,
          artifact: this.relatedID,
          periodic,
          action: this.runActionForm.action,
          parameters,
          task: this.baseInfo.name + this.runActionForm.taskName,
          description: this.runActionForm.description,
          event: this.$route.query.id
        }
        let id = this.runActionForm.app
        this.$store.dispatch('events/runAction', {id, data}).then(res => {
          if (res.status === 200) {
            this.runActionsDialog = false
            this.$message({
              type: 'success',
              message: res.data.detail || 'Action执行成功',
              duration: 2000
            })
            this.getTaskManageList()
            this.$refs.runActionForm.resetFields()
          }
        })
      })
    },

    confirmRunPlaybook () {
      let periodic = []
      this.$refs.runPlaybookForm.validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.runPlaybookForm.mode === 1) {
          periodic = [this.runPlaybookForm.period, this.runPlaybookForm.number]
        } else if (this.runPlaybookForm.mode === 2) {
          periodic = [this.runPlaybookForm.month, this.runPlaybookForm.date, this.runPlaybookForm.hour, this.runPlaybookForm.minute]
        }

        let id = this.runPlaybookForm.playbook
        let data = {
          method: this.runPlaybookForm.mode === 0,
          artifact: this.relatedID,
          periodic,
          task: this.runPlaybookForm.taskName,
          description: this.runPlaybookForm.description,
          event: this.$route.query.id
        }
        this.$store.dispatch('events/switcherPlaybook', {id, data}).then(res => {
          if (res.status === 200) {
            this.runPlaybookDialog = false
            this.$message({
              type: 'success',
              message: res.data.detail || '工作流执行成功',
              duration: 2000
            })
            this.getTaskManageList()
            this.$refs.runPlaybookForm.resetFields()
          }
        })
      })
    },
    runPlaybook (id) {
      this.runPlaybookDialog = true
      this.relatedID = id
    },
    runAction (id) {
      this.runActionsDialog = true
      this.relatedID = id
    },
    getTaskManageList () {
      let id = this.$route.query.id
      let params = {
        offset: this.taskOffset,
        limit: this.taskLimit
      }
      this.$store.dispatch('events/getPeriodTask', {id, params}).then(res => {
        this.taskLists = res.results
        this.TaskTableCount = res.count || 0
      })
    },
    updateTaskStatus ({id, status}) {
      let data = { status: !status }
      this.$store.dispatch('events/updatePeriodTask', {id, data}).then(res => {
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: (status ? '关闭' : '开启') + '成功!'
          })
        }
        this.getTaskManageList()
      })
    },
    deleteTask (id) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('events/deletePeriodTask', id).then(_ => {
          this.getTaskManageList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    coaValue (isDisplay) {
      this.isDisplay = isDisplay
    },
    closepanel () {
      this.isDisplay = false
    }
  }
}
</script>

<style lang='scss' scoped>
.event-detail-container{
  position: relative;
  .base-info{
    background: #fff;
    border-radius: 5px;
    padding: 16px 16px;
    color:#333;
    margin-bottom: 16px;;
    &-title{
      font-weight: 700;
      padding: 0 0 10px;
    }
    &-list{
      padding: 0 48px;
      .line > .el-col{
        padding: 8px 0;
        font-size: 14px;
        .label{
          width:100px;
          >span{
            display: inline-block;
            width:80px;
            text-align: right;
            height: 28px;
            line-height: 28px;
          }
        }
        .content{
          overflow:hidden;
          line-height: 28px;
          >span{
            display: inline-block;
            padding-left: 16px;
          }
        }
        .el-tag{
          margin-right: 5px;
          margin-bottom:5px
        }
      }
    }
  }
  .primary-info{
    .el-tabs{
      /deep/ .el-tabs__header{
        margin: 0;
      }
      /deep/ .el-tabs__nav.is-top{
        background: #ccc;
        border-left: 0;
      }
      /deep/.el-tabs--card>.el-tabs__header .el-tabs__item{
        color:#fff;
        font-size: 14px;
        font-weight: 700;
      }
      /deep/.el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
        background: #fff;
        color: #333;
      }
      .tab-content{
        .el-icon-arrow-right:before {
            content: "\E606";
        }
        background: #fff;
        color: #666666;
        padding: 24px;
        .playbook-preview{
          height: 300px;
          background: #000;
        }
        .el-table-add-row {
            margin-top: 10px;
            width: 100%;
            height: 34px;
            border: 1px dashed #c1c1cd;
            border-radius: 3px;
            cursor: pointer;
            justify-content: center;
            display: flex;
            line-height: 34px;
        }
        .dialog-related-events-table{
          padding: 0 100px;
        }
        .dialog-chose-playbook-form{
          &-select{
            padding-left: 50px;
            .el-form-item{
              padding-right: 16px;
              background: #f2f2f2;
              padding-top: 16px;
              padding-bottom: 16px;
            }
          }
        }
        .dialog-run-action-form-select{
            margin-left: 50px;
            padding: 16px 80px 1px 0;
            background: #f2f2f2;
        }
        .artifact-header{
          padding-bottom: 8px;
        }
        .el-collapse-item{
          /deep/ .el-collapse-item__arrow.el-icon-arrow-right{
              font-size: 0;
              margin: 0;
          }
          /deep/ .el-collapse-item__content{
            padding-bottom: 0;
          }
          /deep/ .el-collapse-item__header {
            background: #f4f4f4;
          }
          & + .el-collapse-item {
            margin-top: 5px;
          }
          .collapse-title{
            width: 100%;
            height: 100%;
            display: flex;
            span.title {
              color: #666;
              font-size: 14px;
              width: 25%;
              &.id{
                padding-left: 24px;
              }
              &.name{
                flex:1;
              }
              &.time{
                padding-right: 24px;
                text-align: right;
                min-width: 160px;
              }
            }
          }
          .content{
            &-table{
              width: 100%;
              border: 1px solid #ccc;
              box-sizing: border-box;
              tr + tr{
                border-top: 1px solid #ccc;
              }
              tr td {
                padding: 5px 0 5px 20px;
                font-size: 14px;
                &:first-child{
                  width: 30%;
                  border-right: 1px solid #ccc;
                  font-style: italic;
                }
              }
            }
            &-btn{
              text-align: center;
              padding: 4px 0;
            }
          }
          .arrow-icon{
            transition: transform .3s,-webkit-transform .3s;
          }
          &.is-active{
            .arrow-icon{
              transition: transform .3s,-webkit-transform .3s;
              transform: rotate(90deg);
            }
          }
        }
      }
    }
  }
  .playbookMsg{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 350px;
    background: #fff;
    border: 1px solid #eee;
    box-shadow: 2px 0 8px 0 rgba(0,0,0,0.25);
    border-left: 1px solid #c3cbd4;
    z-index: 999;
    .el-icon-close{
      position:absolute;
      top:5px;
      right: 5px;
      font-size: 22px;
      line-height: 22px;
      &:hover{
        cursor: pointer;
      }
    }
  }
}
</style>
