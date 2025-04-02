<template>
  <a-card>
    <a-row
      ><div style="width:6px;height:30px;background:#13c2c2;float:left;margin-right:14px;"></div>
      <div
        style="font-size: 22px;
  font-family: monospace, monospace;color:#13C2C2"
      >
        统计分析
      </div>
      <div style="float:right;margin-top:-35px;">
        <el-radio v-model="radio" @change="refreshRadio" label="day" border style="margin:0 5px;" size="medium"
          >本日</el-radio
        >
        <el-radio v-model="radio" @change="refreshRadio" label="month" border style="margin:0 5px;" size="medium"
          >本月</el-radio
        >
        <el-radio v-model="radio" @change="refreshRadio" label="quarter" border style="margin:0 5px;" size="medium"
          >本季度</el-radio
        >
        <el-radio v-model="radio" @change="refreshRadio" label="year" border style="margin:0 5px;" size="medium"
          >本年</el-radio
        >
      </div>
    </a-row>
    <a-row style="margin-top:16px;">
      <a-col class="colStyle"><div ref="pieChart" :style="{ width: '100%', height: '100%' }"></div></a-col>
      <a-col class="colStyle" style="padding:20px;">
        <a-row style="font-size:16px;color:#000;font-weight:600">分析</a-row>
        <a-row style="margin-top:30px;color:#000;margin-bottom:70px;"
          >依据饼图我们可以看出“{{
            echartData[0] ? (echartData[0].departName ? echartData[0].departName : '') : ''
          }}”的医废收集总重量为“{{
            echartData[0] ? (echartData[0].totalWeight ? echartData[0].totalWeight : 0) : 0
          }}
          KG”，其中：</a-row
        >
        <a-row style="color:#000;">
          <a-col style="text-align:center" :span="10" :offset="1"
            >感染性废物占比“
            {{
              (
                ((echartData[0] ? (echartData[0].value ? echartData[0].value * 1 : 0) : 0) /
                  (echartData[0] ? (echartData[0].totalWeight ? echartData[0].totalWeight * 1 : 1) : 1)) *
                100
              ).toFixed(2)
            }}
            %”，为“{{ echartData[0] ? (echartData[0].value ? echartData[0].value : 0) : 0 }}” KG</a-col
          >
          <a-col style="text-align:center" :span="10" :offset="2"
            >损伤性废物占比“
            {{
              (
                ((echartData[1] ? (echartData[1].value ? echartData[1].value * 1 : 0) : 0) /
                  (echartData[0] ? (echartData[0].totalWeight ? echartData[0].totalWeight * 1 : 1) : 1)) *
                100
              ).toFixed(2)
            }}
            %”，为“{{ echartData[1] ? (echartData[1].value ? echartData[1].value : 0) : 0 }}” KG</a-col
          >
        </a-row>
        <a-row style="color:#000;margin-top:40px;">
          <a-col style="text-align:center" :span="10" :offset="1"
            >病理性废物占比“
            {{
              (
                ((echartData[2] ? (echartData[2].value ? echartData[2].value * 1 : 0) : 0) /
                  (echartData[0] ? (echartData[0].totalWeight ? echartData[0].totalWeight * 1 : 1) : 1)) *
                100
              ).toFixed(2)
            }}
            %”，为“{{ echartData[2] ? (echartData[2].value ? echartData[2].value : 0) : 0 }}” KG</a-col
          >
          <a-col style="text-align:center" :span="10" :offset="2"
            >化学性废物占比“
            {{
              (
                ((echartData[4] ? (echartData[4].value ? echartData[4].value * 1 : 0) : 0) /
                  (echartData[0] ? (echartData[0].totalWeight ? echartData[0].totalWeight * 1 : 1) : 1)) *
                100
              ).toFixed(2)
            }}
            %”，为“{{ echartData[4] ? (echartData[4].value ? echartData[4].value : 0) : 0 }}” KG</a-col
          >
        </a-row>
        <a-row style="color:#000;margin-top:40px;">
          <a-col style="text-align:center" :span="10" :offset="1"
            >药物性废物占比“
            {{
              (
                ((echartData[3] ? (echartData[3].value ? echartData[3].value * 1 : 0) : 0) /
                  (echartData[0] ? (echartData[0].totalWeight ? echartData[0].totalWeight * 1 : 1) : 1)) *
                100
              ).toFixed(2)
            }}
            %”，为“{{ echartData[3] ? (echartData[3].value ? echartData[3].value : 0) : 0 }}” KG</a-col
          >
          <!-- <a-col style="text-align:center" :span="10" :offset="2">其他占比“ 0 %”，为“0” KG</a-col> -->
        </a-row>
      </a-col>
    </a-row>
    <div style="padding:0.6vw;width:100%">
      <a-row
        style="margin-top:16px;margin-left:0.4vw;border-radius:10px;min-height:90vh;background-color:#eef0f3;width:81.5vw"
      >
        <div ref="barChart" :style="{ width: '100%', height: '70vh', marginLeft: '2vw' }"></div>
        <div style="padding:20px;">
          <a-row style="font-size:16px;color:#000;font-weight:600;margin-bottom:16px;">分析</a-row>
          <a-row style="color:#000;">
            从图表上可以看出该科室医废收集量排名前三的依次为“{{ legendData[0] ? legendData[0] : '' }},{{
              legendData[1] ? legendData[1] : ''
            }},{{ legendData[2] ? legendData[2] : '' }}”；对比图表数据可以了解到在“{{
              radio == 'day'
                ? '本日'
                : radio == 'month'
                ? '本月'
                : radio == 'quarter'
                ? '本季度'
                : radio == 'year'
                ? '本年'
                : ''
            }}”的科室医废收集统计中，收集量最高的为“{{ legendData[0] ? legendData[0] : '' }}”，收集的医废总量为“{{
              collectList[0] ? collectList[0] : 0
            }}KG”。
            <!-- 相比其它科室增长幅度“较大”。 -->
          </a-row>
          <a-row style="color:#000;">
            该科室出库的医废总量为“{{ transportList[0] ? transportList[0] : 0 }} KG”，收集量与出库量的差值为“{{
              (collectList[0] ? collectList[0] * 1 : 0) - (transportList[0] ? transportList[0] * 1 : 0)
            }}KG”；
          </a-row>
          <a-row style="color:#000;">
            相较之下，收集量最低的为“{{
              legendData.length > 0 ? legendData[legendData.length - 1] : ''
            }}”，收集的医废总量为“{{
              collectList.length > 0 ? collectList[collectList.length - 1]*1 : 0
            }}KG”。该科室库的医废总量为“{{
              (collectList.length > 0 ? collectList[collectList.length - 1] : 0)*1 +
                (transportList.length > 0 ? transportList[transportList.length - 1] : 0)*1
            }}KG”，收集量与出库量的差值为“{{
              (collectList.length > 0 ? collectList[collectList.length - 1] : 0)*1 -
                (transportList.length > 0 ? transportList[transportList.length - 1] : 0)*1
            }}KG”。
          </a-row>
        </div>
      </a-row>
    </div>
  </a-card>
