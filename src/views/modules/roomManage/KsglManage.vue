<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col v-if="isShow" :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="所属城镇">
              <el-select v-model="queryParam.townId" @change="getOrgList" placeholder="请选择">
                <el-option v-for="item in townList" :key="item.id" :label="item.label" :value="item.id"> </el-option>
              </el-select>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="所属医院">
              <el-select :disabled="queryParam.townId==undefined&&isShow" @change="updateForm" v-model="queryParam.parentId"
                placeholder="请选择">
                <el-option v-for="item in orgList" :key="item.orgCode" :label="item.departName" :value="item.id">
                </el-option>
              </el-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="所属医院">
              <el-select style="width:230px" placeholder="请选择" v-model="queryParam.parentId">
                <el-option v-for="item in option1" :key="item.departName" :label="item.departName" :value="item.id">
                </el-option>
              </el-select>
            </a-form-item>
          </a-col> -->
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="科室名称">
              <a-input allowClear placeholder="请输入名称" v-model="queryParam.departName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleAdd" icon="plus">新增</a-button>
              <a-button type="primary" @click="searchQuery" icon="search" style="margin-left: 8px">查询</a-button>
              <a-button type="primary" @click="
                  () => {
                    queryParam = {}
                    if (orgList.length > 0 && !isShow) {
          queryParam.orgId = orgList[0].orgCode
        }
                    searchQuery()
                  }
                " icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div>
      <a-table ref="table" rowKey="id" :columns="columns" :dataSource="dataSource" :pagination="pagination"
        :loading="loading">
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a @click="handleDelete(record)">删除</a>
        </span>
      </a-table>
    </div>
    <KsglModal ref="addRoute" :option1="option1" @cancel="cancel" />
  </a-card>
</template>

<script>
  import '@/assets/less/TableExpand.less'
  import {
    filterDictText
  } from '@/components/dict/JDictSelectUtil'
  import {
    getTownInfoList,
    getOrgList
  } from '@/api/mwRibbonMaintain/index.js'
  import {
    loadDictOptions
  } from '@/utils/util'
  import KsglModal from './modules/KsglModal'
  import {
    getQueryPageList,
    deleteDepart,
    getDepartByParams,
    getUserByParams
  } from '@/api/Ksgl/index.js'
  export default {
    name: 'KsglManage',
    components: {
      KsglModal
    },
    data() {
      return {
        description: '科室管理页面',
        queryParam: {},
        dataSource: [],
        orgList: [],
        townList: [],
        isShow: false,
        loading: false,
        option1: [],
        pagination: {
          //表格自带分页器的属性定义
          current: 1,
          pageSize: 10,
          total: 0, //总数
          size: 'small',
          onChange: this.onPageChange.bind(this) //点击页码事件
        },
        // 表头
        columns: [{
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: function (t, r, index) {
              return parseInt(index) + 1
            }
          },
          {
            title: '所属医院',
            align: 'center',
            dataIndex: 'pName'
          },
          {
            title: '科室名称',
            align: 'center',
            dataIndex: 'departName'
          },
          {
            title: '科室编码',
            align: 'center',
            dataIndex: 'orgCode'
          },
          {
            title: '正职领导',
            align: 'center',
            width: 150,
            dataIndex: 'principalLeader_text'
          },
          {
            title: '副职领导',
            align: 'center',
            width: 150,
            dataIndex: 'deputyLeader_text'
          },
          {
            title: '分管院长',
            align: 'center',
            width: 150,
            dataIndex: 'presidentCharge_text'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 150,
            scopedSlots: {
              customRender: 'action'
            }
          }
        ]
      }
    },
    created() {
      getDepartByParams().then(res => {
        this.option1 = res.result
      })
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
      this.searchQuery()
    },
    computed: {},
    methods: {
      filterDictText,
      handleEdit(record) {
        this.$refs.addRoute.edit(record)
      },
      updateForm(){
        this.$forceUpdate()
      },
      handleAdd() {
        this.$refs.addRoute.add()
      },
      getOrgList() {
        let that = this
        that.queryParam.orgId = undefined
        getOrgList(that.queryParam.townId == undefined ? '' : that.queryParam.townId).then(res => {
          if (res.success) {
            that.orgList = res.result
            if (this.orgList.length > 0 && !this.isShow) {
              this.queryParam.orgId = this.orgList[0].orgCode
            }
          } else {
            that.$message.error(res.message)
          }
        })
      },
      searchQuery() {
        this.queryParam.pageNo = this.pagination.current
        this.queryParam.pageSize = this.pagination.pageSize
        this.queryParam.orgCategory = '2'
        getQueryPageList(this.queryParam).then(res => {
          if (res.success) {
            let _dataSource = res.result.records
            _dataSource.forEach(i => {
              this.option1.forEach(j => {
                if (i.parentId == j.id) {
                  i.pName = j.departName
                }
              })
            })
            this.dataSource = _dataSource
          }
        })
      },
      handleDelete(record) {
        this.$confirm('是否删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDepart(record).then(res => {
            if (res.success) {
              this.$message.success('删除成功!')
              this.searchQuery()
            } else {
              this.$message.error(res.message)
            }
          })
        })
      },
      onPageChange(current, size) {
        this.pagination.current = current
        this.pagination.pageSize = size
        this.searchQuery()
      },
      cancel() {
        this.searchQuery()
      }
    }
  }
</script>
<style scoped>
  ::v-deep input {
    height: 32px !important;
  }

  ::v-deep .el-input__icon {
    line-height: 32px !important;
  }
</style>