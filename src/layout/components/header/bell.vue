<template>
  <el-popover
    offset
    placement='bottom'
    popper-class='bell-tips'
    trigger="click">
    <ul v-if="bellLog.length">
      <li v-for="item of bellLog" :key="item.id">
        <el-tooltip class="item" effect="dark" :content="item.description" placement="top">
          <span>{{ item.description }}</span>
        </el-tooltip>
        <span @click="deleteTip(item.id)"><i class="el-icon-delete"></i></span></li>
      <el-pagination
        small
        hide-on-single-page
        @current-change='handleCurrentChange'
        layout="prev, pager, next"
        :pager-count="5"
        :total="count">
      </el-pagination>
    </ul>
    <ul v-else>
      <li style="border:0;"><span>暂无通知</span><span></span></li>
    </ul>
    <el-badge :is-dot='count?true:false' class="item" slot="reference">
      <i class="el-icon-bell" style='cursor:pointer'></i>
    </el-badge>
  </el-popover>
</template>

<script>
import { slicePage } from '@/utils'
export default {
  name: 'Bell',
  data () {
    return {
      count: 0,
      bellLogs: [],
      bellLog: [],
      offset: 1,
      limit: 10
    }
  },
  created () {
    this.getBellLogs()
  },
  methods: {
    getBellLogs () {
      this.$store.dispatch('user/getBellLog').then(res => {
        this.bellLogs = res.results
        this.bellLog = slicePage(this.offset, this.limit, this.bellLogs)
        this.count = res.count
      })
    },
    handleCurrentChange (offset) {
      this.offset = offset
      this.bellLog = slicePage(this.offset, this.limit, this.bellLogs)
    },
    deleteTip (id) {
      this.$store.dispatch('user/deleteBellLog', id).then(res => {
        this.getBellLogs()
      })
    }
  }
}
</script>

<style scoped lang='scss'>
@import '~@/styles/mixin.scss';
.bell-tips{
  ul{
     padding:0;
     width:250px;
    li{
      border-bottom: 1px solid #ddd;
      box-sizing: border-box;
      height: 22px;
      line-height: 22px;
      width: 100%;
      font-size: 0;
      &:hover{
        background: #f5f7fa;
      }
      span{
        display: inline-block;
        font-size: 12px;
        &:first-child{
          width: 220px;
          height: 100%;
          @include ellipsis;
          vertical-align: top;
          line-height: 22px;
        }
        &:last-child{
          width: 30px;
          height: 100%;
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }

}
</style>
