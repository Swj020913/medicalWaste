<template>
  <div :style="{ height: height, width: width }" @mouseover="over()" @mouseout="startTime()">
    <div style="width: 100%; height: 10px; text-align: center; color: #fff; font-weight: 600; font-size: 16px;">
      {{ title }}
    </div>
    <div ref="pieChart" :style="{ width: width, height: height }"></div>
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
import { PieChart } from 'echarts/charts'
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
  CanvasRenderer,
])
export default {
  name: 'pieChart',
  //   mixins: [JeecgListMixin],
  components: {},
  data() {
    return {
      option: null,
      pieChart: null,
      time: null,
    }
  },
  props: {
    width: {
      type: [String, Number],
      default: '500px',
    },
    height: {
      type: [String, Number],
      default: '400px',
    },
    title: {
      type: [String, Number],
      default: '圆环图',
    },
    chartTitleText: {
      type: [String, Number],
      default: '',
    },
    chartTitleTextStyleFontSize: {
      type: [Number, String],
      default: 16,
    },
    chartTitleTextStyleColor: {
      type: [String, Function],
      default: '#fff',
    },
    chartTitleLeft: {
      type: [String, Number],
      default: '2%',
    },
    tooltipFormatter: {
      type: [String, Number],
      default: 0,
    },
    chartTitleText2: {
      type: [String, Number],
      default: '合计',
    },
    chartTitleSubText2: {
      type: [String, Number],
      default: '1524吨',
    },
    legendOrient: {
      type: [String],
      default: 'vertical',
    },
    legendLeft: {
      type: [String, Number],
      default: '60%',
    },
    legendAlign: {
      type: [String],
      default: 'left',
    },
    legendTop: {
      type: [String, Number],
      default: 'middle',
    },
    legendTextStyleFontWeight: {
      type: [String, Number],
      default: 600,
    },
    legendTextStyleColor: {
      type: [String, Function],
      default: '#fff',
    },
    legendHeight: {
      type: [Number, String],
      default: 250,
    },
    seriesName: {
      type: [String, Number],
      default: '',
    },
    seriesRadius: {
      type: [String],
      default: '40%',
    },
    seriesLabelNormalShow: {
      type: [Boolean, Number],
      default: false,
    },
    seriesLabelNormalPosition: {
      type: [String],
      default: 'outter',
    },
    tooltipShow: {
      type: [Boolean],
      default: true,
    },
    data: {
      type: [Array],
      default: () => {
        return [
          { value: 335, legendname: '油品1', name: '油品1' },
          { value: 310, legendname: '油品2', name: '油品2' },
          { value: 234, legendname: '油品3', name: '油品3' },
          { value: 154, legendname: '油品4', name: '油品4' },
          { value: 335, legendname: '油品5', name: '油品5' },
        ]
      },
    },
    colorArr: {
      type:[Array],
      default:[]
    }
  },
  watch: {
    data(n, o) {
      // pieChart.dispose()
      // this.initChart()
      this.initChart(), window.addEventListener('resize', this.changeSize)
      if (this.time != null) {
        clearInterval(this.time)
        this.startTime()
      } else {
        this.startTime()
      }
    },
    tooltipShow(n, o) {
      // if (pieChart != null || pieChart != undefined) {
      //   pieChart.dispose()
      // }
      // this.initChart()
      let that = this
      this.pieChart.setOption({
        tooltip: {
          show: that.tooltipShow,
        },
      })
    },
  },
  methods: {
    changeSize() {
      this.pieChart.resize()
    },
    initChart() {
      let that = this
      this.pieChart = echarts.init(this.$refs.pieChart)
      that.option = {
        title: [
          {
            text: that.chartTitleText,
            textStyle: {
              fontSize: that.chartTitleTextStyleFontSize,
              color: that.chartTitleTextStyleColor,
            },
            left: that.chartTitleLeft,
          },
          {
            text: that.chartTitleText2,
            subtext: that.chartTitleSubText2,
            textStyle: {
              fontSize: that.chartTitleTextStyleFontSize,
              color: that.chartTitleTextStyleColor,
            },
            subtextStyle: {
              fontSize: that.chartTitleTextStyleFontSize,
              color: that.chartTitleTextStyleColor,
            },
            textAlign: 'center',
            x: '27.5%',
            y: '39%',
          },
        ],
        tooltip: {
          trigger: 'item',
          show: that.tooltipShow,
          extraCssText: 'z-index:410',
          // formatter: function (parms) {
          //   if (that.tooltipFormatter === 0) {
          //     var str =
          //       parms.marker +
          //       '' +
          //       parms.data.legendname +
          //       '</br>' +
          //       '吨数：' +
          //       parms.data.value +
          //       '吨</br>' +
          //       '使用率：' +
          //       parms.percent +
          //       '%'
          //     return str
          //   } else {
          //     return (
          //       '油料名称：' +
          //       parms.name +
          //       '<br/>储存量：' +
          //       parms.data.value +
          //       '(m³)' +
          //       '<br/>' +
          //       '占比：' +
          //       parms.percent +
          //       '%'
          //     )
          //   }
          // },
        },
        grid: {
          // x2: 140
          left: '12%',
          right: '20%',
          // top:'30%',
          bottom: '30%',
        },
        legend: {
          type: 'scroll',
          orient: that.legendOrient,
          left: that.legendLeft,
          align: that.legendAlign,
          top: that.legendTop,
          textStyle: {
            color: that.legendTextStyleColor,
            fontWeight: that.legendTextStyleFontWeight,
          },
          height: that.legendHeight,
        },
        series: [
          {
            name: that.seriesName,
            type: 'pie',
            center: ['28%', '50%'],
            radius: [that.seriesRadius, '65%'],
            clockwise: false, //饼图的扇区是否是顺时针排布
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: that.seriesLabelNormalShow,
                textStyle: {
                  color: that.legendTextStyleColor,
                },
                position: that.seriesLabelNormalPosition,
                formatter: function (parms) {
                  return parms.data.legendname
                },
              },
            },
            labelLine: {
              normal: {
                length: 5,
                length2: 3,
                smooth: true,
              },
            },
            color: that.colorArr,
            data: that.data,
          },
        ],
      }
      this.pieChart.setOption(that.option)
    },
    startTime() {
      let that = this
      let currentIndex = -1
      let dataLen = that.option.series[0].data.length
      that.time = setInterval(() => {
        // 取消之前高亮的图形
        that.pieChart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: currentIndex,
        })
        currentIndex = (currentIndex + 1) % dataLen
        // 高亮当前图形
        that.pieChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: currentIndex,
        })
        // 显示 tooltip
        that.pieChart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: currentIndex,
        })
      }, 1000)
    },
    over() {
      clearInterval(this.time)
      // 取消之前高亮的图形
      this.pieChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      })
    },
  },
}
</script>

<style lang="less" scoped></style>
