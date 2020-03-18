<template>
    <div class="chart" :style="{height:'122px',width:'100%'}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
require('echarts/theme/macarons')
export default {
  mixins: [resize],
  props: {
    data: {
      type: Object,
      default: () => ({})
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
        if (Object.keys(val).length) {
          this.$nextTick(() => {
            this.initChart(val)
          })
        }
      }
    }
  },
  methods: {
    initChart (data) {
      this.chart = echarts.init(this.$el, 'macarons')
      if (data.hasOwnProperty('active')) {
        this.initPlaybook(data)
      } else {
        this.initApp(data)
      }
    },
    initPlaybook (data) {
      this.chart.setOption({
        color: '#007fff',
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['激活数', '总数'],
            axisTick: {
              alignWithLabel: true, show: false
            },
            axisLine: {show: false}, // 轴线不显示
            splitLine: {show: false},
            axisLabel: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {show: false}, // 轴线不显示
            axisTick: {show: false}, //
            splitLine: {show: false},
            axisLabel: {
              show: false
            }

          }
        ],

        series: [
          {
            type: 'bar',
            barWidth: '30%',
            barMinHeight: 1,
            data: [data.active, data.total]
          },
        ]
      })
    },
    initApp (data) {
      this.chart.setOption({
        color: '#007fff',
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['可用数', '总数'],
            axisTick: {
              alignWithLabel: true, show: false
            },
            axisLine: {show: false}, // 轴线不显示
            splitLine: {show: false},
            axisLabel: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {show: false}, // 轴线不显示
            axisTick: {show: false}, //
            splitLine: {show: false},
            axisLabel: {
              show: false
            }

          }
        ],

        series: [
          {

            type: 'bar',
            barWidth: '30%',
            data: [data.available, data.total]
          }
        ]
      })
    }
  }
}
</script>
