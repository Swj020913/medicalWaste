<template>
  <div class="page-header-index-wide">

<!--    <a-card :bordered="false" :body-style="{padding: '0'}">-->
<!--      <div class="salesCard" style="height: 540px">-->

<!--        <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-left: 16px;margin-top: 24px;">-->
<!--          <el-tab-pane label="油罐状态信息" name="first">-->
<!--            <div ref="chart_example" :style="{width: '100%', height: '450px'}"></div>-->
<!--          </el-tab-pane>-->
<!--          <el-tab-pane label="装备器材信息" id="chart_ZBQC_info" name="second">-->
<!--            <div ref="chart_ZBQC"  :style="{width: '100%', height: '450px'}"></div>-->
<!--            <div ref="T_ZBQC"  :style="{width: '100%', height: '450px'}"></div>-->
<!--          </el-tab-pane>-->
<!--        </el-tabs>-->

<!--      </div>-->
<!--    </a-card>-->

    <a-row :gutter="12">

      <a-card :bordered="false">
        <div class="salesCard">

          <el-tabs v-model="activeNameInfo" @tab-click="handleClickInfo" style="margin-left: 16px;margin-top: 24px;">
            <el-tab-pane label="系统通知信息" name="first">
              <a-card :bordered="false">
                <!-- 查询区域 -->
                <div class="table-page-search-wrapper">
                  <a-form layout="inline" @keyup.enter.native="searchQuery">
                    <a-row :gutter="24">

                      <a-col :span="6">
                        <a-form-item label="标题">
                          <a-input placeholder="请输入标题" v-model="queryParam.titile"></a-input>
                        </a-form-item>
                      </a-col>
                      <a-col :span="6">
                        <a-form-item label="发布人">
                          <a-input placeholder="请输入发布人" v-model="queryParam.sender"></a-input>
                        </a-form-item>
                      </a-col>

                      <a-col :span="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>&nbsp;
             <a-button type="primary" @click="readAll" icon="book">全部标注已读</a-button>
            </span>
                      </a-col>

                    </a-row>
                  </a-form>
                </div>


                <a-table
                  ref="table"
                  size="default"
                  bordered
                  rowKey="id"
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="ipagination"
                  :loading="loading"
                  @change="handleTableChange">
      <span slot="action" slot-scope="text, record">
        <a @click="showAnnouncement(record)">查看</a>
      </span>
                </a-table>
                <show-announcement ref="ShowAnnouncement"></show-announcement>
                <dynamic-notice ref="showDynamNotice" :path="openPath" :formData="formData"/>
              </a-card>


            </el-tab-pane>

            <el-tab-pane label="报警信息" name="second">
              <a-card :bordered="false">
                <!-- 查询区域 -->
                <div class="table-page-search-wrapper">
                  <a-form layout="inline" @keyup.enter.native="searchQuery">
                    <a-row :gutter="24">

                      <a-col :span="6">
                        <a-form-item label="标题">
                          <a-input placeholder="请输入标题" v-model="queryParam.titile"></a-input>
                        </a-form-item>
                      </a-col>
                      <a-col :span="6">
                        <a-form-item label="发布人">
                          <a-input placeholder="请输入发布人" v-model="queryParam.sender"></a-input>
                        </a-form-item>
                      </a-col>

                      <a-col :span="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>&nbsp;
             <a-button type="primary" @click="readAll" icon="book">全部标注已读</a-button>
            </span>
                      </a-col>

                    </a-row>
                  </a-form>
                </div>


                <a-table
                  ref="table"
                  size="default"
                  bordered
                  rowKey="id"
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="ipagination"
                  :loading="loading"
                  @change="handleTableChange">
      <span slot="action" slot-scope="text, record">
        <a @click="showAnnouncement(record)">查看</a>
      </span>
                </a-table>
                <show-announcement ref="ShowAnnouncement"></show-announcement>
                <dynamic-notice ref="showDynamNotice" :path="openPath" :formData="formData"/>
              </a-card>


            </el-tab-pane>
          </el-tabs>

        </div>
      </a-card>
    </a-row>

  </div>
</template>

