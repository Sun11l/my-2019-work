<template>
    <div class="chart" :style="{height:'327px',width:'100%'}" />
</template>

<script>
import { formatMomentTime } from '@/utils'
import echarts from 'echarts'
import resize from './mixins/resize'
require('echarts/theme/macarons')
export default {
  mixins: [resize],
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      chart: null
    }
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler (val) {
        if (val) {
          this.$nextTick(() => {
            this.initChart(val)
          })
        }
      }
    }
  },
  methods: {
    initChart (trend) {
      let [xAxis, yAxis] = [[], []]
      trend.map(item => {
        xAxis.push(formatMomentTime(item.key_as_string))
        yAxis.push(item.doc_count)
      })
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        grid: {
          left: '3%',
          right: '2%',
          bottom: '3%',
          top: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line', // cross为正交显示XY坐标值，shadow为阴影柱子显示，line为竖向直线显示
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis,
          axisTick: {show: false, alignWithLabel: true}, // 坐标轴刻度不显示
          axisLabel: { show: false }, // 刻度不显示
          splitLine: {show: true}, // 分隔线不显示
        },
        yAxis: {
          type: 'value',
          axisLabel: { show: false }, // 刻度不显示
          axisTick: {show: false, alignWithLabel: true}, // 坐标轴刻度不显示
          splitLine: {show: true},
        },
        series: [{
          data: yAxis,
          type: 'line',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#66b1fe' // 0% 处的颜色
              }, {
                offset: 1, color: '#fefefe' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }]
      })
    },
  }
}
</script>
