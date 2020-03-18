<template>
  <div class="dashboard-container pagecontainer">

    <div class="column-1">
      <div class="column-title">自动化任务</div>
      <div class="column-content">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :lg="6">
            <div class="item run">
              <h2 v-loading='loading'>
                <countTo :startVal='0' :endVal='autoTask.running' :duration='1000' class="count-to"></countTo>
              </h2>
              <p>运行中</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <div class="item wait">
              <h2 v-loading='loading'>
                <countTo :startVal='0' :endVal='autoTask.waiting' :duration='1000' class="count-to"></countTo>
              </h2>
              <p>等待中</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <div class="item fail">
              <h2 v-loading='loading'>
                <countTo :startVal='0' :endVal='autoTask.failure' :duration='1000' class="count-to"></countTo>
              </h2>
              <p>失败</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <div class="item close">
              <h2 v-loading='loading'>
                <countTo :startVal='0' :endVal='autoTask.accomplish' :duration='1000' class="count-to"></countTo>
              </h2>
              <p>关闭</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- v2.0.0 移除 -->

    <!-- <div class="column-2">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :lg="12" class="column-2-item">
          <div class="workflow">
            <div class="column-title">任务流</div>
            <div class="column-content" v-loading='loading'>

              <div class="pie-wrapper">
                  <el-row :gutter='20'>
                    <el-col :xs="0" :sm="2" :lg="4">
                        <p class="text">{{ workflow.active }}</p>
                        <h2>激活数</h2>
                    </el-col>
                    <el-col :xs="24" :sm="20" :lg="16">
                      <pie-chart :data='workflow' />
                    </el-col>
                    <el-col :xs="0" :sm="2" :lg="4">
                        <p class="text">{{ workflow.total }}</p>
                        <h2>总数</h2>
                    </el-col>
                  </el-row>
              </div>

            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12" class="column-2-item">
          <div class="plugin">
            <div class="column-title">应用插件</div>
            <div class="column-content">

              <div class="pie-wrapper" v-loading='loading'>
                  <el-row :gutter='20'>
                    <el-col :xs="0" :sm="2" :lg="4">
                        <p class="text">{{ plugin.available }}</p>
                        <h2>可用数</h2>
                    </el-col>
                    <el-col :xs="24" :sm="20" :lg="16">
                      <pie-chart :data='plugin' />
                    </el-col>
                    <el-col :xs="0" :sm="2" :lg="4">
                        <p class="text">{{ plugin.total }}</p>
                        <h2>总数</h2>
                    </el-col>
                  </el-row>
              </div>

            </div>
          </div>
        </el-col>
      </el-row>
    </div> -->

    <!-- v2.0.0 移除 -->

  <!-- v2.0.0 新增 -->
    <div class="column-2" style="margin-bottom:0;">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :lg="16" class="column-2-item" style="margin-bottom:16px" >
          <div class="trend">
            <div class="column-title">事件趋势</div>
            <div class="control-bar">
              <el-select size="mini" v-model="source" @change="selectSource" :disabled='disabled' placeholder="请选择">
                <el-option
                  v-for="(item, index) in option"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-radio-group v-model="timeRange" @change='selectTimeRange' :disabled='disabled' size="mini">
                <el-radio-button label="Yesterday">昨天</el-radio-button>
                <el-radio-button label="Today">今天</el-radio-button>
                <el-radio-button label="Week">7天</el-radio-button>
                <el-radio-button label="Month">30天</el-radio-button>
              </el-radio-group>
            </div>
            <div class="column-content" v-loading='disabled'>
              <line-chart :data='trend' />
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8" class="column-2-item" style="margin-bottom:16px">
          <el-row>
            <el-col :span="24" style="margin-bottom:16px">
              <div class="playbook">
                <div class="column-title">剧本</div>
                <div class="column-content" v-loading='loading'>
                  <div class="bar-wrapper">
                      <el-row :gutter='20'>
                        <el-col :xs="0" :sm="2" :lg="4">
                            <p class="text">{{ workflow.active }}</p>
                            <h2>激活数</h2>
                        </el-col>
                        <el-col :xs="24" :sm="20" :lg="16">
                          <bar-chart :data='playbook' />
                        </el-col>
                        <el-col :xs="0" :sm="2" :lg="4">
                            <p class="text">{{ workflow.total }}</p>
                            <h2>总数</h2>
                        </el-col>
                      </el-row>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="app">
                <div class="column-title">应用</div>
                <div class="column-content" v-loading='loading'>

                  <div class="bar-wrapper" v-loading='loading'>
                      <el-row :gutter='20'>
                        <el-col :xs="0" :sm="2" :lg="4">
                            <p class="text">{{ plugin.available }}</p>
                            <h2>可用数</h2>
                        </el-col>
                        <el-col :xs="24" :sm="20" :lg="16">
                          <bar-chart :data='app' />
                        </el-col>
                        <el-col :xs="0" :sm="2" :lg="4">
                            <p class="text">{{ plugin.total }}</p>
                            <h2>总数</h2>
                        </el-col>
                      </el-row>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  <!-- ENDING -->

    <div class="column-2">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :lg="12" class="column-2-item">
          <div class="event-statistics">
            <div class="column-title">事件统计</div>
            <div class="column-content">
              <div class="bar-wrapper" v-loading='loading'>
                <inverse-bar-chart :data='statistics' />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12" class="column-2-item">
          <div class="event-tops">
            <div class="column-title">事件数据源TOP5</div>
            <div class="column-content">
              <div class="top5-wrapper" v-loading='loading'>
                <top-table :data='topData'/>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import PieChart from './components/PieChart'
