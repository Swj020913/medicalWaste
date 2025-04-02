<template>
  <a-card :bordered="false">
    <el-form :model="form" ref="form" :inline="true" label-width="100px">
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
            <el-select :disabled="form.townId==undefined&&isShow" @change="getDepartList" v-model="form.orgId"
              placeholder="请选择">
              <el-option v-for="item in orgList" :key="item.orgCode" :label="item.departName" :value="item.orgCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="科室名称">
            <el-select v-model="form.deptId" :disabled="form.orgId==undefined" @change="getId" placeholder="请选择">
              <el-option v-for="item in option" :key="item.id" :label="item.departName" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <a-button size="large" @click="getlist" type="primary" icon="search">查询</a-button>
          <a-button size="large" style="margin:0 8px" @click="refresh" icon="reload">重置</a-button>
          <a-button size="large" @click="addClick" type="primary" icon="plus">新增</a-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="orgId" label="机构名称"> </el-table-column>
      <el-table-column prop="deptId" label="科室名称"> </el-table-column>
      <el-table-column prop="endCode" width="100" label="数量"> </el-table-column>
      <el-table-column prop="manufacturer" label="生产商"> </el-table-column>
      <el-table-column prop="createUser" width="150" label="创建人"> </el-table-column>
      <el-table-column prop="printState" label="打印状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.printState == 0" type="info">未打印</el-tag>
          <el-tag v-if="scope.row.printState == 1" type="success">已打印</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <a @click="dchu(scope.row.id, '扎带信息配置')" type="link">导出</a>
          <a-divider type="vertical" />
          <a :disabled="scope.row.printState == 1" @click="deletClick(scope.row.id)" type="link">删除</a>
          <a-divider type="vertical" />
          <a @click="print(scope.row.id)" type="link">打印完成</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="form.pageNo" :page-sizes="[5, 10, 20, 30, 50]" :page-size="form.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <RibbonForm ref="RibbonForm" :dialogVisible.sync="RibbonVisible" @getlist="getlist" :title="title" />
  </a-card>
</template>
<script>
  import {
    RibbonList,
    Ribbondelet,
    getdownFile,
    mwRibbonedit,
    getTownInfoList,
    getOrgList
  } from '@/api/mwRibbonMaintain/index.js'
  import {
    mwDeptlistAll
  } from '@/api/mwDeptMaintain/index.js'
  import {
    getDictionary
  } from '@/api/dictionary.js'
  import RibbonForm from './modules/mwRibbonMaintainForm'
  export default {
    components: {
      RibbonForm
    },
    data() {
      return {
        RibbonVisible: false,
        tableData: [],
        orgList: [],
        townList: [],
        isShow: false,
        visible: false,
        option: [],
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
        RibbonList(this.form).then(res => {
          this.tableData = res.result.records
          this.total = res.result.total
          this.tableData.forEach(i => {
            this.option2.forEach(j => {
              if (i.deptId == j.id) {
                i.deptId = j.departName
              }
            })
          })
        })
      },
      getId(id) {
        this.form.deptId = id
        this.$forceUpdate()
      },
      //新增
      addClick(id) {
        this.RibbonVisible = true
        this.title = '新增'
      },
      //完成打印
      print(id) {
        mwRibbonedit(id).then(res => {
          if (res.code == 200) {
            this.$message.success(res.result)
            this.getlist()
          } else {
            this.$message.error(res.result)
          }
        })
      },
      //导出
      dchu(id, fileName) {
        if (!fileName || typeof fileName != 'string') {
          fileName = '导出文件'
        }
        getdownFile(id).then(data => {
          if (!data) {
            this.$message.warning('文件下载失败')
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data], {
              type: 'application/vnd.ms-excel'
            }), fileName + '.xls')
          } else {
            let url = window.URL.createObjectURL(new Blob([data], {
              type: 'application/vnd.ms-excel'
            }))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName + '.xls')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) //下载完成移除元素
            window.URL.revokeObjectURL(url) //释放掉blob对象
          }
        })
      },
      deletClick(id) {
        this.$confirm('是否确认删除 ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'primary',
          type: 'warning'
        }).then(() => {
          Ribbondelet(id).then(res => {
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
      getDepartList() {
        this.form.deptId = undefined
        this.$forceUpdate()
        mwDeptlistAll(this.form.orgId == undefined ? '' : this.form.orgId).then(res => {
          this.option = res.result
          this.getlist()
        })
      },
      getOrgList() {
        let that = this
        that.form.orgId = undefined
        that.form.deptId = undefined
        getOrgList(that.form.townId == undefined ? '' : that.form.townId).then(res => {
          if (res.success) {
            that.orgList = res.result
            if (this.orgList.length > 0 && !this.isShow) {
              this.form.orgId = this.orgList[0].orgCode
              this.getDepartList()
              this.getlist()
            }else{
              this.getlist()
            }
          } else {
            that.$message.error(res.message)
          }
        })
      },
      refresh() {
        this.form = {
          pageNo: 1,
          pageSize: 9
        }
        if (this.orgList.length > 0 && !this.isShow) {
          this.form.orgId = this.orgList[0].orgCode
        }
        this.getlist()
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
      mwDeptlistAll().then(res => {
        this.option2 = res.result
        this.getlist()
      })
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
</style>

<style lang='less'>

</style>