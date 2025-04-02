<template>
  <div id="dp_main">
    <!-- <svg> -->
    <!-- </svg> -->
    <div class="popContainer" v-if="isShow">
      <div
        style="color:#fff;position:absolute;right:30px;top:20px;font-size:24px"
        @click="
          () => {
            isShow = false
            $refs.lineBarChart.changeShow(false)
          }
        "
      >
        <a-icon type="close-circle" />
      </div>
      <div class="partcomwithborder" style="margin-left:5%;margin-top:5vh;width:90%;height:90%">
        <div class="partcomwithbordersubcontent">
          <d-bar-chart v-show="showType == 0" :title="''" :width="'98%'" :height="'100%'" />
          <bar-chart
            v-show="showType == 1"
            :width="'96%'"
            :height="'100%'"
            :backgroundColor="'transparent'"
            :title="''"
          />
          <line-bar-chart
            v-show="showType == 2"
            :height="'90%'"
            :width="'90%'"
            style="margin-left:8%"
          />
        </div>
      </div>
      <div style="text-align:center;width:100%;font-size:20px;color:#fff">可使用鼠标滚轮放大缩小</div>
    </div>
    <div
      style="position: absolute;
  left: 83%;
  top: 2vh;
  font-size: 5vh;
  color: #fff;
  z-index: 10;"
    >
      <span id="time" class="words words-1" />
      <a-icon @click="Urlback()" style="margin-left:60px;" class="home" type="home" />
    </div>
    <!-- <img style="height:9vh;position:absolute;left:7vw;top:2.5vh" src="@/assets/left_title.png" /> -->
    <a-col :span="7">
      <a-row class="leftSide" style="margin-top: 12vh;">
        <dv-border-box-11
          style="margin-left:0.5vw;width:104%;height:100%;padding-top:22%"
          title="机构信息汇总"
        >
          <a-row>
            <a-col :span="8">
              <dv-decoration-9
                style="width:80%;height:17vh;color:#fff;font-weight:600;font-size:22px;left:50%;margin-left:-40%;"
              >{{leftTopDataObj.yljgNum==undefined?0:leftTopDataObj.yljgNum}}</dv-decoration-9>
              <p
                style="color:#fff;width:100%;text-align:center;margin-top:20px;font-size:15px;font-weight:600"
              >医疗机构数量统计</p>
            </a-col>
            <a-col :span="8">
              <dv-decoration-9
                style="width:80%;height:17vh;color:#fff;font-weight:600;font-size:22px;left:50%;margin-left:-40%;"
              >{{leftTopDataObj.wsyNum==undefined?0:leftTopDataObj.wsyNum}}</dv-decoration-9>
              <p
                style="color:#fff;width:100%;text-align:center;margin-top:20px;font-size:15px;font-weight:600"
              >卫生院数量统计</p>
            </a-col>
            <a-col :span="8">
              <dv-decoration-9
                style="width:80%;height:17vh;color:#fff;font-weight:600;font-size:22px;left:50%;margin-left:-40%;"
              >{{leftTopDataObj.zsNum==undefined?0:leftTopDataObj.zsNum}}</dv-decoration-9>
              <p
                style="color:#fff;width:100%;text-align:center;margin-top:20px;font-size:15px;font-weight:600"
              >诊所数量统计</p>
            </a-col>
          </a-row>
        </dv-border-box-11>
        <!-- <div
          class="partcomwithborder"
          style="margin-left:0.5vw;width:104%;height:100%"
        >
          <div class="partcomwithbordersubcontent">
            <p style="color:#fff;font-size:24px;font-weight:600;margin-left:35%">机构信息汇总</p>
            <a-row style="margin-top:8%">
            <a-col :span="8">
              <dv-decoration-9 style="width:90%;height:18vh;color:#fff;font-weight:600;font-size:22px;left:50%;margin-left:-45%;">{{leftTopDataObj.yljgNum==undefined?0:leftTopDataObj.yljgNum}}</dv-decoration-9>
              <p style="color:#fff;margin-left:15%;margin-top:20px;font-size:15px;font-weight:600">医疗机构数量统计</p>
            </a-col>
            <a-col :span="8">
              <dv-decoration-9 style="width:90%;height:18vh;color:#fff;font-weight:600;font-size:22px;left:50%;margin-left:-45%;">{{leftTopDataObj.wsyNum==undefined?0:leftTopDataObj.wsyNum}}</dv-decoration-9>
              <p style="color:#fff;margin-left:20%;margin-top:20px;font-size:15px;font-weight:600">卫生院数量统计</p>
            </a-col>
            <a-col :span="8">
              <dv-decoration-9 style="width:90%;height:18vh;color:#fff;font-weight:600;font-size:22px;left:50%;margin-left:-45%;">{{leftTopDataObj.zsNum==undefined?0:leftTopDataObj.zsNum}}</dv-decoration-9>
              <p style="color:#fff;margin-left:25%;margin-top:20px;font-size:15px;font-weight:600">诊所数量统计</p>
            </a-col>
            </a-row>
          </div>
        </div>-->
      </a-row>
      <a-row class="leftSide">
        <!-- <pie-chart
          :title="'出库统计'"
          :seriesLabelNormalShow="false"
          :legendLeft="'55%'"
          :width="'100%'"
          :height="'100%'"
        />-->
        <!-- <div
          class="partcomwithborder"
          @dblclick="changeShow(1)"
          :title="'双击可放大'"
          style="margin-left:0.5vw;width:104%;height:100%"
        >
        <div class="partcomwithbordersubcontent">-->
        <!-- <bar-chart
              :width="'100%'"
              :height="'100%'"
              :backgroundColor="'transparent'"
              :title="''"
        />-->
        <!-- </div> -->
        <!-- </div> -->
        <dv-border-box-11
          style="margin-left:0.5vw;width:104%;height:100%;padding-top:12%"
          title="各医疗机构医废统计"
        >
          <bar-chart :width="'96%'" :height="'100%'" :backgroundColor="'transparent'" :title="''" />
        </dv-border-box-11>
      </a-row>
      <!-- <a-row class="leftSide" style="margin-bottom: 0;">
        <div
          class="partcomwithborder"
          @dblclick="changeShow(2)"
          :title="'双击可放大'"
          style="margin-left:0.5vw;width:104%;height:100%"
        >
          <div class="partcomwithbordersubcontent">
            <line-bar-chart :height="'100%'" ref="lineBarChart" :width="'100%'" />
          </div>
        </div>
      </a-row>-->
    </a-col>
    <a-col :span="10">
      <a-row class="topSide">
        <img style="position:absolute;width:100vw;left:-31vw;top:1vh" src="@/assets/back_title.png" />
        <div class="title">医疗废物溯源统计系统</div>
      </a-row>
      <a-row class="centerSide" style="position: relative;">
        <dv-border-box-10 style="width:100%;height:100%">
          <div id="map"></div>
        </dv-border-box-10>
        <!-- <div class="partcomwithborder" style="width:100%;height:100%">
          <div class="partcomwithbordersubcontent">
        <div id="map"></div>-->
        <!-- <div
              style="position: absolute; right: 20px; top: 10px; width: 8vw; z-index: 500; background: transparent;"
            >
              <a-select v-model="mapTypeValue" style="width: 100%;" @change="changeMap()">
                <a-select-option
                  v-for="(item, index) in mapType"
                  :key="index"
                  :value="item.value"
                >{{ item.text }}</a-select-option>
              </a-select>
        </div>-->
        <!-- </div> -->
        <!-- </div> -->
      </a-row>
      <a-row class="bottomSide">
        <dv-border-box-10 style="width:100%;height:100%;color:#fff;font-size:16px;font-weight:600">
        <div v-if="bottomObj.orgName!=null">
          <a-col :span="24" style="margin-left:40px;padding-top:35px;color:orange;font-size:18px;">{{'收集医废重量（'+bottomObj.orgName+'）'}}</a-col>
          <!-- <a-col :span="6" style="padding-top:20px">日期:{{moment(new Date()).format('YYYY-MM-DD')}}</a-col> -->
          <a-col :span="7" style="margin-left:40px;padding-top:20px">{{bottomObj.nameArr[0]+':'+bottomObj.valueArr[0]+'kg'}}</a-col>
          <a-col :span="7" style="padding-top:20px">{{bottomObj.nameArr[1]+':'+bottomObj.valueArr[1]+'kg'}}</a-col>
          <a-col :span="7" style="padding-top:20px">{{bottomObj.nameArr[2]+':'+bottomObj.valueArr[2]+'kg'}}</a-col>
          <a-col :span="7" style="margin-left:40px;padding-top:20px">{{bottomObj.nameArr[3]+':'+bottomObj.valueArr[3]+'kg'}}</a-col>
          <a-col :span="7" style="padding-top:20px">{{bottomObj.nameArr[4]+':'+bottomObj.valueArr[4]+'kg'}}</a-col>
          </div>
        </dv-border-box-10>
        <!-- <div class="partcomwithborder" style="width:100%;height:100%">
          <div class="partcomwithbordersubcontent"></div>
        </div>-->
      </a-row>
    </a-col>
    <a-col :span="7">
      <a-row class="leftSide" style="margin-top: 12vh;">
        <dv-border-box-11
          style="margin-left:1vw;width:104%;height:100%;padding-top:9%"
          title="医疗机构医废占比统计"
        >
          <div
            ref="pieChart"
            :style="{ width: '90%', height: '95%',left:'5%' }"
          ></div>
        </dv-border-box-11>
        <!-- <div class="partcomwithborder" style="margin-left:1vw;width:104%;height:100%">
        <div class="partcomwithbordersubcontent">-->
        <!-- <pie-chart
              :width="'100%'"
              :height="'100%'"
              :title="''"
              :seriesRadius="'0%'"
              :legendLeft="'54%'"
              :chartTitleText2="''"
              :tooltipFormatter="1"
              :chartTitleSubText2="''"
              :data="kcList"
              :colorArr="colors"
              :tooltipShow="showPie"
              ref="ylkc"
        />-->
        <!-- </div> -->
        <!-- </div> -->
      </a-row>
      <a-row class="leftSide">
        <!-- <div class="partcomwithborder" style="margin-left:1vw;width:104%;height:100%">
          <div class="partcomwithbordersubcontent"></div>
        </div>-->
        <dv-border-box-11
          style="margin-left:1vw;width:104%;height:100%;padding-top:12%"
          title="每日产生医废数量统计"
        >
          <!-- <dv-decoration-12 style="width:150px;height:150px;margin-left:-75px;left:50%" /> -->
          <line-bar-chart></line-bar-chart>
        </dv-border-box-11>
      </a-row>
      <!-- <a-row class="leftSide" style="margin-top:2vh">
        <div class="partcomwithborder" style="margin-left:1vw;width:104%;height:106%">
          <div class="partcomwithbordersubcontent">
          </div>
        </div>
      </a-row>-->
    </a-col>
  </div>
