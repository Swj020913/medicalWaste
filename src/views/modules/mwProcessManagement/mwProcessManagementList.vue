<template>
  <a-card class="a-cardBg" :bordered="false">
    <el-form :model="form" ref="form" :inline="true" label-width="90px">
      <el-row style="margin-bottom:20px">
        <el-col :span="6">
          <el-form-item v-if="isShow" label="所属城镇">
            <el-select v-model="form.townId" @change="getOrgList" placeholder="请选择">
              <el-option v-for="item in townList" :key="item.id" :label="item.label" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="机构名称">
            <el-select :disabled="form.townId==undefined&&isShow" @change="getDepartList" v-model="form.orgCode"
              placeholder="请选择">
              <el-option v-for="item in orgList" :key="item.orgCode" :label="item.departName" :value="item.orgCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="科室名称">
            <el-select v-model="form.deptId" :disabled="form.orgCode==undefined" @change="getId" placeholder="请选择">
              <el-option v-for="item in option" :key="item.id" :label="item.departName" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="医废类型">
            <el-select v-model="form.medicalWasteType" placeholder="请选择">
              <el-option v-for="item in medicalWasteTypeList" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="流程类型">
            <el-select v-model="form.processStatus" placeholder="请选择">
              <el-option v-for="item in processStatusList" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="扎带编码">
            <el-input v-model="form.barCode" placeholder="请输入扎带编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="操作时间">
            <el-date-picker style="width:100%" v-model="bindingTime" type="daterange" unlink-panels
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <a-button size="large" @click="getlist" type="primary" style="margin-left:40px;" icon="search">查询</a-button>
          <a-button size="large" style="margin:0 8px;" class="researchButton" @click="refresh" icon="reload"><span
              style="color:#000">重置</span></a-button>
        </el-col>
      </el-row>
    </el-form>
    <a-list :grid="{ gutter: 12, column: 3 }" :data-source="tableData">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-card class="aCard" @click="clickCard(item)">
          <a-col :span="10">
            <div class="logo_bg" :style="{
                background:
                  item.medicalWasteType == 1
                    ? '#E6D00F'
                    : item.medicalWasteType == 2
                    ? '#CF310A'
                    : item.medicalWasteType == 3
                    ? '#D7D7D7'
                    : item.medicalWasteType == 4
                    ? '#0C6DDA'
                    : item.medicalWasteType == 5
                    ? '#0CC55F'
                    : 'RED'
              }"></div>
            <el-image class="image_bg" :src="require('../../../assets/card_logo_bg.png')" :fit="'cover'"></el-image>
          </a-col>
          <a-col :span="14" v-if="item.processStatus == '1'">
            <div class="textShow">
              <span>识别码：{{ item.barCode }}</span><br />
              <span>科室名称：{{ item.deptName }}</span><br />
              <span>收集人：{{ item.packer }}</span><br />
              <!-- <span>收集人证件号：{{ item.packerIdCard }}</span
              ><br /> -->
              <span>废物类型：{{ item.medicalWasteType_dictText }}</span><br />
              <span>重量：{{ item.medicalWasteWeight ? item.medicalWasteWeight : 0 }} KG</span><br />
              <span>交接人：{{ item.porter }}</span><br />
              <!-- <span>交接人证件号：{{ item.porterIdCard }}</span
              ><br /> -->
              <span>所属环节：{{ item.processStatus_dictText }}</span><br />
              <span>操作时间：{{ item.createTime }}</span><br />
            </div>
          </a-col>
          <a-col :span="14" v-else-if="item.processStatus == '2'">
            <div class="textShow">
              <span>扎带识别码：{{ item.barCode }}</span><br />
              <span>医废箱识别码：{{ item.temporaryContainerCode }}</span><br />
              <span>废物类型：{{ item.medicalWasteType_dictText }}</span><br />
              <span>绑定人：{{ item.packer }}</span><br />
              <span>收集重量：{{ item.medicalWasteWeight ? item.medicalWasteWeight : 0 }} KG</span><br />
              <span>所属环节：{{ item.processStatus_dictText }}</span><br />
              <span>操作时间：{{ item.createTime }}</span><br />
            </div>
          </a-col>
          <a-col :span="14" v-else-if="item.processStatus == '3'">
            <div class="textShow">
              <span>入库人：{{ item.packer }}</span><br />
              <span>医废箱识别码：{{ item.temporaryContainerCode }}</span><br />
              <span>库管：{{ item.porter }}</span><br />
              <span>废物类型：{{ item.medicalWasteType_dictText }}</span><br />
              <span>收集重量：{{ item.medicalWasteWeight ? item.medicalWasteWeight : 0 }} KG</span><br />
              <span>所属环节：{{ item.processStatus_dictText }}</span><br />
              <span>操作时间：{{ item.createTime }}</span><br />
            </div>
          </a-col>
          <a-col :span="14" v-else-if="item.processStatus == '4'">
            <div class="textShow">
              <span>医废箱识别码：{{ item.temporaryContainerCode }}</span><br />
              <span>外运公司名称：{{ item.companyCode }}</span><br />
              <span>外运车牌号：{{ item.carNumber }}</span><br />
              <span>三联单编号：{{ item.triplicateFormCode }}</span><br /><span>司机名称：{{ item.packer }}</span>&nbsp;<br />
              <span>废物类型：{{ item.medicalWasteType_dictText }}</span><br />
              <span>所属环节：{{ item.processStatus_dictText }}</span><br />
              <span>操作时间：{{ item.createTime }}</span><br />
            </div>
          </a-col>
          <a-col :span="14" v-else-if="item.processStatus == '5'">
            <div class="textShow">
              <span>识别码：{{ item.barCode }}</span><br />
              <span>科室名称：{{ item.deptName }}</span><br />
              <span>废物类型：{{ item.medicalWasteType_dictText }}</span><br />
              <span>收集重量：{{ item.medicalWasteWeight ? item.medicalWasteWeight : 0 }} KG</span><br />
              <span>操作人员：{{ item.createUser }}</span><br />
              <span>所属环节：{{ item.processStatus_dictText }}</span><br />
              <span>操作时间：{{ item.createTime }}</span><br />
            </div>
            <div class="seal-result seal-result-fail">已作废</div>
          </a-col>
        </a-card>
      </a-list-item>
    </a-list>
    <nav style="text-align: center;margin-top:20px;margin-bottom:60px;">
      <!-- 分页居中放置-->
      <el-pagination style="width:100%" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="form.pageNo" :page-sizes="[6, 9, 12, 15]" :page-size="form.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </nav>

    <el-drawer :show-close="false" custom-class="drawerModal" :append-to-body="true" :visible.sync="drawer"
      :before-close="handleClose">
      <template slot="title">
        <div style="margin-top:-10px;margin-left:-10px;">
          <div style="width:4px;height:20px;background:#13c2c2;float:left;margin-right:14px;"></div>
          <div style="font-size: 14px;
  font-family: monospace, monospace;color:#13C2C2">
            医废袋追溯
          </div>
        </div>
      </template>
      <a-steps style="margin-left:40px;width:90%" direction="vertical" :current="detailContent.length - 1">
        <a-step v-for="(item, index) in detailContent" :key="index"><template slot="title">
            <div style="color:#A6A6A6;font-size: 14px;
  font-family: monospace, monospace;">
              操作人：{{ item.packer }} &nbsp; {{ item.createTime }} &nbsp;
              {{ filterDictText(processStatusList, item.processStatus) }}
            </div>
          </template><template slot="description">
            <div style="width:90%;min-height:200px;background:#EEF0F3">
              <div style="color:#808080;line-height:27px;margin:10px;font-size: 14px;
  font-family: monospace, monospace;" v-if="item.processStatus == '1'">
                <span>识别码：{{ item.barCode }}</span><br />
                <span>科室名称：{{ record.deptName }}</span><br />
                <span>收集人：{{ item.packer }}</span><br />
                <span>收集人证件号：{{ item.packerIdCard }}</span><br />
                <span>废物类型：{{ record.medicalWasteType_dictText }}</span><br />
                <span>重量：{{ item.medicalWasteWeight ? item.medicalWasteWeight : 0 }} KG</span><br />
                <span>交接人：{{ item.porter }}</span><br />
                <span>交接人证件号：{{ item.porterIdCard }}</span><br />
                <span>操作时间：{{ item.createTime }}</span><br />
              </div>

              <div style="color:#808080;line-height:27px;margin:10px;font-size: 14px;
  font-family: monospace, monospace;" v-if="item.processStatus == '2'">
                <span>扎带识别码：{{ item.barCode }}</span><br />
                <span>医废箱识别码：{{ item.temporaryContainerCode }}</span><br />
                <span>废物类型：{{ record.medicalWasteType_dictText }}</span><br />
                <span>绑定人：{{ item.packer }}</span><br />
                <span>收集重量：{{ item.medicalWasteWeight ? item.medicalWasteWeight : 0 }} KG</span><br />
                <span>操作时间：{{ item.createTime }}</span><br />
              </div>
              <div style="color:#808080;line-height:27px;margin:10px;font-size: 14px;
  font-family: monospace, monospace;" v-if="item.processStatus == '3'">
                <span>入库人：{{ item.packer }}</span><br />
                <span>医废箱识别码：{{ item.temporaryContainerCode }}</span><br />
                <span>库管：{{ item.porter }}</span><br />
                <span>废物类型：{{ record.medicalWasteType_dictText }}</span><br />
                <span>收集重量：{{ item.medicalWasteWeight ? item.medicalWasteWeight : 0 }} KG</span><br />
                <span>操作时间：{{ item.createTime }}</span><br />
              </div>
              <div style="color:#808080;line-height:27px;margin:10px;font-size: 14px;
  font-family: monospace, monospace;" v-if="item.processStatus == '4'">
                <span>医废箱识别码：{{ item.temporaryContainerCode }}</span><br />
                <span>外运公司名称：{{ item.companyCode }}</span><br />
                <span>外运司机签名（图）：</span><br />
                <el-image style="width: 200px; height: 160px;margin-left:60px" :src="imgPath+'/'+item.driverAutograph"
                  :preview-src-list="[imgPath+'/'+item.driverAutograph]">
                </el-image><br />
                <span>外运车牌号：{{ item.carNumber }}</span><br />
                <span>三联单编号：{{ item.triplicateFormCode }}</span><br /><span>司机名称：{{ item.packer }}</span>&nbsp;<br />
                <span>废物类型：{{ record.medicalWasteType_dictText }}</span><br />
                <span>操作时间：{{ item.createTime }}</span><br />
              </div>
              <div style="color:#808080;line-height:27px;margin:10px;font-size: 14px;
  font-family: monospace, monospace;" v-if="item.processStatus == '5'">
                <span>科室名称：{{ item.deptName }}</span><br />
                <span>废物类型：{{ item.medicalWasteType_dictText }}</span><br />
                <span>收集重量：{{ item.medicalWasteWeight ? item.medicalWasteWeight : 0 }} KG</span><br />
                <span>识别码：{{ item.barCode }}</span><br />
                <span>操作人员：{{ item.createUser }}</span><br />
                <span>操作时间：{{ item.createTime }}</span><br />
                <div class="seal-result-detail seal-result-fail">已作废</div>
              </div>
            </div>
          </template></a-step>
      </a-steps>
      <a-row style="margin-top:20px;padding-top:10px;padding-bottom:10px;background:#fff">
        <a-button type="primary" style="float:left;margin-left:20px;" @click="
            () => {
              this.drawer = false
            }
          ">关闭</a-button>
      </a-row>
    </el-drawer>
  </a-card>
