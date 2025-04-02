<template>
  <el-dialog :title="title" :visible="visible" width="80%" :before-close="handleClose">
    <!-- 查询区域 -->
    <el-form :model="form" ref="form" :inline="true" label-width="100px">
      <a-row>
        <a-col :span="12">
          <el-form-item label="员工名称" style="width:100%">
            <el-input style="width:100%" v-model="form.userName" placeholder="请输入员工名称"></el-input>
          </el-form-item>
        </a-col>
        <a-col :span="7" style="margin-left:32px;">
          <a-button size="large" @click="getlist" type="primary" icon="search">查询</a-button>
          <a-button size="large" style="margin:0 8px" @click="refresh" icon="reload">重置</a-button>
          <a-button size="large" @click="handleAdd" type="primary" icon="plus">新增</a-button>
        </a-col>
      </a-row>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="personalPhotos" label="照片">
        <template width="90" slot-scope="scope" v-if="scope.row.personalPhotos!=null">
            <div class="demo-image__preview">
              <el-image
                style="width: 90px; height: 90px;"
                :src="editUploadAction + '' + scope.row.personalPhotos"
                :preview-src-list="[editUploadAction + '' + scope.row.personalPhotos]">
              </el-image>
            </div>
          </template>
      </el-table-column>
      <el-table-column prop="userName" label="员工姓名"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="sex" label="性别">
        <template
          slot-scope="scope"
        >{{ filterDictText(sexTypeList, scope.row.sex) }}</template>
      </el-table-column>
      <el-table-column prop="phone" label="联系方式"></el-table-column>
      <el-table-column prop="idCard" label="身份证号"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <a @click="edit(scope.row)" type="text">编辑</a>
          <a-divider type="vertical" />
          <a @click="deletClick(scope.row.id)" type="text">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float:right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="form.pageNo"
      :page-sizes="[5,10,15]"
      :page-size="form.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <div slot="footer"></div>
    <add-company-member ref="addCompanyMember" :companyId="companyId" @ok="getlist" ></add-company-member>
  </el-dialog>
</template>
<script>
import Vue from 'vue'
import AddCompanyMember from './AddCompanyMember'
import { initDictOptions, filterDictText, filterDictTextByCache } from '@/components/dict/JDictSelectUtil'
import {
    getDictionary
  } from '@/api/dictionary.js'
import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'
export default {
  components: {
    AddCompanyMember
  },
  data() {
    return {
      visible: false,
      title: '员工管理',
      editUploadAction :window._CONFIG['staticDomainURL'] = Vue.prototype.API_BASE_URL + '/sys/common/static/',
      form: {
        pageNo: 1,
        pageSize: 10,
        companyId:'',
      },

      companyId:'',
      tableData: [],
      total: 0,
      sexTypeList:[]
    }
  },
  created() {
    this.initConfig()
  },
  methods: {
    filterDictText,
    initConfig(){
      getDictionary('sex_type').then(res => {
          this.sexTypeList = res.result
        })
    },
    refresh() {
      this.form = {
        companyId:this.companyId,
        pageNo: 1,
        pageSize: 10,
      }
      this.getlist()
    },
    handleClose() {
      this.visible = false
    },
    //编辑
    show(id) {
      this.companyId = id
      this.form.companyId = id
      this.visible = true
      this.getlist()
    },
    handleAdd(){
      this.$refs.addCompanyMember.add()
    },
    handleSizeChange(pageSize) {
      this.form.pageSize = pageSize
      this.getlist()
    },
    handleCurrentChange(pageNo) {
      this.form.pageNo = pageNo
      this.getlist()
    },
    //编辑
    edit(record) {
      this.$refs.addCompanyMember.edit(record)
    },
    getlist(){
      getAction('/mwCompanyStaff/list',this.form).then(res=>{
        if(res.success){
          this.tableData = res.result.records
        }else{
          this.$message.error(res.message)
        }
      })
    },
     deletClick(id) {
      this.$confirm('是否删除当前数据 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteAction('/mwCompanyStaff/delete?id=' + id).then((res) => {
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
  },
  watch: {}
}
</script>
<style scoped>
/deep/.el-form-item__content{
  width:82%
}
</style>