<script>

  import { getAction,putAction } from '@/api/manage'
  import ShowAnnouncement from '@/components/tools/ShowAnnouncement'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import DynamicNotice from '@/components/tools/DynamicNotice'
  import { getOilInfo,getZBCount,getZBCNum } from '@/api/dictionary'
  import * as echarts from "echarts/core";
  import {
    BarChart,
    LineChart
  } from 'echarts/charts';
  // 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
  import {
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    TitleComponent,
  } from 'echarts/components';
  // 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
  import {
    CanvasRenderer
  } from 'echarts/renderers';
  import {
    PieChart
  } from 'echarts/charts';
  // 注册的组件
  echarts.use(
    [TitleComponent, PieChart,ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, LineChart, CanvasRenderer]
  );


  export default {
    name: "IndexBdc",
    mixins:[JeecgListMixin],
    components: {
      DynamicNotice,
      ShowAnnouncement
    },
    //数据自动刷新，必然需要一个监听机制告诉Echarts重新设置数据
    data() {
      return {

        activeName: 'first',
        activeNameInfo: 'first',

        isQC: 0,
        tabKey: "1",
        description: '系统通告表管理页面',
        queryParam: {
          msgCategory: 2,
        },
        columns: [{
          title: '标题',
          align:"center",
          dataIndex: 'titile'
        },{
          title: '消息类型',
          align: "center",
          dataIndex: 'msgCategory',
          customRender: function (text) {
            if (text == '1') {
              return "告警消息";
            } else if (text == "2") {
              return "业务消息";
            } else {
              return text;
            }
          }
        },{
          title: '发布人',
          align:"center",
          dataIndex: 'sender'
        },{
          title: '发布时间',
          align:"center",
          dataIndex: 'sendTime'
        },{
          title: '优先级',
          align:"center",
          dataIndex: 'priority',
          customRender:function (text) {
            if(text=='L'){
              return "低";
            }else if(text=="M"){
              return "中";
            }else if(text=="H"){
              return "高";
            } else {
              return text;
            }
          }
        },{
          title: '阅读状态',
          align:"center",
          dataIndex: 'readFlag',
          customRender:function (text) {
            if(text=='0'){
              return "未读";
            }else if(text=="1"){
              return "已读";
            } else {
              return text;
            }
          }
        },{
          title: '操作',
          dataIndex: 'action',
          align:"center",
          scopedSlots: { customRender: 'action' },
        }],
        url: {
          list: "/sys/sysAnnouncementSend/getMyAnnouncementSend",
          editCementSend:"sys/sysAnnouncementSend/editByAnntIdAndUserId",
          readAllMsg:"sys/sysAnnouncementSend/readAll",
        },
        loading:false,
        openPath:'',
        formData:'',
        oilNameArray: [], //油罐名
        liquidLevelArray: [], //液位
        standardLiquidLevelArray: [], //标准液位
        oilTemperatureArray: [],  //油温
        qcName: [],  //器材名称
        qcNum: [],   //器材数量
        qczbT: [],

      }
    },
    computed: {
    },
    methods:{
      handleClickInfo(tab, event) {
        if(tab.name === 'first'){
          this.queryParam.msgCategory = 2
          this.searchQuery()
        }else if(tab.name === 'second'){
          this.queryParam.msgCategory = 1
          this.searchQuery()
        }
      },
      handleClick(tab, event) {

        if(tab.name === 'second' && this.isQC === 0){
          this.isQC = 1
          this.$refs.chart_ZBQC.style.width = '500px'
          this.$refs.T_ZBQC.style.width = '500px'
          let chartQC = echarts.init(this.$refs.chart_ZBQC)
          let TQC = echarts.init(this.$refs.T_ZBQC)
          getZBCount().then((response) => {
            if (response.code === 200) {
              for (let i = 0; i < response.result.length ; i++) {
                this.qcName.push(response.result[i].eqName)
                this.qcNum.push(response.result[i].eqAmount)
              }
              let option = {
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: [
                  {
                    type: 'category',
                    data: this.qcName,
                    axisTick: {
                      alignWithLabel: true
                    }
                  }
                ],
                yAxis: [
                  {
                    type: 'value'
                  }
                ],
                series: [
                  {
                    name: '数量',
                    type: 'bar',
                    barWidth: '60%',
                    data: this.qcNum
                  }
                ]
              };
              chartQC.setOption(option);
            }
          })
          getZBCNum().then((response) => {
            if (response.code === 200) {
              for (let i = 0; i < response.result.length ; i++) {
                console.log(JSON.stringify(response.result[i]));
                console.log(response.result[i].NAME);
                switch (response.result[i].NAME) {
                  case 0: response.result[i].NAME = '新品'; break;
                  case 1: response.result[i].NAME = '堪用'; break;
                  case 2: response.result[i].NAME = '待报废';break
                }
                let data = {
                  value: response.result[i].VALUE,
                  name: response.result[i].NAME
                }
                this.qczbT.push(data)
              }
              console.log(this.qczbT)
              console.log(this.qczbT.length)
              let option = {
                tooltip: {
                  trigger: 'item'
                },
                legend: {
                  orient: 'vertical',
                  left: 'right',
                },
                series: [
                  {
                    name: '器材状态',
                    type: 'pie',
                    radius: '50%',
                    data: this.qczbT,
                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    }
                  }
                ]
              }
              TQC.setOption(option);
            }
          })
        }

      },
      startEcharts(){
        let myChart = echarts.init(this.$refs.chart_example)
        getOilInfo().then((response) => {
          if (response.code === 200) {
            this.oilNameArray = []
            this.liquidLevelArray = []
            this.standardLiquidLevelArray = []
            this.oilTemperatureArray = []
            for (let i = 0; i < response.result.length ; i++) {
              this.oilNameArray.push(response.result[i].oilName + '\n' +response.result[i].oilTypeName)
              this.liquidLevelArray.push(response.result[i].youshuizonggao)
              this.standardLiquidLevelArray.push(response.result[i].biaozhunyewei)
              this.oilTemperatureArray.push(response.result[i].youwen)
            }
            let option = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  crossStyle: {
                    color: '#999'
                  }
                }
              },
              toolbox: {
                feature: {
                  dataView: {show: true, readOnly: false},
                  magicType: {show: true, type: ['line', 'bar']},
                  restore: {show: true},
                  saveAsImage: {show: true}
                }
              },
              legend: {
                data: ['液位', '标准液位', '油温']
              },
              xAxis: [
                {
                  type: 'category',
                  data: this.oilNameArray,
                  axisPointer: {
                    type: 'shadow'
                  }
                }
              ],
              yAxis: [
                {
                  type: 'value',
                  name: '液位',
                  min: 0,
                  max: 15000,
                  interval: 1500,
                  axisLabel: {
                    formatter: '{value} mm'
                  }
                },
                {
                  type: 'value',
                  name: '油温',
                  min: 0,
                  max: 250,
                  interval: 25,
                  axisLabel: {
                    formatter: '{value} °C'
                  }
                }
              ],
              series: [
                {
                  name: '液位',
                  type: 'bar',
                  data: this.liquidLevelArray,
                  color: '#00FFFF'
                },
                {
                  name: '标准液位',
                  type: 'bar',
                  data: this.standardLiquidLevelArray,
                  color: '#00BFFF'
                },
                {
                  name: '油温',
                  type: 'line',
                  yAxisIndex: 1,
                  data: this.oilTemperatureArray,
                  color: '#FFF68F'
                }
              ]
            };
            myChart.setOption(option);

            window.addEventListener("resize", function () {
              myChart.resize();
            });

          } else {
            this.$message.error("油罐数据获取失败！")
          }
        })

      },
      handleDetail: function(record){
        this.$refs.sysAnnouncementModal.detail(record);
        this.$refs.sysAnnouncementModal.title="查看";
      },
      showAnnouncement(record){
        putAction(this.url.editCementSend,{anntId:record.anntId}).then((res)=>{
          if(res.success){
            this.loadData();
            this.syncHeadNotic(record.anntId)
          }
        });
        if(record.openType==='component'){
          this.openPath = record.openPage;
          this.formData = {id:record.busId};
          this.$refs.showDynamNotice.detail();
        }else{
          this.$refs.ShowAnnouncement.detail(record);
        }
      },
      syncHeadNotic(anntId){
        getAction("sys/annountCement/syncNotic",{anntId:anntId})
      },
      readAll(){
        var that = this;
        that.$confirm('是否全部标注已读？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            putAction(that.url.readAllMsg).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.loadData();
                that.syncHeadNotic();
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'warning',
              message: '已取消',
            })
          })
      },
    },

    created() {
      this.loading = !this.loading
    },
    mounted() {
      // setTimeout(() => {
      //   this.startEcharts()
      // }, 750)
    }
  }
</script>

<style lang="less" scoped>
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .item-group {
    .more-btn {
      margin-bottom: 13px;
      text-align: center;
    }
  }

  .list-content-item {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;
  }

  @media only screen and (min-width: 1600px) {
    .list-content-item{
      margin-left:60px;
    }
  }

  @media only screen and (max-width: 1300px) {
    .list-content-item{
      margin-left:20px;
    }
    .width-hidden4{
      display:none
    }
  }
  .list-content-item{
    span{line-height: 20px;}
  }
  .list-content-item{
    p{margin-top: 4px;margin-bottom:0;line-height:22px;}
  }
  .anty-list-cust {
    .ant-list-item-meta{flex: 0.3 !important;}
  }
  .anty-list-cust {
    .ant-list-item-content{flex:1 !important; justify-content:flex-start !important;margin-left: 20px;}
  }
  #chart_ZBQC_info div {
    float: left;
    margin-left: 50px;
  }

</style>