</template>

<script>
import * as echarts from 'echarts/core'
import moment from 'moment'
import 'echarts/lib/component/dataZoom'
import { loadDictOptions } from '@/utils/util'
import BarChart from './modules/BarChart'
import DBarChart from './modules/DBarChart'
import { PieChart } from 'echarts/charts'
import LineBarChart from './modules/LineBarChart'
import { getAction } from '@/api/manage'
import { getPieData, getBarData } from '@/api/mwRibbonMaintain/index.js'
echarts.use([
  PieChart,
])
export default {
  name: 'indexDp',
  components: {
    BarChart,
    LineBarChart,
    DBarChart,
  },
  data() {
    return {
      mapTypeValue: 'tiles2',
      map: null,
      bottomObj:{orgName:null},
      pieChart: null,
      mapDatas: [], //标签信息
      icon: null, //标志图片信息
      showPie: true,
      showType: null,
      isShow: false,
       title: '总重量',
      mapHref: window._CONFIG['domianURL'] + '/static/file',
      kcList: [],
      localName: null,
      leftTopDataObj:{},
      markGroup:[],
      colors: [],
      echartData:[],
      color: ['#E6D00F', '#CF310A', '#D7D7D7', '#0C6DDA', '#0CC55F', 'RED'],
    }
  },
  mounted() {
    this.getPieList()
    window.addEventListener('resize', this.changeSize)
     //地图限制
    let northwest = L.latLng(120, 350)
    let southeast = L.latLng(-80, -206)
    this.map = L.map('map', {
      // center: [29.608545, 200.384717],
      /* maxZoom: 3,
        maxNativeZoom: 3, */
      maxZoom: 3,
      maxNativeZoom: 3,
      minZoom: 1,
      doubleClickZoom: false,
      maxBounds: L.latLngBounds(northwest, southeast)
    })
    this.map.on('click', ({
      latlng
    }) => {
      console.log(latlng)
    })
    // 初始化标点图标信息
    this.icon = new L.Icon({
      iconUrl: this.mapHref + '/marker-icon.png',
      shadowUrl: this.mapHref + '/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
    //初始化标志组
      this.markGroup = L.layerGroup([]).addTo(this.map)
    this.startTimeShow()
  },
  methods: {
    moment,
    changeSize() {
      this.pieChart.resize()
    },
    async getPieList() {
      let that = this
      this.echartData = []
      await getAction('/bigScreen/queryScreenStatistics').then(res => {
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
        this.initChart()
    },
    initChart() {
      let that = this
      this.pieChart = echarts.init(this.$refs.pieChart)
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
                  color: '#fff',
                  padding: [10, 0]
                },
                val: {
                  fontSize: 18,
                  fontWeight: 'bolder',
                  color: '#fff'
                }
              }
            }
          },
          {
            text: '',
            top: 20,
            left: 20,
            textStyle: {
              fontSize: 14,
              color: '#fff',
              fontWeight: 700
            },
            show: true
          }
        ],
        legend: {
          type: 'scroll',
          bottom: '0;',
          textStyle: {
            color: '#fff',
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
                    fontSize: 14,
                    color: '#fff'
                  },
                  value: {
                    fontSize: 16,
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
      this.pieChart.setOption(that.option1)
    },
    changeShow(num) {
      this.showType = num
      if (num == 2) {
        this.$refs.lineBarChart.changeShow(true)
      }
      this.isShow = true
    },
    async initDictConfig() {
      
    },
    leftTopData(){
      let that = this
      getAction('/bigScreen/queryHospitalScreen').then(res=>{
        if(res.success){
          that.leftTopDataObj = {}
          res.result.forEach(element => {
            if(element.hospitalCategory=='1'){
              that.leftTopDataObj.yljgNum = element.hospitalNum
            }else if(element.hospitalCategory=='2'){
              that.leftTopDataObj.wsyNum = element.hospitalNum
            }else if(element.hospitalCategory=='3'){
              that.leftTopDataObj.zsNum = element.hospitalNum
            }
          });
        }else{
          this.$message.error(res.message)
        }
      })
    },
    Urlback() {
      window.history.back(-1)
    },
    showtime() {
      let noatime = new Date()
      let h = noatime.getHours()
      let m = noatime.getMinutes()
      let s = noatime.getSeconds()
      h = this.checktime(h)
      m = this.checktime(m)
      s = this.checktime(s)
      return h + ':' + m + ':' + s
    },
    checktime(x) {
      if (x < 10) {
        x = '0' + x
      }
      return x
    },
    startTimeShow() {
      let div1 = document.getElementById('time')
      setInterval(() => {
        // for (let i = 0; i < div1.length; i++) {
        div1.innerHTML = this.showtime()
        // }
      }, 1000)
    },
    getCodeList() {
      getAction('/sys/common/getDescription?dicCode=screen_map').then(res => {
        this.CodeList = res.result
        this.mapTypeValue = res.result[0].value
        var opt = {
          tileSize: L.point(355, 206)
        }
        L.tileLayer(this.mapHref + '/' + this.mapTypeValue + '/{z}/{x}/{y}.png', opt).addTo(this.map)
        this.map.setView([35, 70], 2)
        this.clearMarkers()
            this.getWareHouseMarkers()
      })
    },
     getWareHouseMarkers() {
       let that = this
        getAction('/sys/sysDepart/orgLists').then(res => {
          if (res.code == 200) {
            this.mapDatas = res.result
             getAction('/bigScreen/queryHospitalWasteType?orgCode='+that.mapDatas[0].orgCode).then(res=>{
              if(res.success){
                that.bottomObj.nameArr = []
                that.bottomObj.valueArr = []
                that.bottomObj.orgName = that.mapDatas[0].departName
                res.result.forEach(element => {
                  that.bottomObj.nameArr.push(element.medicalWasteType)
                  that.bottomObj.valueArr.push(element.medicalWasteWeight)
                });
              }else{
                that.$message.error(res.message)
              }
            })
            this.addWareHouseMarkers()
          }
        })
      },
      addWareHouseMarkers() {
        for (let i = 0; i < this.mapDatas.length; i++) {
          let marker = L.marker([this.mapDatas[i].latitude, this.mapDatas[i].longitude], {
            icon: this.icon,
          })
          let that = this
          this.markGroup.addLayer(marker)
          marker.on('click', () => {
            getAction('/bigScreen/queryHospitalWasteType?orgCode='+that.mapDatas[i].orgCode).then(res=>{
              if(res.success){
                that.bottomObj.nameArr = []
                that.bottomObj.valueArr = []
                that.bottomObj.orgName = that.mapDatas[i].departName
                res.result.forEach(element => {
                  that.bottomObj.nameArr.push(element.medicalWasteType)
                  that.bottomObj.valueArr.push(element.medicalWasteWeight)
                });
              }else{
                that.$message.error(res.message)
              }
            })
          })
        }
      },
      //清除所有标志
      clearMarkers() {
        this.markGroup.clearLayers()
      },
  },
  created() {
    this.initDictConfig()
    this.getCodeList()
    this.leftTopData()
  },
  watch: {
    
  },
  beforeDestroy() {
  }
}
</script>

<style lang="less" scoped>
@base: #00acff;

#map {
  width: 98%;
  height: 98%;
  left: 1%;
  top: 1%;
}