</template>
<script>
  import {
    getYfList,
    getYfHistoryList,
    getTownInfoList,
    getOrgList
  } from '@/api/mwRibbonMaintain/index.js'
  import {
    mwDeptlistAll
  } from '@/api/mwDeptMaintain/index.js'
  import {
    getDictionary
  } from '@/api/dictionary.js'
  import {
    initDictOptions,
    filterDictText,
    filterDictTextByCache
  } from '@/components/dict/JDictSelectUtil'
  import moment from 'moment'
  import mwProcessManagementForm from './modules/mwProcessManagementForm'
  export default {
    components: {
      mwProcessManagementForm
    },
    data() {
      return {
        RibbonVisible: false,
        tableData: [],
        visible: false,
        orgList: [],
        drawer: false,
        detailContent: [],
        option: [],
        imgPath: window._CONFIG['domianURL'] + '/static/file',
        processStatusList: [],
        medicalWasteTypeList: [],
        form: {
          pageNo: 1,
          pageSize: 9,
        },
        bindingTime: '',
        record: {},
        itemCurrentProcess: 1,
        total: 0,
        id: null,
        title: null,
        townList: [],
        isShow: false,
        pickerOptions: {
          shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        },
      }
    },
    methods: {
      filterDictText,
      getId(id) {
        this.form.deptId = id
        this.$forceUpdate()
      },
      initConfig() {
        let that = this
        getDictionary('process_status').then(res => {
          this.processStatusList = res.result
        })
        getDictionary('medical_waste_type').then(res => {
          this.medicalWasteTypeList = res.result
        })
        getTownInfoList().then(res => {
          if (res.success) {
            if (res.result.isShow) {
              that.isShow = true
              that.townList = res.result.city
            } else {
              that.isShow = false
              that.townList = []
              that.getOrgList()
            }
          } else {
            that.$message.error(res.message)
          }
        })
      },
      getOrgList() {
        let that = this
        that.form.orgCode = undefined
        getOrgList(that.form.townId == undefined ? '' : that.form.townId).then(res => {
          if (res.success) {
            that.orgList = res.result
            if (this.orgList.length > 0 && !this.isShow) {
              this.form.orgCode = this.orgList[0].orgCode
              this.getDepartList()
              this.getlist()
            }
          } else {
            that.$message.error(res.message)
          }
        })
      },
      clickCard(item) {
        this.record = item
        getYfHistoryList(item.id).then(res => {
          if (res.success) {
            this.detailContent = res.result
          } else {
            this.$message.error(res.message)
          }
        })
        this.drawer = true
      },
      getlist() {
        if (this.bindingTime != undefined && this.bindingTime.length == 2) {
          this.form.startTime = moment(this.bindingTime[0]).format('YYYY-MM-DD 00:00:00')
          this.form.endTime = moment(this.bindingTime[1]).format('YYYY-MM-DD 23:59:59')
        }else{
          this.form.startTime = undefined
          this.form.endTime = undefined
        }
        getYfList(this.form).then(res => {
          if (res.success) {
            this.tableData = res.result.records
            this.total = res.result.total
          } else {
            this.$message.error(res.message)
          }
          // this.tableData.forEach(i => {
          //   this.option.forEach(j => {
          //     if (i.deptId == j.id) {
          //       i.deptId = j.departName
          //     }
          //   })
          // })
        })
      },
      handleClose(done) {
        done()
      },
      //新增
      addClick(id) {
        this.RibbonVisible = true
        this.title = '新增'
      },
      handleSizeChange(pageSize) {
        this.form.pageSize = pageSize
        this.getlist()
      },
      handleCurrentChange(pageNo) {
        this.form.pageNo = pageNo
        this.getlist()
      },
      getDepartList() {
        this.form.deptId = undefined
        this.$forceUpdate()
        mwDeptlistAll(this.form.orgCode == undefined ? '' : this.form.orgCode).then(res => {
          this.option = res.result
          this.getlist()
        })
      },
      refresh() {
        this.form = {
          pageNo: 1,
          pageSize: 9,
        }
        this.bindingTime = ''
        if (this.orgList.length > 0 && !this.isShow) {
          this.form.orgCode = this.orgList[0].orgCode
        }
        this.getlist()
      }
    },
    created() {
      this.initConfig()
      this.getlist()

    }
  }
