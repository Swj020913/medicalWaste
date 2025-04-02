<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <el-form :model="form" ref="form" :inline="true" label-width="100px">
      <a-row>
        <a-col :span="7">
          <el-form-item label="公司名称">
            <el-input style="width:250px" v-model="form.companyName" placeholder="请输入公司名称"></el-input>
          </el-form-item>
        </a-col>
        <a-col :span="7">
          <el-form-item label="公司类型">
            <el-select style="width:250px" v-model="form.companyType" placeholder="请选择">
              <el-option v-for="item in companyTypeList" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </a-col>
        <a-col :span="7">
          <el-form-item label="所属医院">
            <el-select style="width:250px" v-model="form.affiliatedHospital" placeholder="请选择">
              <el-option v-for="item in belongHospitalList" :key="item.id" :label="item.departName"
                :value="item.orgCode"></el-option>
            </el-select>
          </el-form-item>
        </a-col>
        <a-col :span="7">
          <el-form-item label="医废类别">
            <el-select style="width:250px" v-model="form.medicalWasteType" placeholder="请选择">
              <el-option v-for="item in medicalWasteTypeList" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </a-col>
        <a-col :span="7" style="margin-left:32px;">
          <a-button size="large" @click="getlist" type="primary" icon="search">查询</a-button>
          <a-button size="large" style="margin:0 8px" @click="refresh" icon="reload">重置</a-button>
          <a-button size="large" @click="handleAdd" type="primary" icon="plus">新增</a-button>
        </a-col>
      </a-row>
    </el-form>

    <!-- table区域-begin -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="companyType" label="公司类型">
        <template slot-scope="scope">{{ filterDictText(companyTypeList, scope.row.companyType) }}</template>
      </el-table-column>
      <el-table-column prop="companyCode" label="公司编码"></el-table-column>
      <el-table-column prop="companyName" label="公司名称"></el-table-column>
      <el-table-column prop="companyAddress" label="公司地址"></el-table-column>
      <el-table-column prop="companyPhone" label="公司电话"></el-table-column>
      <el-table-column prop="disposalLocation" label="医废处置地点"></el-table-column>
      <el-table-column prop="affiliatedHospital" label="所属医院">
        <template slot-scope="scope">{{ filtertoDictText(belongHospitalList, scope.row.affiliatedHospital) }}</template>
      </el-table-column>
      <el-table-column prop="medicalWasteType" label="医废分类" width="300px">
        <template slot-scope="scope">{{ filterDictText(medicalWasteTypeList, scope.row.medicalWasteType) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <a @click="edit(scope.row)" type="text">编辑</a>
          <a-divider type="vertical" />
          <a @click="deletClick(scope.row.id)" type="text">删除</a>
          <a-divider type="vertical" />
          <a @click="memberManage(scope.row.id)" type="text">员工管理</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="form.pageNo" :page-sizes="[10]" :page-size="form.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

    <mw-sinotrans-company-form ref="modalForm" @ok="modalFormOk"></mw-sinotrans-company-form>
    <mw-company-member-manage ref="mwCompanyMemberManage"></mw-company-member-manage>
  </a-card>
</template>

<script>
  import '@/assets/less/TableExpand.less'
  import {
    mixinDevice
  } from '@/utils/mixin'
  import {
    JeecgListMixin
  } from '@/mixins/JeecgListMixin'
  import {
    initDictOptions,
    filterDictText,
    filterDictTextByCache
  } from '@/components/dict/JDictSelectUtil'
  import {
    getDictionary
  } from '@/api/dictionary.js'
  import {
    getQueryPages
  } from '@/api/zzjg/zzjg'
  import {
    getAction,
    deleteAction,
    putAction,
    postAction,
    httpAction
  } from '@/api/manage'
  import mwSinotransCompanyForm from './modules/mwSinotransCompanyForm'
  import mwCompanyMemberManage from './modules/mwCompanyMemberManage'

  export default {
    name: 'mwSinotransCompanyList',
    mixins: [mixinDevice],
    components: {
      mwSinotransCompanyForm,
      mwCompanyMemberManage
    },
    data() {
      return {
        visible: false,
        form: {
          pageNo: 1,
          pageSize: 10,
        },
        description: '转运公司维护管理页面',
        belongHospitalList: [],
        medicalWasteTypeList: [],
        companyTypeList: [],
        tableData: [],
        total: 0,
        url: {
          list: '/mwSinotransCompany/mwSinotransCompany/list',
          delete: '/mwSinotransCompany/mwSinotransCompany/delete',
          deleteBatch: '/mwSinotransCompany/mwSinotransCompany/deleteBatch',
          exportXlsUrl: '/mwSinotransCompany/mwSinotransCompany/exportXls',
          importExcelUrl: 'mwSinotransCompany/mwSinotransCompany/importExcel',
        },
        dictOptions: {},
        superFieldList: [],
      }
    },
    created() {
      this.getMsg()
      this.getlist()
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      },
    },
    methods: {
      filterDictText,
      filtertoDictText(l, n) {
        let str = '-'
        if (l.length > 0) {
          l.forEach((element) => {
            if (element.orgCode == n) {
              str = element.departName
            }
          })
        }
        return str
      },
      modalFormOk() {
        this.getlist()
      },
      handleSizeChange(pageSize) {
        this.form.pageSize = pageSize
        this.getlist()
      },
      handleCurrentChange(pageNo) {
        this.form.pageNo = pageNo
        this.getlist()
      },
      memberManage(id) {
        this.$refs.mwCompanyMemberManage.show(id)
      },
      getlist() {
        getAction('/mwSinotransCompany/mwSinotransCompany/list', this.form).then((res) => {
          if (res.success) {
            this.tableData = res.result.records
            this.total = res.result.total
          } else {
            this.$message.error(res.message)
          }
        })
      },
      //新增
      handleAdd() {
        this.$refs.modalForm.add()
      },
      //编辑
      edit(record) {
        this.$refs.modalForm.edit(record)
      },
      initDictConfig() {},
      refresh() {
        this.form = {}
        this.getlist()
      },
      deletClick(id) {
        this.$confirm('是否删除当前数据 ?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            deleteAction('/mwSinotransCompany/mwSinotransCompany/delete?id=' + id).then((res) => {
              if (res.success) {
                this.$message.success(res.message)
                this.getlist()
              } else {
                this.$message.error(res.message)
              }
            })
          })
          .catch(() => {})
      },
      getMsg() {
        getQueryPages({
          orgCategory: '1'
        }).then((res) => {
          this.belongHospitalList = res.result
        })
        getDictionary('company_type').then((res) => {
          this.companyTypeList = res.result
        })
        getDictionary('medical_waste_type').then((res) => {
          this.medicalWasteTypeList = res.result
        })
      },
    },
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';

  /deep/td.el-table__cell,
  /deep/th.el-table__cell {
    text-align: center;
  }
</style>