/deep/.leaflet-control-zoom,
.leaflet-bar,
.leaflet-control {
  display: none;
}

/deep/label.el-form-item__label {
  color: #fff;
  font-size: 18px;
}

#dp_main {
  width: 100%;
  height: 100vh;
  background-image: url('../../assets/backImage.jpg');
  // background: #000;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.leftSide {
  width: 90%;
  height: 40.8vh;
  margin-bottom: 18px;
  // border:1px solid red;
  //   background-color: #fff;
  // margin-top: 1px;
}

.rightSide {
  width: 90%;
  height: 55vh;
  // margin-bottom: 18px;
  // margin-top: 18px;
}

.topSide {
  width: 100%;
  height: 11vh;
  // margin-bottom: 8px;
  // margin-top: 18px;
}

.centerSide {
  width: 100%;
  height: 60.8vh;
  margin-bottom: 10px;
  margin-top: 1vh;
}

.bottomSide {
  width: 100%;
  height: 20.8vh;
  margin-top: 18px;
}

/deep/ #map {
  background: transparent;

  .leaflet-control-container {
    .leaflet-right {
      a {
        display: none !important;
      }
    }
  }
}

.dialogMsg {
  margin: 0 auto;
  text-align: center;
}

ul {
  padding: 0px 50px 0px 0px;
  margin: 0;
  list-style: none;

  li {
    margin-bottom: 25px;

    .fl {
      width: 48%;
      letter-spacing: 5px;
      text-align: right;
      color: @base;
    }

    .fr {
      width: 50%;
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      border-bottom: 1px solid #999;
      padding-bottom: 10px;
      color: @base;
    }
  }
}

