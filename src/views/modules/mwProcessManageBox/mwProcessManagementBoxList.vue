<template>
  <div>
    <transition name="animationname" mode="in-out">
      <a-card class="a-cardBg" v-if="flag" :bordered="false">
        <el-form :model="form" ref="form" :inline="true" label-width="97px">
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
                <el-select :disabled="form.townId==undefined&&isShow" @change="getId" v-model="form.orgId"
                  placeholder="请选择">
                  <el-option v-for="item in orgList" :key="item.id" :label="item.departName" :value="item.orgCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="医废箱识别码">
                <el-input style="width:200px" v-model="form.boxIdentifyingCode" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="医废类型">
                <el-select v-model="form.medicalWasteType" placeholder="请选择">
                  <el-option v-for="item in medicalWasteTypeList" :key="item.value" :label="item.text"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属流程">
                <el-select v-model="form.processStatus" placeholder="请选择">
                  <el-option v-for="item in processStatusList" :key="item.value" :label="item.text" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <a-button size="large" @click="getlist" type="primary" style="margin-left:40px;" icon="search">查询
              </a-button>
              <a-button size="large" style="margin:0 8px;" class="researchButton" @click="refresh" icon="reload"><span
                  style="color:#000">重置</span></a-button>
            </el-col>
          </el-row>
        </el-form>
        <a-list :grid="{ gutter: 24, column: 3 }" :data-source="tableData">
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
              <a-col :span="14">
                <div class="textShow">
                  <span>盛袋数量：{{item.bagNum}}</span><br />
                  <span>重量：{{ item.boxWeight }} KG</span><br />
                  <span>废物类型：{{ item.medicalWasteType_dictText}}</span><br />
                  <!-- <span>收集人证件号：{{ item.packerIdCard }}</span
              ><br /> -->
                  <span>识别码：{{ item.boxIdentifyingCode }}</span><br />
                  <span>操作人员：{{ item.packer }}</span><br />
                  <span>所属环节：{{ item.processStatus_dictText }}</span><br />
                  <span>操作时间：{{ item.createTime }}</span><br />
                </div>
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
      </a-card>
    </transition>
    <transition name="animationnames" mode="in-out">
      <mw-process-detail-list ref="detailList" @back="()=>{this.flag=true}" v-show="!flag" />
    </transition>
  </div>
</template>
<script>
  import {
    getYfBoxList,
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
  import mwProcessDetailList from './modules/mwProcessDetailList'
  import {
    initDictOptions,
    filterDictText,
    filterDictTextByCache
  } from '@/components/dict/JDictSelectUtil'
  export default {
    components: {
      mwProcessDetailList
    },
    data() {
      return {
        RibbonVisible: false,
        tableData: [],
        visible: false,
        drawer: false,
        flag: true,
        detailContent: [],
        option: [],
        imgPath: window._CONFIG['domianURL'],
        processStatusList: [],
        medicalWasteTypeList: [],
        form: {
          pageNo: 1,
          pageSize: 9,
          orgId:""
        },
        record: {},
        itemCurrentProcess: 1,
        total: 0,
        id: null,
        title: null,
        isShow: false,
        orgList:[],
        townList: [],
      }
    },
    methods: {
      filterDictText,
      getId(id){
        this.form.orgId = id
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
        that.form.orgId = undefined
        getOrgList(that.form.townId == undefined ? '' : that.form.townId).then(res => {
          if (res.success) {
            that.orgList = res.result
            if (this.orgList.length > 0&&!this.isShow) {
              this.form.orgId = this.orgList[0].orgCode
              // this.form.orgId = ""
              this.getlist()
            }
          } else {
            that.$message.error(res.message)
          }
        })
      },
      clickCard(item) {
        this.flag = !this.flag
        this.$refs.detailList.show(item)
      },
      getlist() {
        getYfBoxList(this.form).then(res => {
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
      refresh() {
        this.form = {
          pageNo: 1,
          pageSize: 9
        }
         if (this.orgList.length > 0&&!this.isShow) {
          this.form.orgId = this.orgList[0].orgCode
        }
        this.getlist()
      }
    },
    created() {
      this.initConfig()
      this.getlist()
      // mwDeptlistAll().then(res => {
      //   this.option = res.result
      // })
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
    position: absolute;
    color: #000;
    min-height: 100vh;
    min-width: 85vw;
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

  .animationnames-leave-to,
  .animationname-leave-to {
    animation: mymove 0.5s 0s linear;
  }

  .animationname-enter-to,
  .animationnames-enter-to {
    animation: mymoves 0.5s 0s linear;
  }

  @keyframes mymove {
    0% {
      transform: translateX(0);
      opacity: 1;
    }

    100% {
      transform: translateX(-80vw);
      opacity: 0;
    }
  }

  @keyframes mymoves {
    0% {
      transform: translateX(80vw);
      opacity: 0;
    }

    100% {
      transform: translateX(0vw);
      opacity: 1;
    }
  }
</style>

<style lang="less"></style>