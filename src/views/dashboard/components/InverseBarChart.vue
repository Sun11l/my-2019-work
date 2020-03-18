<template>
    <div class="chart" :style="{height:'280px',width:'100%'}" />
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
    formatNum (strNum) {
      if (strNum.length <= 3) {
        return strNum
      }
      if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
        return strNum
      }
      let a = RegExp.$1
      let b = RegExp.$2
      let c = RegExp.$3
      let re = new RegExp()
      re.compile('(\\d)(\\d{3})(,|$)')
      while (re.test(b)) {
        b = b.replace(re, '$1,$2$3')
      }
      return a + '' + b + '' + c
    },
    initChart (data) {
      let [chartName, chartData] = [[], []]
      Object.keys(data).map(key => {
        chartData.push(data[key])
        if (key === 'Alert') {
          key = '自定义告警总数（Alert）'
        } else if (key === 'ES_total') {
          key = '接收到的事件总数（ES）'
        }
        chartName.push(key)
      })
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        grid: {
          left: '5%',
          right: '20%',
          bottom: '0',
          top: '0%',
          containLabel: true
        },
        xAxis: [
          {
            show: false,
          },
          {
            show: false,
          }
        ],
        yAxis: {
          type: 'category',
          inverse: true,
          show: true
        },
        series: [
          {
            show: true,
            type: 'bar',
            barGap: '-100%',
            barWidth: '40%',
            barMinHeight: 5,
            color: '#007fff',
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: '#000',
                  fontSize: 20,
                  fontWeight: 'bold',
                },
                position: 'right',
                formatter: data => {
                  return this.formatNum(chartData[data.dataIndex])
                }
              }
            },
            data: chartData,
          },
          {
            show: true,
            type: 'bar',
            xAxisIndex: 1,
            barGap: '-100%',
            barWidth: '10%',
            barMinHeight: 5,
            itemStyle: {
              normal: {
                barBorderRadius: 200,
                color: 'transparent'
              }
            },
            label: {
              normal: {
                show: true,
                position: [5, -20],
                textStyle: {
                  fontSize: 14,
                  color: '#333',
                },
                formatter: function (data) {
                  return chartName[data.dataIndex]
                }
              }
            },
            data: chartData
          }
        ]
      })
    },
  }
}
</script>