/deep/.el-dialog__body {
  padding-top: 20px;
}

.clearfix {
  line-height: 35%;
}

.button {
  width: 8vw;
  border: none;
  height: 8.7vh;
  font-size: 16px;
  font-weight: 600;
  // border-radius: 5vh;
  margin-top: -1.1vh;
  background-color: transparent;
  color: #fff;
}
.button:hover {
  // background-color: rgb(66, 175, 248);
  color: rgb(0, 255, 149);
  // border: 1px solid #18aaff;
}

.home {
  position: absolute;
  left: 75%;
  top: 2vh;
  // font-size: 5vh;
  // color: #fff;
  // z-index: 10;
}

.home:hover {
  cursor: pointer;
  color: rgb(19, 194, 194);
}

/deep/.el-dialog {
  background-color: #045051;
  opacity: 0.8;
}

/deep/.el-dialog__title {
  color: @base;
}

/deep/.el-table th > .cell {
  color: white;
}

/deep/.el-dialog .el-table__row {
  background-color: #045051;
  color: white;
  border: none;
}

/deep/.el-table tbody tr:hover > td {
  background-color: #1998a9;
}

/deep/.el-table__empty-block {
  background-color: #045051;
  border: none;
}

/deep/.el-table td {
  border: none;
}

/deep/.el-table__body {
  background-color: transparent;
  border: none;
}

