<template>
  <div :style="{ height: height, width: width }">
    <div
      style="width:100%;height:10px;text-align:center;color:#fff;font-weight:600;font-size:16px;"
    >{{ title }}</div>
    <div ref="barChart" :style="{ width: width, height: height }"></div>
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
  name: 'barChart',
  //   mixins: [JeecgListMixin],
  components: {},
  data () {
    return {
      data: [1,2,3,4,5,6,7],
      seriesValue: [254, 3254, 1654, 2454, 4757, 2011, 1211],
      barChart: null,
      colors: [],
      maxContain:[123,45,47,124,588,146,578],
    }
  },
  created () {
  },
  mounted () {
    this.getData()
    window.addEventListener('resize', this.changeSize)
  },
  props: {
    title: {
      type: [String, Number],
      default: ''
    },
    lineStyleColor: {
      type: [String],
      default: '#fff'
    },
    backgroundColor: {
      type: [String],
      default: '#fff'
    },
    width: {
      type: [String, Number],
      default: '500px'
    },
    height: {
      type: [String, Number],
      default: '400px'
    },
    xAxisAxisLabelColor: {
      type: [String],
      default: '#fff'
    },
    xAxisAxisLabelFontSize: {
      type: [String, Number],
      default: 12
    },
    xAxisAxisLabelInterval: {
      type: [Number],
      default: 0
    },
    yAxisName: {
      type: [String, Number],
      default: '单位:KG'
    },
    yAxisNameTextStyleColor: {
      type: [String, Function],
      default: '#fff'
    },
    yAxisNameTextStyleFontSize: {
      type: [String, Number],
      default: '16'
    },
    yAxisAxisLineShow: {
      type: [Boolean],
      default: true
    },
    yAxisAxisLineStyleColor: {
      type: [String, Function],
      default: '#fff'
    },
    yAxisAxisLabelColor: {
      type: [String],
      default: '#fff'
    },
    yAxisAxisLabelFontSize: {
      type: [String, Number],
      default: 12
    },
    yAxisAxisLabelInterval: {
      type: [Number, null],
      default: 1
    },
    yAxisInterval: {
      type: [Number, null],
      default: null
    },
    tooltipTrigger: {
      type: [String],
      default: 'axis'
    },
    tooltipFormatter: {
      type: [String, Function, Number],
      default: ''
    },
    yAxisSplitLineShow: {
      type: [Boolean],
      default: false
    },
    yAxisSplitLineStyleColor: {
      type: [String, Function],
      default: '#fff'
    },
    seriesType: {
      type: [String],
      default: 'bar'
    },
    seriesLabelNormalShow: {
      type: [Boolean],
      default: false
    },
    seriesLabelNormalFontSize: {
      type: [String, Number],
      default: 18
    },
    seriesLabelNormalFontWeight: {
      type: [String, Number],
      default: 'bold'
    },
    seriesLabelNormalColor: {
      type: [String, Function],
      default: '#fff'
    },
    seriesLabelNormalPosition: {
      type: [String],
      default: 'top'
    }
  },
  methods: {
    changeSize () {
      this.barChart.resize()
    },
    getData () {
      let that = this
      getAction('/bigScreen/queryHospitalWaste').then(res=>{
        if(res.success){
        that.data = []
        that.seriesValue = []
        that.maxContain = []
        res.result.forEach(element => {
          that.data.push(element.departName)
          that.seriesValue.push(element.medicalWasteWeight*1)
        });
        that.initChart()
        }else{
          that.$message.error(res.message)
        }
      })
    },
    initChart () {
      let that = this
      this.barChart = echarts.init(this.$refs.barChart)
      let option = {
        backgroundColor: that.backgroundColor,
        tooltip: {
          trigger: that.tooltipTrigger,
        },
        xAxis: {
          data: that.data,
          axisLine: {
            lineStyle: {
              color: that.lineStyleColor
            }
          },
          axisLabel: {
            // show:false,
            color: that.axisLabelColor,
            // interval: that.xAxisAxisLabelInterval,
            fontSize: that.xAxisAxisLabelFontSize
            // rotate:270
          }
        },
        grid: {
          // x2: 140
          left: '15%',
          right: '5%',
          // top:'30%',
          bottom: '20%'
        },
        yAxis: {
          name: that.yAxisName,
          nameTextStyle: {
            color: that.yAxisNameTextStyleColor,
            fontSize: that.yAxisNameTextStyleFontSize
          },
          axisLine: {
            show: that.yAxisAxisLineShow,
            lineStyle: {
              color: that.yAxisAxisLineStyleColor
            }
          },
          axisLabel: {
            color: that.yAxisAxisLabelColor,
            fontSize: that.yAxisAxisLabelFontSize
          },
          splitLine: {
            show: that.yAxisSplitLineShow,
            lineStyle: {
              color: that.yAxisSplitLineStyleColor
            }
          },
          interval: that.yAxisInterval
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          // {
          //   barGap: '-100%',
          //   type: 'bar',
          //   // barWidth: 50,
          //   itemStyle: {
          //     normal: {
          //       color: function (params) {
          //         return 'gray'
          //       }
          //     }
          //   },
          //   label: {
          //     normal: {
          //       show: that.seriesLabelNormalShow,
          //       fontSize: that.seriesLabelNormalFontSize,
          //       fontWeight: that.seriesLabelNormalFontWeight,
          //       color: 'gray',
          //       position: that.seriesLabelNormalPosition
          //     }
          //   },
          //   data: that.maxContain
          // },
          {
            type: 'bar',
            barWidth: 50,
            label: {
              normal: {
                show: that.seriesLabelNormalShow,
                fontSize: that.seriesLabelNormalFontSize,
                fontWeight: that.seriesLabelNormalFontWeight,
                color: that.seriesLabelNormalColor,
                position: that.seriesLabelNormalPosition
              }
            },
            data: that.seriesValue
          }
        ]
      }
      this.barChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped></style>