</script>
<style lang="less" scoped>
  /deep/td.el-table__cell,
  /deep/th.el-table__cell {
    text-align: center;
  }

  body .el-table th.gutter {
    display: table-cell !important;
  }

  body .el-table colgroup.gutter {
    display: table-cell !important;
  }

  .a-cardBg {
    background: #fff !important;
    color: #000;
    min-height: 100vh;
  }

  .aCard {
    background: #eef0f3;
    position: relative;
    height: 30vh;
    min-height: 240px;
    min-width: 300px;
    color: #808080;
    border: none;
    border-radius: 8px;
  }

  .aCard:hover {
    cursor: pointer;
    color: #fff;
    // background: rgb(235, 169, 46);
    background: #13c2c2;
  }

  .textShow {
    position: absolute;
    font-size: 14px;
    font-family: monospace, monospace;
    margin-left: -10px;
    margin-top: -10px;
  }

  .textShow>span {
    line-height: 27px;
  }

  /deep/.el-form-item__label {
    color: #000;
  }

  /deep/span {
    // color: #fff;
  }

  .researchButton:hover span {
    color: #13c2c2 !important;
  }

  .logo_bg {
    background: #0cc55f;
    width: 14vh;
    height: 14vh;
    margin-top: -10px;
    margin-left: -20px;
    position: absolute;
    border-radius: 10px;
  }

  .image_bg {
    width: 14vh;
    height: 14vh;
    margin-left: -10px;
    position: absolute;
    border-radius: 10px;
  }

  /deep/.drawerModal {
    background: #fff;

    .el-drawer__header {
      color: #a6a6a6;
    }
  }

  .seal-content {
    width: 300px;
    min-height: 60px;
    vertical-align: bottom;
    word-wrap: break-word;
    position: relative;
  }

  .seal-result {
    width: 90px;
    height: 90px;
    transform: rotate(20deg);
    border: solid 3px green;
    border-radius: 100%;
    text-align: center;
    color: green;
    font-size: 16px;
    font-weight: 500;
    line-height: 90px;
    right: 0px;
    bottom: -200px;
    position: absolute;
  }

  .seal-result-detail {
    width: 90px;
    height: 90px;
    transform: rotate(20deg);
    border: solid 3px green;
    border-radius: 100%;
    text-align: center;
    color: green;
    font-size: 18px;
    font-weight: 900 !important;
    line-height: 90px;
    right: 60px;
    bottom: 30px;
    position: absolute;
  }

  .seal-result-fail {
    border-color: red;
    color: red;
  }
</style>

<style lang="less"></style>