.pagination {
  padding: 20px 0;
  display: flex;
  justify-content: flex-end;
  background-color: #045051;
}

/deep/.el-pagination,
/deep/.el-pagination__jump,
/deep/.el-pagination__total,
/deep/.el-icon-more::before,
/deep/.el-pagination .btn-prev,
/deep/.el-pagination .btn-next {
  color: white;
  background-color: #1998a9;
}

/deep/.el-pager li {
  background-color: #1998a9;
}

/deep/.el-pager li.active,
/deep/.el-pager li:hover,
/deep/.el-pagination .btn-next:hover,
/deep/.el-pagination .btn-prev:hover {
  color: #145d82;
}

.el-scrollbar {
  ul li {
    margin-bottom: 0;
  }
}
svg {
  height: 10vh;
  position: absolute;
  right: 1.2vw;
  top: 3vh;
  // width: 100%;
}
.words {
  font-size: 6vh;
  font-weight: 400;
  color: white;
  // text-transform: uppercase;
  // fill: none;
  // stroke-width: 1px;
  // animation-duration: 0s;
  // animation-iteration-count: infinite;
  // animation-timing-function: linear;
}
.words-1 {
  stroke: white;
  text-shadow: 0 0 10px white;
  // animation-delay: -0s;
}
@keyframes drawing {
  100% {
    stroke-dashoffset: -400;
  }
}
.partcomwithborder {
  background: linear-gradient(
        to bottom,
        rgb(19, 194, 194) 0px,
        rgb(19, 194, 194) 2px,
        transparent 3px,
        transparent 100%
      )
      left top no-repeat,
    linear-gradient(to right, rgb(19, 194, 194) 0px, rgb(19, 194, 194) 2px, transparent 3px, transparent 100%) left top
      no-repeat,
    linear-gradient(to bottom, rgb(19, 194, 194) 0px, rgb(19, 194, 194) 2px, transparent 3px, transparent 100%) right
      top no-repeat,
    linear-gradient(to left, rgb(19, 194, 194) 0px, rgb(19, 194, 194) 2px, transparent 3px, transparent 100%) right top
      no-repeat,
    linear-gradient(to top, rgb(19, 194, 194) 0px, rgb(19, 194, 194) 2px, transparent 3px, transparent 100%) left bottom
      no-repeat,
    linear-gradient(to right, rgb(19, 194, 194) 0px, rgb(19, 194, 194) 2px, transparent 3px, transparent 100%) left
      bottom no-repeat,
    linear-gradient(to top, rgb(19, 194, 194) 0px, rgb(19, 194, 194) 2px, transparent 3px, transparent 100%) right
      bottom no-repeat,
    linear-gradient(to left, rgb(19, 194, 194) 0px, rgb(19, 194, 194) 2px, transparent 3px, transparent 100%) right
      bottom no-repeat;
  background-size: 18px 18px;
  padding: 4px;
  width: 200px;
  height: 200px;
}
.partcomwithbordersubcontent {
  border: 1px solid rgb(19, 194, 194, 0.2);
  background: transparent;
  width: 100%;
  height: 100%;
  padding: 8px;
}
.title {
  width: 100%;
  text-align: center;
  font-size: 5vh;
  font-weight: 600;
  margin-top: 2vh;
  color: #fff;
  font-family: '楷体';
}
/deep/.leaflet-popup-close-button {
  display: none;
}

.popContainer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;
  background: rgba(0, 0, 0, 0.9);
}
</style>