</template>
<script>
// import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import * as echarts from 'echarts/core'
import { PieChart, LineChart, BarChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, TitleComponent } from 'echarts/components'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'
import { getAction } from '@/api/manage'
import 'echarts/lib/component/dataZoom'
import { getPieData, getBarData } from '@/api/mwRibbonMaintain/index.js'
// 注册的组件
echarts.use([
  TitleComponent,
  PieChart,
  BarChart,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer
])
export default {
  data() {
    return {
      radio: 'month',
      pieChart: null,
      barChart: null,
      title: '总重量',
      total: 0,
      isFirst: true,
      option1: {},
      option2: {},
      legendData: [],
      collectList: [],
      transportList: [],
      color: ['#E6D00F', '#CF310A', '#D7D7D7', '#0C6DDA', '#0CC55F', 'RED'],
      echartData: [
        {
          name: 'A类',
          value: '0',
          departName: ''
        },
        {
          name: 'B类',
          value: '0'
        },
        {
          name: 'C类',
          value: '0'
        },
        {
          name: 'D类',
          value: '0'
        },
        {
          name: 'E类',
          value: '0'
        },
        {
          name: 'F类',
          value: '0'
        }
      ]
    }
  },
  created() {
    this.getPieList()
  },
  mounted() {
    window.addEventListener('resize', this.changeSize)
  },
  methods: {
    changeSize() {
      this.pieChart.resize()
      this.barChart.resize()
    },
    refreshRadio(e) {
      this.radio = e
      this.getPieList()
    },
    async getPieList() {
      let that = this
      this.echartData = []
      await getPieData({ timeType: this.radio }).then(res => {
        if (res.success) {
          res.result.forEach(element => {
            this.echartData.push({
              name: element.medicalWaste,
              value: element.weight,
              totalWeight: element.totalWeight,
              departName: element.departName
            })
          })
        } else {
          this.$message.error(res.message)
        }
      })
      await getBarData({ timeType: this.radio }).then(res => {
        if (res.success) {
          that.legendData = []
          that.collectList = []
          that.transportList = []
          res.result.forEach(element => {
            that.legendData.push(element.deptName)
            that.collectList.push(element.collectWeight)
            that.transportList.push(element.transportWeight)
          })
        } else {
          this.$message.error(res.message)
        }
      })
      if (that.isFirst) {
        this.initChart()
        this.isFirst = false
      } else {
        this.changeChart()
      }
    },
    changeChart() {
      let that = this
      let bgColor = '#001037'

      let formatNumber = function(num) {
        let reg = /(?=(\B)(\d{3})+$)/g
        return num.toString().replace(reg, ',')
      }
      this.total = this.echartData.reduce((a, b) => {
        return a + b.value * 1
      }, 0)
      that.option1.series[0].data = this.echartData
      that.option1.title[0].text='{name|' + this.title + '}\n{val|' + formatNumber(this.total) + 'KG}',
      that.option2.xAxis[0].data = this.legendData
      that.option2.series[0].data = this.collectList
      that.option2.series[1].data = this.transportList
      this.pieChart.setOption(that.option1)
      this.barChart.setOption(that.option2)
    },
    initChart() {
      let that = this
      this.pieChart = echarts.init(this.$refs.pieChart)
      this.barChart = echarts.init(this.$refs.barChart)
      let bgColor = '#001037'

      let formatNumber = function(num) {
        let reg = /(?=(\B)(\d{3})+$)/g
        return num.toString().replace(reg, ',')
      }
      this.total = this.echartData.reduce((a, b) => {
        return a + b.value * 1
      }, 0)
      that.option1 = {
        // backgroundColor: bgColor,
        color: this.color,
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        title: [
          {
            text: '{name|' + this.title + '}\n{val|' + formatNumber(this.total) + 'KG}',
            top: 'center',
            left: 'center',
            textStyle: {
              rich: {
                name: {
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#000',
                  padding: [10, 0]
                },
                val: {
                  fontSize: 18,
                  fontWeight: 'bolder',
                  color: '#000'
                }
              }
            }
          },
          {
            text: '医疗机构医废类型收集量统计 (KG)',
            top: 20,
            left: 20,
            textStyle: {
              fontSize: 14,
              color: '#000',
              fontWeight: 700
            },
            show: true
          }
        ],
        legend: {
          type: 'scroll',
          bottom: '0;',
          textStyle: {
            color: '#000',
            fontSize: 14
            //fontWeight: 'normal',
          }
        },
        series: [
          {
            type: 'pie',
            // roseType: 'radius',
            radius: ['30%', '60%'],
            center: ['50%', '50%'],
            data: this.echartData,
            itemStyle: {
              normal: {
                borderColor: bgColor,
                borderWidth: 2
              }
            },
            labelLine: {
              normal: {
                length: 10,
                length2: 40,
                lineStyle: {
                  // color: '#e6e6e6'
                }
              }
            },
            label: {
              normal: {
                formatter: params => {
                  return (
                    '{icon|●}{name|' +
                    params.name +
                    '}\n{value|' +
                    formatNumber(params.value) +
                    '}' +
                    '(' +
                    params.percent +
                    '%)'
                  )
                },
                // padding: [0 , -100, 25, -100],
                rich: {
                  icon: {
                    fontSize: 16,
                    color: 'inherit'
                  },
                  name: {
                    fontSize: 18,
                    color: '#000'
                  },
                  value: {
                    fontSize: 18,
                    fontWeight: 'bolder',
                    color: 'inherit'
                    // color: '#333333'
                  }
                }
              }
            }
          }
        ]
      }
      that.option2 = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          right: '47%',
          top: '12%'
          // data: ["Forest", "Steppe", "Desert", "Wetland"],
        },
        grid: {
          left: '0',
          top: '22%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: true },
            axisLabel: { color: '#000' },
            data: this.legendData
          }
        ],
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        yAxis: [
          {
            type: 'value',
            // nameGap: 30,
            axisTick: { show: true },
            axisLine: { show: true },
            axisLabel: { color: '#000' },
            // 修改y轴分割线
            splitLine: {
              lineStyle: {
                color: '#000',
                type: 'dashed'
              }
            }
          }
        ],
        title: [
          {
            text: '科室医废收集量/出库量统计 (KG)',
            top: 20,
            left: 0,
            textStyle: {
              fontSize: 14,
              color: '#000',
              fontWeight: 700
            },
            show: true
          }
        ],
        series: [
          {
            name: '收集重量',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            data: that.collectList,
            itemStyle: {
              normal: {
                borderColor: bgColor,
                borderWidth: 2
              }
            }
          },
          {
            name: '出库重量',
            type: 'bar',
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              normal: {
                borderColor: bgColor,
                borderWidth: 2
              }
            },
            data: that.transportList
          }
        ]
      }
      this.pieChart.setOption(that.option1)
      this.barChart.setOption(that.option2)
    }
  }
}
</script>
<style scoped>
.colStyle {
  margin-left: 1vw;
  margin-right: 0.4vw;
  float: left;
  width: 40vw;
  border-radius: 10px;
  height: 55vh;
  background-color: #eef0f3;
}
/deep/.ant-card-body {
  padding: 10px !important;
}
</style>
