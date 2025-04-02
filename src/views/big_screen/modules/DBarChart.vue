d<template>
  <div :style="{ height: height, width: width }">
    <div style="width:100%;height:10px;text-align:center;color:#fff;font-weight:600;font-size:16px;">{{ title }}</div>
    <div ref="dBarChart" :style="{ width: width, height: height }"></div>
  </div>
</template>
<script>
// import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, TitleComponent } from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
import { getAction } from '@/api/manage'
import { PieChart } from 'echarts/charts'
import 'echarts/lib/component/dataZoom'
// 注册的组件
echarts.use([
  TitleComponent,
  PieChart,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer
])
export default {
  name: 'dBarChart',
  //   mixins: [JeecgListMixin],
  components: {},
  data() {
    return {
      data: ['油罐1', '油罐2', '油罐3', '油罐4', '油罐5', '油罐6', '油罐7'],
      seriesValue: [2500, 4000, 1654, 2454, 4757, 2011, 1500],
      seriesData1: [2000, 3500, 1300, 1300, 1250, 1500, 1300],
      WHKR: [],
      dBarChart: null
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.changeSize)
  },
  props: {
    title: {
      type: [String, Number],
      default: '入库统计'
    },
    width: {
      type: [String, Number],
      default: '500px'
    },
    height: {
      type: [String, Number],
      default: '400px'
    },
    tooltipTrigger: {
      type: [String],
      default: 'axis'
    },
    tooltipFormatter: {
      type: [String, Function, Number],
      default: ''
    }
  },
  methods: {
    changeSize() {
      this.dBarChart.resize()
    },
    getData() {
      let that = this
        that.data = []
        that.seriesValue = []
        that.seriesData1 = []
        that.seriesData2 = []
        that.WHKR = []
    },
    initChart() {
      let that = this
      that.dBarChart = echarts.init(this.$refs.dBarChart)
      let option = {
        // backgroundColor: '#00265f',
        tooltip: {
          trigger: that.tooltipTrigger,
          position: ['90%', '10%'],
          // formatter: function(params, ticket, callback) {
          //   return (
          //     '<div style="width:160px">油品名称' +
          //     '<span style="float:right">' +
          //     params[0].axisValueLabel +
          //     '</span>' +
          //     '<br/>' +
          //     params[0].marker +
          //     '&nbsp' +
          //     params[0].seriesName +
          //     '<span style="float:right">' +
          //     params[0].value +
          //     '</span>' +
          //     '<br/>' +
          //     params[1].marker +
          //     '&nbsp' +
          //     params[1].seriesName +
          //     '<span style="float:right">' +
          //     params[1].value +
          //     '</span>' +
          //     '<br/>' +
          //     params[2].marker +
          //     '&nbsp' +
          //     params[2].seriesName +
          //     '<span style="float:right">' +
          //     params[2].value +
          //     '</span>' +
          //     '<br/>' +
          //     params[3].marker +
          //     '&nbsp' +
          //     params[3].seriesName +
          //     '<span style="float:right">' +
          //     Math.round(params[3].value - params[0].value) +
          //     '</span></div>'
          //   )
          // },
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          // x2: 140
          left: '15%',
          right: '5%',
          // top:'30%',
          bottom: '20%'
        },
        xAxis: [
          {
            type: 'category',
            data: that.data,
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.12)'
              }
            },
            axisLabel: {
              margin: 10,
              color: '#e2e9ff',
              textStyle: {
                fontSize: 14
              }
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        yAxis: [
          {
            name: '',
            nameTextStyle: {
              color: '#fff',
              fontSize: '16px'
              // fontWeight:'bold'
            },
            axisLabel: {
              formatter: '{value}',
              color: '#fff'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.12)'
              }
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            data: that.seriesData1,
            // barWidth: '20px',
            // itemStyle: {
            //   normal: {
            //     color: function(params) {
            //       if (params.name.indexOf('车用汽油') != -1) {
            //         return 'red'
            //       } else if (params.name.indexOf('柴油') != -1) {
            //         return 'yellow'
            //       } else if (params.name.indexOf('喷气') != -1) {
            //         return 'blue'
            //       } else {
            //         return 'gray'
            //       }
            //     },
            //     // barBorderRadius: [30, 30, 30, 30],
            //     shadowColor: 'rgba(0,160,221,1)',
            //     shadowBlur: 4
            //   }
            // }
          },
          {
            name: '最大容量',
            type: 'bar',
            // barWidth: 20,
            barGap: '-100%',
            data: that.seriesValue,
            z: -3,
            itemStyle: {
              normal: {
                color: 'gray'
                // barBorderRadius: 30
              }
            }
          },
          {
            name: '剩余容量',
            type: 'bar',
            // barWidth: 20,
            barGap: '-100%',
            data: that.seriesData2,
            z: -5,
            itemStyle: {
              normal: {
                color: 'rgba(135,142,146,.2)'
                // barBorderRadius: 30
              }
            }
          },
          {
            name: '维护库容',
            type: 'bar',
            // barWidth: 20,
            barGap: '-100%',
            data: that.WHKR,
            z: -1,
            itemStyle: {
              normal: {
                color: 'orange'
                // barBorderRadius: 30
              }
            }
          }
        ]
      }

      that.dBarChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped></style>
