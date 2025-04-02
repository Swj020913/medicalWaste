<template>
  <a-card :bordered="false">
    <el-form :model="form" ref="form" :inline="true" style="margin-bottom:16px" label-width="100px">
      <el-form-item v-if="isShow" label="所属城镇">
        <el-select v-model="form.townId" @change="getOrgList" placeholder="请选择">
          <el-option v-for="item in townList" :key="item.id" :label="item.label" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机构名称">
        <el-select :disabled="form.townId==undefined&&isShow" @change="getDepartList" v-model="form.orgId"
          placeholder="请选择">
          <el-option v-for="item in orgList" :key="item.orgCode" :label="item.departName" :value="item.orgCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室名称">
        <el-select v-model="form.deptId" :disabled="form.orgId==undefined" @change="getId" placeholder="请选择">
          <el-option v-for="item in option45" :key="item.id" :label="item.departName" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医废类别">
        <el-select v-model="form.medicalWasteType" placeholder="请选择">
          <el-option v-for="item in option3" :key="item.value" :label="item.text" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医废形态">
        <el-select v-model="form.medicalWasteShape" placeholder="请选择">
          <el-option v-for="item in option1" :key="item.value" :label="item.text" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医废包装">
        <el-select v-model="form.medicalWastePack" placeholder="请选择">
          <el-option v-for="item in option2" :key="item.value" :label="item.text" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医废间条码">
        <el-input v-model="form.barCode" placeholder=""></el-input>
      </el-form-item>
      <a-button size="large" @click="getlist" type="primary" icon="search">查询</a-button>
      <a-button size="large" style="margin:0 8px" @click="refresh" icon="reload">重置</a-button>
      <a-button size="large" @click="addClick" type="primary" icon="plus">新增</a-button>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="orgName" label="所属医院"> </el-table-column>
      <el-table-column prop="departName" label="科室名称"> </el-table-column>
      <el-table-column prop="barCode" label="医废间条码"> </el-table-column>
      <el-table-column prop="medicalWasteType_dictText" label="医废类别"> </el-table-column>
      <el-table-column prop="medicalWasteShape" label="医废形态"> </el-table-column>
      <el-table-column prop="medicalWastePack" label="医废包装"> </el-table-column>
      <el-table-column prop="transportUnit" label="运输单位"> </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <a @click="edit(scope.row.id)" type="link">编辑</a>
          <a-divider type="vertical" />
          <a @click="deletClick(scope.row.id)" type="link">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="form.pageNo" :page-sizes="[5,10,20,30,50]" :page-size="form.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <mwDeptForm ref="mwDeptForm" :dialogVisible.sync="mwDeptVisible" @getlist="getlist" :title="title" :id="id" />
  </a-card>
</template>
<script>
  import {
    mwDeptMaintainlist,
    mwDeptdelete,
    mwDeptlistAll
  } from '@/api/mwDeptMaintain/index.js'
  import {
    getYfList,
    getYfHistoryList,
    getTownInfoList,
    getOrgList
  } from '@/api/mwRibbonMaintain/index.js'
  import {
    getDictionary
  } from '@/api/dictionary.js'
  import mwDeptForm from './modules/mwDeptMaintainForm'
  import {
    kStringMaxLength
  } from 'buffer'
  export default {
    components: {
      mwDeptForm
    },
    data() {
      return {
        mwDeptVisible: false,
        tableData: [],
        orgList: [],
        townList: [],
        isShow: false,
        option1: [],
        option2: [],
        option3: [],
        option4: [],
        option45: [],
        form: {
          pageNo: 1,
          pageSize: 10
        },
        total: 0,
        id: null,
        title: null
      }
    },
    methods: {
      getlist() {
        mwDeptMaintainlist(this.form).then(res => {
          let _tableData = res.result.records
          _tableData.forEach(i => {
            let _medicalWasteShape = []
            let _medicalWastePack = []
            i.medicalWasteShape.split(',').forEach(j => {
              this.option1.forEach(k => {
                if (j == k.value) {
                  _medicalWasteShape.push(k.text)
                  i.medicalWasteShape = _medicalWasteShape.toString()
                }
              })
            })
            i.medicalWastePack.split(',').forEach(j => {
              this.option2.forEach(k => {
                if (j == k.value) {
                  _medicalWastePack.push(k.text)
                  i.medicalWastePack = _medicalWastePack.toString()
                }
              })
            })
          })
          this.tableData = _tableData
          this.total = res.result.total
        })
      },
      getId(id) {
        this.form.deptId = id
        this.$forceUpdate()
      },
      getDepartList() {
        this.form.deptId = undefined
        this.$forceUpdate()
        mwDeptlistAll(this.form.orgId == undefined ? '' : this.form.orgId).then(res => {
          this.option45 = res.result
        })
      },
      getMsg() {
        let that = this
        getDictionary('medical_waste_shape').then(res => {
          this.option1 = res.result
        })
        getDictionary('medical_waste_pack').then(res => {
          this.option2 = res.result
        })
        getDictionary('medical_waste_type').then(res => {
          this.option3 = res.result
        })
        mwDeptlistAll().then(res => {
          this.option4 = res.result
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
            if (this.orgList.length > 0 && !this.isShow) {
              this.form.orgId = this.orgList[0].orgCode
              this.getDepartList()
              this.getlist()
            }
          } else {
            that.$message.error(res.message)
          }
        })
      },
      //新增
      addClick(id) {
        this.mwDeptVisible = true
        this.title = '新增'
      },
      //编辑
      edit(id) {
        this.mwDeptVisible = true
        this.title = '编辑'
        this.id = id
      },
      deletClick(id) {
        this.$confirm('是否确认删除 ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'primary',
          type: 'warning'
        }).then(() => {
          mwDeptdelete(id).then(res => {
            if (res.code == 200) {
              this.$message.success('删除成功')
              this.getlist()
            } else {
              this.$message.error('删除失败')
            }
          })
        })
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
          pageSize: 9,
        }
        this.bindingTime = ''
        if (this.orgList.length > 0 && !this.isShow) {
          this.form.orgId = this.orgList[0].orgCode
        }
        this.getlist()
      }
    },
    created() {
      this.getlist()
      this.getMsg()
    }
  }
</script>
<style lang="less" scoped>
  /deep/td.el-table__cell,
  /deep/th.el-table__cell {
    text-align: center;
  }
</style>