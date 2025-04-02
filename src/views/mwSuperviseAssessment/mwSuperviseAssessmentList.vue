<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <el-form :model="form" ref="form" :inline="true" label-width="100px">
      <a-row>
        <a-col :span="7">
          <el-form-item label="事件类型">
            <el-select style="width:250px" v-model="form.eventType" placeholder="请选择">
              <el-option v-for="item in eventTypeList" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </a-col>
        <a-col :span="7">
          <el-form-item label="事件编码">
            <el-input style="width:250px" v-model="form.eventCode" placeholder=""></el-input>
          </el-form-item>
        </a-col>
        <a-col :span="7">
          <el-form-item label="督导状态">
            <el-select style="width:250px" v-model="form.superviseState" placeholder="请选择">
              <el-option v-for="item in superviseStateList" :key="item.value" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </a-col>
        <a-col :span="7">
          <el-form-item label="责任科室">
            <el-select style="width:250px" v-model="form.deptId" placeholder="请选择">
              <el-option v-for="item in deptIdList" :key="item.id" :label="item.departName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </a-col>
        <a-col :span="7" style="margin-left:32px;">
          <a-button size="large" @click="getlist" type="primary" icon="search">查询</a-button>
          <a-button size="large" style="margin:0 8px" @click="refresh" icon="reload">重置</a-button>
          <a-button size="large" @click="handletoAdd" type="primary" icon="plus">新增</a-button>
        </a-col>
      </a-row>
    </el-form>
    <!-- table区域-begin -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="eventType" label="事件类型">
        <template slot-scope="scope">
          {{ filterDictText(eventTypeList, scope.row.eventType) }}
        </template>
      </el-table-column>
      <el-table-column prop="eventCode" label="事件编码"> </el-table-column>
      <el-table-column prop="superviseReason" width="400" label="督导原因"> </el-table-column>
      <el-table-column prop="superviseState" label="督导状态">
        <template slot-scope="scope">
          <el-tag
            style="width:80px;"
            :type="
              scope.row.superviseState == '0'
                ? 'info'
                : scope.row.superviseState == '1'
                ? 'success'
                : scope.row.superviseState == '2'
                ? ''
                : scope.row.superviseState == '3'
                ? 'danger'
                : scope.row.superviseState == '5'
                ? 'warning'
                : ''
            "
            effect="dark"
          >
            {{ filterDictText(superviseStateList, scope.row.superviseState) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="deptId" label="责任科室">
        <template slot-scope="scope">
          {{ filtertoDictText(deptIdList, scope.row.deptId,'departName') }}
        </template>
      </el-table-column>
      <el-table-column prop="assessmentResults" label="是否整改" width="120px">
        <template slot-scope="scope">
          {{ filterDictText(assessmentResultsLsit, scope.row.assessmentResults) }}
        </template>
      </el-table-column>
      <el-table-column prop="personLiable" width="120px" label="责任人">
        <template slot-scope="scope">
          {{ filtertoDictText(personLiableList, scope.row.personLiable,'realname') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <a @click="detail(scope.row)" v-if="scope.row.superviseState!=0" type="text">查看详情</a>
          <a @click="edit(scope.row)" v-if="scope.row.superviseState==0" type="text">编辑</a>
          <a-divider type="vertical" v-if="scope.row.superviseState==0" />
          <a @click="deletClick(scope.row.id)" v-if="scope.row.superviseState==0" type="text">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float:right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="form.pageNo"
      :page-sizes="[10]"
      :page-size="form.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <mw-supervise-assessment-form ref="modalForm" @ok="modalFormOk"></mw-supervise-assessment-form>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import mwSuperviseAssessmentForm from './modules/mwSuperviseAssessmentForm'
import { initDictOptions, filterDictText, filterDictTextByCache } from '@/components/dict/JDictSelectUtil'
import { getDictionary } from '@/api/dictionary.js'
import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'

export default {
  name: 'mwSuperviseAssessmentList',
  mixins: [mixinDevice],
  components: {
    mwSuperviseAssessmentForm
  },
  data() {
    return {
      description: '督导考核记录管理页面',
      form: {
        pageNo: 1,
        pageSize: 10
      },
      tableData: [],
      deptIdList: [],
      assessmentResultsLsit: [
        { text: '是', value: '0' },
        { text: '否', value: '1' }
      ],
      // 表头
      url: {
        list: '/mwSuperviseAssessment/mwSuperviseAssessment/list',
        delete: '/mwSuperviseAssessment/mwSuperviseAssessment/delete',
        deleteBatch: '/mwSuperviseAssessment/mwSuperviseAssessment/deleteBatch',
        exportXlsUrl: '/mwSuperviseAssessment/mwSuperviseAssessment/exportXls',
        importExcelUrl: 'mwSuperviseAssessment/mwSuperviseAssessment/importExcel'
      },
      dictOptions: {},
      superviseStateList: [],
      eventTypeList: [],
      personLiableList: [],
      total: 0
    }
  },
  created() {
    this.initDictConfig()
    this.getlist()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    filterDictText,
    filtertoDictText(l, n,name) {
      let str = '-'
      if (l.length > 0) {
        l.forEach(element => {
          if (element.id == n) {
            str = element[name]
          }
        })
      }
      return str
    },
    initDictConfig() {
      getDictionary('event_type').then(res => {
        this.eventTypeList = res.result
      })
      getDictionary('supervise_state').then(res => {
        this.superviseStateList = res.result
      })
      postAction('/sys/sysDepart/getDepartByParams', { orgCategory: '2' }).then(res => {
        if (res.success) {
          this.deptIdList = res.result
        } else {
          this.$message.error(res.message)
        }
      })
      getAction('/sys/user/getUserList').then(res => {
        if (res.success) {
          this.personLiableList = res.result
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //新增
    handletoAdd() {
      this.$refs.modalForm.add()
    },
    //编辑
    edit(record) {
      this.$refs.modalForm.edit(record)
    },
    detail(record){
      this.$refs.modalForm.detail(record)
    },
    handleSizeChange(pageSize) {
      this.form.pageSize = pageSize
      this.getlist()
    },
    handleCurrentChange(pageNo) {
      this.form.pageNo = pageNo
      this.getlist()
    },
    deletClick(id) {
      this.$confirm('是否删除当前数据 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteAction('/mwSuperviseAssessment/mwSuperviseAssessment/delete?id=' + id).then(res => {
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
    refresh() {
      this.form = {}
      this.getlist()
    },
    modalFormOk() {
      this.getlist()
    },
    getlist() {
      getAction(this.url.list, this.form).then(res => {
        if (res.success) {
          this.tableData = res.result.records
          this.total = res.result.total
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
/deep/td.el-table__cell,
/deep/th.el-table__cell {
  text-align: center;
}

/deep/.el-tag--dark {
  border-color: transparent !important;
}
</style>
