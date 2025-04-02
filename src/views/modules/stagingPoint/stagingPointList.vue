<template>
  <a-card :bordered="false">
    <!-- <div class="header1"> -->
      <!-- <div class="title1">暂存地信息管理</div>
      <a-input
        placeholder="暂存地名称"
        style="width:300px;margin-right:10px"
        v-model="searchForm.stagingPointName"
      ></a-input>
      <a-button type="primary" icon="search" @click="getList">查询</a-button>
      <a-button icon="reload" @click="reset()">重置</a-button>
      <a-button @click="open('add')" icon="plus">新增</a-button>
      <a-button icon="download" @click="downLoads" :disabled="selectList.length==0">批量下载二维码</a-button> -->
      <el-form :model="searchForm" ref="form" :inline="true" label-width="100px">
        <el-row style="margin-bottom:20px">
          <el-col :span="5">
            <el-form-item v-if="isShow" label="所属城镇">
              <el-select v-model="searchForm.townId" @change="getOrgList" placeholder="请选择">
                <el-option v-for="item in townList" :key="item.id" :label="item.label" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="机构名称">
              <el-select :disabled="searchForm.townId==undefined&&isShow" @change="updateForm"
                v-model="searchForm.orgCode" placeholder="请选择">
                <el-option v-for="item in orgList" :key="item.orgCode" :label="item.departName" :value="item.orgCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="暂存地名称">
              <el-input placeholder="暂存地名称" v-model="searchForm.stagingPointName">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <a-button size="large" @click="getList" type="primary" icon="search">查询</a-button>
            <a-button size="large" style="margin:0 8px" @click="reset()" icon="reload">重置</a-button>
            <a-button size="large" @click="open('add')" type="primary" icon="plus">新增</a-button>
            <a-button size="large" icon="download" style="margin:0 8px" @click="downLoads" :disabled="selectList.length==0">批量下载二维码</a-button>
          </el-col>
        </el-row>
      </el-form>
    <!-- </div> -->

    <el-table border style="margin-top:30px" :data="list" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="80px"></el-table-column>
      <el-table-column align="center" prop="orgName" label="机构名称"></el-table-column>
      <el-table-column align="center" prop="stagingPointName" label="暂存地名称"></el-table-column>
      <el-table-column align="center" prop="kgName" label="暂存地库管"></el-table-column>
      <el-table-column align="center" prop="stagingPointCode" label="暂存地识别码"></el-table-column>
      <el-table-column align="center" prop="cameraNum" label="摄像头数量">
        <template slot-scope="scope">{{scope.row.cameraNum==null?'--':scope.row.cameraNum}}</template>
      </el-table-column>
      <el-table-column align="center" prop label="操作">
        <template slot-scope="scope">
          <a @click="handleEdit(scope.row)">编辑</a>&nbsp;
          <a-divider type="vertical" />
          <a-popconfirm title="是否删除？" @confirm="handleDelete(scope.row.id)" ok-text="确定" cancel-text="取消">
            <a href="#">删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a @click="downLoad(scope.row.id)">下载二维码</a>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="float: right;margin-top:20px" :current-page.sync="searchForm.pageNo"
      :page-sizes="[5, 10, 15, 20]" :page-size.sync="searchForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total.sync="total"></el-pagination>

    <stagingPointForm ref="boxForm" @ok="getList"></stagingPointForm>
  </a-card>
</template>

<script>
  import {
    getDictionary
  } from '@api/dictionary'
  import stagingPointForm from './modules/stagingPointForm.vue'
  import {
    getTownInfoList,
    getOrgList
  } from '@/api/mwRibbonMaintain/index.js'
  import {
    list,
    del
  } from '@api/stagingPoint/index'
  import {
    getDictTitle
  } from '../../../utils/util'
  export default {
    components: {
      stagingPointForm
    },
    data() {
      return {
        searchForm: {
          pageNo: 1,
          pageSize: 10,
        },
        orgList: [],
        townList: [],
        isShow: false,
        list: [],
        total: 0,
        selectList: [],
      }
    },
    created() {
      let that = this
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
    mounted() {
      this.getList()
    },
    methods: {
      updateForm(){
        this.$forceUpdate()
        this.getList()
      },
      handleSelectionChange(val) {
        let array = []
        val.forEach((el) => {
          array.push(el.id)
        })
        this.selectList = array
      },
      getOrgList() {
        let that = this
        that.searchForm.orgCode = undefined
        getOrgList(that.searchForm.townId == undefined ? '' : that.searchForm.townId).then(res => {
          if (res.success) {
            that.orgList = res.result
            if (this.orgList.length > 0 && !this.isShow) {
              this.searchForm.orgCode = this.orgList[0].orgCode
              this.getList()
            }else{
              this.getList()
            }
          } else {
            that.$message.error(res.message)
          }
        })
      },
      getValue(val, array) {
        let index = array.findIndex((o) => {
          return o.value == val
        })
        if (index == -1) return '--'
        else {
          return array[index].title
        }
      },
      open() {
        this.$refs.boxForm.visible = true
      },

      async handleEdit(row) {
        this.$refs.boxForm.form = Object.assign({}, row)
        this.$refs.boxForm.type = 'edit'
        this.$refs.boxForm.visible = true
        await this.$refs.boxForm.getData()
        await this.$refs.boxForm.handchange()
      },
      getList() {
        list(this.searchForm).then((res) => {
          this.list = res.result.records
          this.total = res.result.total
        })
      },
      reset() {
        this.searchForm = {
          pageNo: 1,
          pageSize: 10,
        }
        if (this.orgList.length > 0 && !this.isShow) {
          this.searchForm.orgCode = this.orgList[0].orgCode
        }
        this.getList()
      },
      handleDelete(id) {
        del(id).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.getList()
          } else {
            this.$message.error(res.message)
          }
        })
      },
      downLoad(id) {
        window.open(
          window._CONFIG['domianURL'] +
          '/mwBoxMaintain/mwBoxMaintain/test?param=' +
          id +
          '&token=' +
          JSON.parse(localStorage.getItem('pro__Access-Token')).value
        )
      },
      downLoads() {
        this.selectList.forEach((el, index) => {
          setTimeout(() => {
            let link = document.createElement('a')
            link.style.display = 'none'
            let url =
              window._CONFIG['domianURL'] +
              '/mwBoxMaintain/mwBoxMaintain/test?param=' +
              el +
              '&token=' +
              JSON.parse(localStorage.getItem('pro__Access-Token')).value
            link.href = url

            link.setAttribute('download', el)

            document.body.appendChild(link)
            link.click()
            // 下载完毕移除a标签，移除url对象
            document.body.removeChild(link)

            // 释放URL对象
            window.URL.revokeObjectURL(url)
          }, index * 500)
        })
      },
      getDictTitle,
    },
  }
</script>
<style scoped lang="less">
  .header1 {
    display: flex;
    flex-wrap: wrap;

    >* {
      margin-bottom: 10px;
      margin-right: 10px;
    }

    .title1 {
      margin-right: 20px;
      font-size: 18px;
      line-height: 30px;
    }
  }

  // .table {
  //   border: 1px solid #000;
  //   border-radius: 10px 10px 0 0;
  // .table-header {
  //   height: 50px;
  //   display: flex;
  //   .header-column {
  //     line-height: 50px;
  //     text-align: center;
  //     color: #000;
  //     font-size: 18px;
  //   }
  // }
  // }
</style>