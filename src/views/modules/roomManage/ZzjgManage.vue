<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col v-if="isShow" :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="所属城镇">
              <el-select v-model="queryParam.townId" placeholder="请选择">
                <el-option v-for="item in townList" :key="item.id" :label="item.label" :value="item.id"> </el-option>
              </el-select>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="组织机构名称">
              <a-input allowClear placeholder="请输入组织机构名称" v-model="queryParam.departName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="组织类型">
              <el-select class="select" value-key="index" v-model="queryParam.hospitalCategory" placeholder="请选择组织类型">
                <el-option :key="'a'" :label="'请选择...'" :value="''"></el-option>
                <el-option v-for="(item, index) in hospitalCategoryMap" :key="index" :label="item.text"
                  :value="item.value"></el-option>
              </el-select>
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
        <template slot="hospitalGrade" slot-scope="text">{{
          filterDictText(hospitalGradeMap, text) == '' ? '-' : filterDictText(hospitalGradeMap, text)
        }}</template><template slot="address" slot-scope="text,record">{{
          record.countyName+' / '+record.townName+' / '+record.villageName+' / '+text
        }}</template>
        <template slot="hospitalCategory" slot-scope="text">{{
          filterDictText(hospitalCategoryMap, text) == '' ? '-' : filterDictText(hospitalCategoryMap, text)
        }}</template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <!-- <a-divider type="vertical" />
          <a @click="handleDelete(record)">删除</a> -->
        </span>
      </a-table>
    </div>
    <ZzjgManageAddModal ref="addRoute" @cancel="cancel" />
  </a-card>
</template>

<script>
  import '@/assets/less/TableExpand.less'
  import {
    filterDictText
  } from '@/components/dict/JDictSelectUtil'
  import {
    getTownInfoList,
  } from '@/api/mwRibbonMaintain/index.js'
  import {
    loadDictOptions
  } from '@/utils/util'
  import ZzjgManageAddModal from './modules/ZzjgManageAddModal'
  import {
    getQueryPageList,
    deleteDepart
  } from '@/api/zzjg/zzjg'
  export default {
    name: 'ZzjgManage',
    components: {
      ZzjgManageAddModal
    },
    data() {
      return {
        description: '组织机构管理页面',
        queryParam: {},
        dataSource: [],
        loading: false,
        isShow: false,
        townList: [],
        hospitalCategoryMap: [],
        hospitalGradeMap: [],
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
            title: '机构名称',
            align: 'center',
            width: 120,
            dataIndex: 'departName'
          },
          {
            title: '机构编码',
            align: 'center',
            width: 120,
            dataIndex: 'orgCode'
          }, {
            title: '所属父机构',
            align: 'center',
            width: 200,
            dataIndex: 'parentName'
          },
          {
            title: '所在地址',
            align: 'center',
            dataIndex: 'address',
            scopedSlots: {
              customRender: 'address'
            }
          },
          {
            title: '医院等级',
            align: 'center',
            width: 200,
            dataIndex: 'hospitalGrade',
            scopedSlots: {
              customRender: 'hospitalGrade'
            }
          },
          {
            title: '组织类型',
            align: 'center',
            width: 200,
            dataIndex: 'hospitalCategory',
            scopedSlots: {
              customRender: 'hospitalCategory'
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            width: 147,
            scopedSlots: {
              customRender: 'action'
            }
          }
        ]
      }
    },
    created() {
      this.initDictConfig()
      this.searchQuery()
    },
    computed: {},
    methods: {
      filterDictText,
      async initDictConfig() {
        let that = this
        this.hospitalCategoryMap = await loadDictOptions({
          dictCode: 'hospital_category'
        })
        this.hospitalGradeMap = await loadDictOptions({
          dictCode: 'hospital_grade'
        })
        getTownInfoList().then(res => {
          if (res.success) {
            if (res.result.isShow) {
              that.isShow = true
              that.townList = res.result.city
            } else {
              that.isShow = false
              that.townList = []
            }
          } else {
            that.$message.error(res.message)
          }
        })
      },
      handleEdit(record) {
        this.$refs.addRoute.edit(record)
      },
      handleAdd() {
        this.$refs.addRoute.add()
      },
      searchQuery() {
        this.loading = true
        this.queryParam.pageNo = this.pagination.current
        this.queryParam.pageSize = this.pagination.pageSize
        this.queryParam.orgCategory = '1'
        getQueryPageList(this.queryParam).then(res => {
          if (res.success) {
            this.dataSource = res.result.records
            this.loading = false
          }
        })
      },
      handleDelete(record) {
        this.$confirm('是否删除机构？', '提示', {
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