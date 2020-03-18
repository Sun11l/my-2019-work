<template>
  <div class="data-container pagecontainer">
    <el-tabs v-model="activeName" type="card" @tab-click='handleClick'>
      <el-tab-pane label="数据配置" name="first">
        <div class="tab-content">
          <dataConfig :dataConfigList='dataConfigList' @updateDataConfig='updateDataConfig'/>
        </div>
      </el-tab-pane>
      <el-tab-pane label="告警规则" name="second">
        <div class="tab-content">
          <warnRule :warnRulesList='warnRulesList' @updateWarnRulesList='updateWarnRulesList'/>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dataConfig from '@/components/dataConfig'
import warnRule from '@/components/warnRule'
export default {
  components: {
    dataConfig,
    warnRule,
  },
  data () {
    return {
      activeName: 'first',
      dataConfigList: {},
      warnRulesList: {},
      limit: 10,
      offset: 1
    }
  },
  activated () {
    this.getDataConfig()
  },
  methods: {
    handleClick ({index}) {
      if (index === '0') {
        this.getDataConfig()
      } else if (index === '1') {
        this.getWarnRules()
      }
    },
    getDataConfig () {
      this.$store.dispatch('config/getDataConfig', {offset: this.offset, limit: this.limit}).then(res => {
        if (res.status !== 200) {
          return false
        }
        this.dataConfigList = res.data
      })
    },
    getWarnRules () {
      this.$store.dispatch('config/getWarnRulesList', {offset: 1, limit: 10}).then(res => {
        if (res.status !== 200) {
          return false
        }
        this.warnRulesList = res.data
      })
    },
    updateDataConfig (value) {
      this.dataConfigList = value
    },
    updateWarnRulesList (value) {
      this.warnRulesList = value
    }
  }
}
</script>

<style lang="scss" scoped>
.data-container{
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
