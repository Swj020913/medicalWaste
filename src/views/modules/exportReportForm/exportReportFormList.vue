<template>
  <a-card :bordered="false">
    <div class="header1">
      <div>
        <div class="title1">医废报表导出</div>
        <a-input
          placeholder="医废袋识别码"
          style="width:260px;margin-right:10px"
          v-model="searchForm.boxIdentifyingCode"
        ></a-input>
        <!-- <el-date-picker
        v-model="searchForm.time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width:360px;margin-right:10px"
        >></el-date-picker>-->
        <a-button type="primary" icon="search" @click="getList">查询</a-button>
        <a-button icon="reload" @click="reset()">重置</a-button>
      </div>
      <a-button @click="exportXls" type="primary" icon="export">导出</a-button>
    </div>

    <el-table border :data="list">
      <el-table-column align="center" prop="id" label="ID"></el-table-column>
      <el-table-column align="center" prop="barCode" label="医废袋识别码"></el-table-column>
      <el-table-column align="center" prop="deptName" label="科室">
        <template slot="header" slot-scope="{}">
          <el-select v-model="searchForm.deptId" @change="getList">
            <el-option v-for="i in departList" :key="i.id" :value="i.id" :label="i.departName"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="medicalWasteType_dictText" label="医废类型">
        <template slot="header" slot-scope="{}">
          <el-select v-model="searchForm.medicalWasteType" @change="getList">
            <el-option
              v-for="i in medicalWasteTypeArr"
              :key="i.value"
              :value="i.value"
              :label="i.text"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="processStatus" label="流程">
        <template slot="header" slot-scope="{}">
          <el-select v-model="searchForm.processStatus" @change="getList">
            <el-option v-for="i in statusList" :key="i.value" :value="i.value" :label="i.text"></el-option>
          </el-select>
        </template>
        <template slot-scope="scope">{{getDictTitle(scope.row.processStatus,statusList)}}</template>
      </el-table-column>
      <el-table-column align="center" prop="packer" label="操作人"></el-table-column>
      <el-table-column align="center" prop="porter" label="交接人"></el-table-column>
      <el-table-column align="center" prop="createTime" label="操作时间"></el-table-column>
      <el-table-column align="center" prop="medicalWasteWeight" label="重量(kg)"></el-table-column>
    </el-table>
  </a-card>
</template>
<script>
import { getDictTitle } from '../../../utils/util'
import { getDictionary } from '@api/dictionary'
import { getAction, postAction } from '@api/manage'
export default {
  data() {
    return {
      searchForm: {
        processStatus: '1',
        medicalWasteType: '',
        deptId: '',
      },
      list: [],
      total: 0,
      departList: [],
      statusList: [],
      medicalWasteTypeArr: [],
    }
  },
  created() {
    postAction('/sys/sysDepart/getDepartByParams', { orgCategory: '2' }).then((res) => {
      this.departList = [{ id: '', departName: '全部科室' }, ...res.result]
    })
    getDictionary('process_status').then((res) => {
      this.statusList = res.result
    })
    getDictionary('medical_waste_type').then((res) => {
      this.medicalWasteTypeArr = [
        {
          text: '全部医废类型',
          title: '全部医废类型',
          value: '',
        },
        ...res.result,
      ]
    })
    this.getList()
  },
  methods: {
    getList() {
      getAction('/mwProcessManagement/mwProcessManagement/list', this.searchForm).then((res) => {
        this.list = res.result.records
        this.total = res.result.total
      })
    },
    reset() {
      this.searchForm = {
        processStatus: '1',
        medicalWasteType: '',
        deptId: '',
      }
      this.getList()
    },
    exportXls() {
      window.open(
        window._CONFIG['domianURL'] +
          '/mwProcessManagement/mwProcessManagement/exportExcel' +
          '&token=' +
          JSON.parse(localStorage.getItem('pro__Access-Token')).value
      )
    },
    getDictTitle,
  },
}
</script>
<style scoped lang="less">
.header1 {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 10px;
  > div > * {
    margin-bottom: 10px;
    margin-right: 10px;
  }
  .title1 {
    margin-right: 20px;
    font-size: 18px;
    line-height: 30px;
    display: inline;
  }
}
</style>