import InverseBarChart from './components/InverseBarChart'
import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
import TopTable from './components/TopTable'
import countTo from 'vue-count-to'

export default {
  components: {
    PieChart,
    InverseBarChart,
    BarChart,
    LineChart,
    TopTable,
    countTo
  },
  data () {
    return {
      disabled: true,
      loading: false,
      autoTask: {
        running: 0,
        waiting: 0,
        failure: 0,
        accomplish: 0
      },
      workflow: {
        active: 0,
        total: 0
      },
      plugin: {
        available: 0,
        total: 0
      },
      statistics: {
        'Alert': 0,
        'ES_total': 0
      },
      trend: [],
      topData: [],
      source: 'waf-syslog*,mcafee-epo*,ips-syslog*',
      timeRange: 'Today',
      option: [
        {
          label: '所有数据',
          value: 'waf-syslog*,mcafee-epo*,ips-syslog*'
        },
        {
          label: 'waf-syslog*',
          value: 'waf-syslog*'
        },
        {
          label: 'mcafee-epo*',
          value: 'mcafee-epo*'
        },
        {
          label: 'ips-syslog*',
          value: 'ips-syslog*'
        },

      ],
      playbook: {
        active: 0,
        total: 0
      },
      app: {
        available: 0,
        total: 0
      }
    }
  },
  activated () {
    this.getDefaultData()
    this.getDashboardTrend()
  },
  methods: {
    sortTopData (topData) {
      let arr = []
      for (let i in topData) {
        arr.push(
          {
            key: i,
            value: topData[i]
          }
        )
      }
      return arr.sort((b, a) => a.value - b.value)
    },
    getDefaultData () {
      this.loading = true
      this.$store.dispatch('dashboard/getDashboardStatistics').then(res => {
        let {status, data} = res
        if (status === 200) {
          this.autoTask = Object.assign({}, data.auto_task)
          this.workflow = Object.assign({}, data.playbooks)
          this.plugin = Object.assign({}, data.app_plugin)
          this.statistics = Object.assign({}, data.events)
          this.topData = this.sortTopData(data.events_source)

          this.playbook = Object.assign({}, data.playbooks)
          this.app = Object.assign({}, data.app_plugin)
        }
        this.loading = false
      }).catch(e => {
        console.log(e)
        this.loading = false
      })
    },
    getDashboardTrend () {
      this.disabled = true
      let data = {
        time_range: this.timeRange,
        index: this.source
      }
      this.$store.dispatch('dashboard/getDashboardTrend', data).then(res => {
        if (res.status === 201) {
          this.trend = res.data
        }
        this.disabled = false
      }).catch(e => {
        console.log(e)
        this.disabled = false
      })
    },
    selectTimeRange (time) {
      this.getDashboardTrend()
    },
    selectSource (index) {
      this.getDashboardTrend()
    }
  }
}
</script>

 <style lang='scss' scoped>
.dashboard-container{
  .column-title{
      font-weight: 700;
      font-size: 14px;
      padding: 16px 0 0 20px;
  }
  .column-content{
    padding: 16px 40px;
    overflow: hidden;
    .item{
      width: 100%;
      font-size: 14px;
      text-align: center;
      padding: 20px 0;
      overflow: hidden;
      h2{
        font-size: 50px;
        font-weight: 700;
        padding-bottom: 10px;
        border-right: 1px solid #ddd;
      }
      p{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        padding-top: 8px;;
      }
      &.run h2{color: $run;}
      &.wait h2{color:$wait;}
      &.fail h2{color: $fail;}
      &.close h2{color: $close;border-right: 0;}
    }
  }
  .column-1{
    background: #fff;
    margin-bottom: 16px;
  }
  .column-2{
    margin-bottom: 16px;
    .workflow, .plugin, .event-tops, .event-statistics, .trend,.playbook,.app{
      background: #fff;
      .column-content{
        padding-bottom: 50px;
        .pie-wrapper{
          height: 200px;
          overflow: hidden;
          p{
            font-weight: 700;
            font-size: 35px;
            padding-top: 125px;
            text-align: center;
          }
          p + h2{
            padding-top: 24px;
            text-align: center;
          }
          p,h2{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .bar-wrapper{
          overflow: hidden;
          p{
            font-weight: 700;
            font-size: 35px;
            padding-top: 47px;
            text-align: center;
          }
          p + h2{
            padding-top: 24px;
            text-align: center;
          }
          p,h2{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      .control-bar{
        text-align: right;
        padding-right: 65px;
      }
    }
  }
}
 </style>
