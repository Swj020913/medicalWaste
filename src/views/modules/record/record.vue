<template>
  <el-card>
    <el-form :model="ruleForm" inline ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item v-if="isShow" label="所属城镇">
        <el-select v-model="ruleForm.townId" @change="getOrgList" placeholder="请选择">
          <el-option v-for="item in townList" :key="item.id" :label="item.label" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机构名称">
        <el-select
          :disabled="ruleForm.townId == undefined && isShow"
          @change="getDepartList"
          v-model="ruleForm.orgCode"
          placeholder="请选择"
        >
          <el-option v-for="item in orgList" :key="item.orgCode" :label="item.departName" :value="item.orgCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三联单编号">
        <el-input v-model="ruleForm.triplicateFormCode"></el-input>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      <el-button icon="el-icon-refresh-right" @click="reject">重置</el-button>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="departName" label="医疗卫生机构名称" align="center"> </el-table-column>
      <el-table-column prop="companyName" label="医疗废物运输单位" align="center"> </el-table-column>
      <el-table-column prop="createTime" label="转运时间" align="center" width="200"> </el-table-column>
      <el-table-column prop="triplicateFormCode" label="三联单编号" align="center"> </el-table-column>
      <el-table-column prop="" label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button @click="handPrint(scope.row)" type="text">打印</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float:right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="ruleForm.pageNo"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="ruleForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <print :dialogVisible.sync="printVisible" :obj="obj"></print>
  </el-card>
</template>
<script>
import { getTransportList } from '../../../api/Ksgl/index'
import print from './modules/Print.vue'
import { getYfList, getYfHistoryList, getTownInfoList, getOrgList } from '@/api/mwRibbonMaintain/index.js'
export default {
  components: {
    print
  },
  data () {
    return {
      ruleForm: {
        pageNo: 1,
        pageSize: 10
      },
      printVisible: false,
      tableData: [],
      total: 0,
      isShow: false,
      townList: [],
      orgList: [],
      obj: {}
    }
  },
  mounted () {
    this.getList()
    this.initConfig()
  },
  methods: {
    handPrint (e) {
      this.printVisible = true
      this.obj = e
    },
    initConfig () {
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
    getOrgList () {
      let that = this
      that.ruleForm.orgCode = undefined
      getOrgList(that.ruleForm.townId == undefined ? '' : that.ruleForm.townId).then(res => {
        if (res.success) {
          that.orgList = res.result
          if (that.orgList.length > 0 && !that.isShow) {
            that.ruleForm.orgCode = that.orgList[0].orgCode
            that.getList()
          }
        } else {
          that.$message.error(res.message)
        }
      })
    },
    getDepartList () {
      this.$forceUpdate()
    },
    handleSizeChange (val) {
      this.ruleForm.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.ruleForm.pageNo = val
      this.getList()
    },
    getList () {
      getTransportList(this.ruleForm).then(res => {
        this.tableData = res.result.records
        this.total = res.result.total
      })
    },
    reject () {
      this.ruleForm = {
        pageNo: 1,
        pageSize: 10
      }
      if (this.orgList.length > 0 && !this.isShow) {
        this.ruleForm.orgCode = this.orgList[0].orgCode
      }
      this.getList()
    }
  }
}
</script>
