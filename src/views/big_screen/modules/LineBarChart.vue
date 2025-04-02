<template>
  <div :style="{ height: height, width: width }">
    <div style="width:100%;height:10px;text-align:center;color:#fff;font-weight:600;font-size:16px;">
      {{ title }}
    </div>
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
import 'echarts/lib/component/dataZoom'
import { PieChart } from 'echarts/charts'
import { getAction } from '@/api/manage'
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
var isShow = false
export default {
  name: 'barChart',
  //   mixins: [JeecgListMixin],
  components: {},
  data() {
    return {
      barChart: null,
      timeData: [],
      seriesData: [],
      legendData: []
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
    height: {
      type: [String, Number],
      default: '95%'
    },
    width: {
      type: [String, Number],
      default: '95%'
    },
    title: {
      type: [String, Number],
      default: ''
    }
  },
  methods: {
    changeSize() {
      this.barChart.resize()
    },
    changeShow(a) {
      let that = this
      isShow = a
      let option = {
        legend: {
          show: a
        }
      }
      that.barChart.setOption(option)
    },
    getData() {
      let that = this
      this.timeData = []
      this.seriesData = []
      this.legendData = []
      getAction('/bigScreen/queryCurveWasteType').then(res=>{
         if (res.code === 200) {
          let data = res.result
          let isSeries = 0
          for (let i = 0; i < data.length; i++) {
            this.timeData.push(data[i].days)
            let d = data[i].list

            if (isSeries === 0 && d != '') {
              isSeries = 1
              for (let j = 0; j < d.length; j++) {
                let seriesDataChild = {
                  itemStyle: {
                    normal: {
                      color: null,
                      lineStyle: {
                        color: null
                      }
                    }
                  }
                }
                seriesDataChild.name = d[j].medicalWasteType
                this.legendData.push(d[j].medicalWasteType)
                seriesDataChild.type = 'line'
                // seriesDataChild.stack = '库存量'
                if (seriesDataChild.name.indexOf('化学性废物') != -1) {
                  seriesDataChild.itemStyle.normal.color = 'blue'
                  seriesDataChild.itemStyle.normal.lineStyle.color = 'blue'
                } else if (seriesDataChild.name.indexOf('药物性废物') != -1) {
                  seriesDataChild.itemStyle.normal.color = 'yellow'
                  seriesDataChild.itemStyle.normal.lineStyle.color = 'yellow'
                } else if (seriesDataChild.name.indexOf('损伤性废物') != -1) {
                  seriesDataChild.itemStyle.normal.color = 'red'
                  seriesDataChild.itemStyle.normal.lineStyle.color = 'red'
                } else if (seriesDataChild.name.indexOf('感染性废物') != -1) {
                  seriesDataChild.itemStyle.normal.color = 'green'
                  seriesDataChild.itemStyle.normal.lineStyle.color = 'green'
                }else if(seriesDataChild.name.indexOf('病理性废物') != -1) {
                  seriesDataChild.itemStyle.normal.color = 'pink'
                  seriesDataChild.itemStyle.normal.lineStyle.color = 'pink'
                }
                this.seriesData.push(seriesDataChild)
              }
            }
          }
          for (let i = 0; i < this.seriesData.length; i++) {
            let seriesNameData = []
            for (let j = 0; j < data.length; j++) {
              let d = data[j].list
              if (d != '' && d.length != 0) {
                for (let z = 0; z < d.length; z++) {
                  if (d[z].medicalWasteType === this.seriesData[i].name) {
                    seriesNameData.push(d[z].medicalWasteWeight)
                  }
                }
              } else {
                seriesNameData.push(0)
              }
            }
            this.seriesData[i].data = seriesNameData
          }
          let option = {
            // title: {
            //   text: '油罐库存分析'
            // },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              show: isShow,
              data: this.legendData
            },
            grid: {
              left: '8%',
              right: '4%',
              bottom: '3%',
              top:'15%',
              containLabel: true
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.timeData
            },
            yAxis: {
              type: 'value',
              name: '医废数量(KG)'
            },
            series: this.seriesData
          }
          that.$nextTick(() => {
            that.barChart.setOption(option)
          })
        }
      })
    },
    initChart() {
      let that = this
      that.barChart = echarts.init(this.$refs.barChart)
      let option = {
        backgroundColor: 'transparent',
        tooltip: {
          // trigger: 'value',
          // axisPointer: {
          // type: 'shadow',
          // label: {
          //   show: true,
          //   backgroundColor: '#333'
          // }
          // }
          // position: ['90%', '10%']
        },
        grid: {
          top: '10%',
          left: '10%',
          right: '8%',
          bottom: '1%',
          containLabel: true
        },
        legend: {
          // itemGap: 50,
          show: false,
          data: [''],
          top: '10%',
          left: '40%',
          textStyle: {
            color: '#f9f9f9',
            borderColor: '#fff'
          }
        },
        // interval: 150,
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: true,
              lineStyle: {
                color: '#f9f9f9'
              }
            },
            axisLabel: {
              //坐标轴刻度标签的相关设置
              textStyle: {
                color: '#d1e6eb',
                margin: 15
              }
            },
            axisTick: {
              show: false
            },
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
          }
        ],
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false,
              lineStyle: {
                color: '#0a3256'
              }
            },
            name: '',
            nameTextStyle: {
              color: '#fff',
              fontSize: 14
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#f9f9f9'
              }
            },
            axisLabel: {
              //坐标轴刻度标签的相关设置
              // show:true,
              textStyle: {
                color: '#d1e6eb'
                // margin: 15
              }
            }
            // axisTick: {
            //   show: false
            // }
          }
        ],
        series: [
          {
            name: '',
            type: 'line',
            // smooth: true, //是否平滑曲线显示
            // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 6,
            lineStyle: {
              normal: {
                color: '#28ffb3' // 线条颜色
              },
              borderColor: '#f0f'
            },
            label: {
              show: true,
              position: 'top',
              textStyle: {
                color: '#fff'
              }
            },
            itemStyle: {
              normal: {
                color: '#28ffb3'
              }
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(0,154,120,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,0,0, 0)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(53,142,215, 0.3)', //阴影颜色
                shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              }
            },
            data: [0, 0, 0, 0, 0, 0, 0]
          }
          // {
          //   name: '最新注册量',
          //   type: 'bar',
          //   barWidth: 20,
          //   tooltip: {
          //     show: true
          //   },
          //   label: {
          //     show: true,
          //     position: 'top',
          //     textStyle: {
          //       color: '#fff'
          //     }
          //   },
          //   itemStyle: {
          //     normal: {
          //       color: function(params) {
          //         var colorList = ['#0ec1ff', '#10cdff', '#12daff', '#15ebff', '#17f8ff', '#1cfffb', '#1dfff1']
          //         return colorList[params.dataIndex]
          //       }
          //     }
          //   },
          //   data: [200, 382, 102, 267, 186, 315, 316]
          // }
        ]
      }
      that.barChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped></style>
