<template>
  <div class="chart" id="chart" :style="{height:'400px',width:'100%'}" />
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
    },
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
      if (data.hasOwnProperty('active')) {
        this.initPlaybook(data)
      } else {
        this.initPlugin(data)
      }
    },
    initPlaybook (data) {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        series: [
          {
            type: 'pie',
            startAngle: 180,
            endAngle: 0,
            radius: ['70%', '100%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold',
                  padding: [0, 0, 30, 0]
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: data.active,
                name: '激活数',
                itemStyle: {
                  color: '#2993fe'
                }
              },
              {
                value: data.total ? data.total : '',
                name: '总数',
                itemStyle: {
                  color: '#66b2fe'
                }
              },
              {
                value: data.active + data.total,
                name: 'OTHER',
                itemStyle: {
                  color: 'transparent'
                }
              },
            ]
          }
        ]
      })
    },
    initPlugin (data) {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        series: [
          {
            type: 'pie',
            startAngle: 180,
            endAngle: 0,
            radius: ['70%', '100%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold',
                  padding: [0, 0, 30, 0]
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: data.available,
                name: '可用数',
                itemStyle: {
                  color: '#2993fe'
                }
              },
              {
                value: data.total ? data.total : '',
                name: '总数',
                itemStyle: {
                  color: '#66b2fe'
                }
              },
              {
                value: data.available + data.total,
                name: 'OTHER',
                itemStyle: {
                  color: 'transparent'
                }
              },
            ]
          }
        ]
      })
    },
  }
}
</script>

<style lang='scss' scoped>

</style>
