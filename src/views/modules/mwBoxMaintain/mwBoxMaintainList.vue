<template>
  <a-card :bordered="false">
    <div class="header1">
      <div class="title1">医废箱信息配置</div>
      <a-input
        placeholder="识别码"
        style="width:300px;margin-right:10px"
        v-model="searchForm.boxIdentifyingCode"
      ></a-input>
      <a-button type="primary" icon="search" @click="getList">查询</a-button>
      <a-button icon="reload" @click="reset()">重置</a-button>
      <a-button @click="open('add')" icon="plus">新增</a-button>
      <a-button icon="download" @click="downLoads" :disabled="selectList.length == 0">批量下载二维码</a-button>
    </div>

    <el-table border style="margin-top:30px" :data="list" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="80px"></el-table-column>
      <el-table-column align="center" prop="id" label="ID"></el-table-column>
      <el-table-column align="center" prop="boxIdentifyingCode" label="识别码"></el-table-column>
      <el-table-column align="center" prop="orgId" label>
        <template slot="header" slot-scope="{}">
          <el-select v-model="searchForm.orgId" placeholder="全部机构名称" @change="getList" clearable>
            <el-option key="全部机构名称" label="全部机构名称" value=""></el-option>
            <el-option v-for="item in departList" :key="item.orgId" :label="item.departName" :value="item.orgCode"></el-option>
          </el-select>
        </template>
        <template slot-scope="scope">{{ int(departList, scope.row.orgId) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="medicalWasteType" label>
        <template slot="header" slot-scope="{}">
          <el-select v-model="searchForm.medicalWasteType" placeholder="全部医废类型" @change="getList" clearable>
            <el-option
              v-for="item in medicalWasteTypeArr2"
              :key="item.value"
              :label="item.title"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
        <template slot-scope="scope">{{ getValue(scope.row.medicalWasteType, medicalWasteTypeArr) }}</template>
      </el-table-column>

      <el-table-column align="center" prop="state" label>
        <template slot="header" slot-scope="{}">
          <el-select v-model="searchForm.boxState" placeholder="全部状态" @change="getList" clearable>
            <el-option
              v-for="item in boxStateArr"
              :key="item.value"
              :label="item.title"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
        <template slot-scope="scope">{{ getValue(scope.row.state, boxStateArr2) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="boxWeight" label="重量(kg)"></el-table-column>
      <el-table-column align="center" prop label="操作">
        <template slot-scope="scope">
          <!-- <el-button  @click="handleDelete(scope.row.id)">删除</el-button> -->
          <a-popconfirm title="是否删除？" @confirm="handleDelete(scope.row.id)" ok-text="确定" cancel-text="取消">
            <a href="#">删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a href="#" @click="downLoad(scope.row.boxIdentifyingCode)">下载二维码</a>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="float: right;margin-top:20px"
      :current-page.sync="searchForm.pageNo"
      :page-sizes="[5, 10, 15, 20]"
      :page-size.sync="searchForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total.sync="total"
    ></el-pagination>

    <mwBoxMaintainForm ref="boxForm" :medicalWasteTypeArr="medicalWasteTypeArr" @ok="getList"></mwBoxMaintainForm>
  </a-card>
</template>

<script>
import { getDictionary } from '@api/dictionary'
import mwBoxMaintainForm from './modules/mwBoxMaintainForm.vue'
import { list, del } from '@api/mwBoxMaintain/index'
import { getDictTitle } from '../../../utils/util'
import { postAction } from '@api/manage'
export default {
  components: { mwBoxMaintainForm },
  data () {
    return {
      description: '医废箱信息配置管理页面',
      // 表头

      url: {
        list: '/mwBoxMaintain/mwBoxMaintain/list',
        delete: '/mwBoxMaintain/mwBoxMaintain/delete',
        deleteBatch: '/mwBoxMaintain/mwBoxMaintain/deleteBatch',
        exportXlsUrl: '/mwBoxMaintain/mwBoxMaintain/exportXls',
        importExcelUrl: 'mwBoxMaintain/mwBoxMaintain/importExcel'
      },
      dictOptions: {},
      superFieldList: [],
      searchForm: {
        pageNo: 1,
        pageSize: 10
      },
      medicalWasteTypeArr: [],
      medicalWasteTypeArr2: [],
      boxStateArr: [],
      boxStateArr2: [],
      list: [],
      total: 0,
      selectList: [],
      arr: [],
      departList: []
    }
  },
  created () {
    getDictionary('medical_waste_type').then(res => {
      this.medicalWasteTypeArr = res.result
      this.medicalWasteTypeArr2 = [
        {
          text: '全部医废类型',
          title: '全部医废类型',
          value: ''
        },
        ...res.result
      ]
    })
    getDictionary('box_state').then(res => {
      this.boxStateArr = [{ text: '全部状态', title: '全部状态', value: '' }, ...res.result]
      this.boxStateArr2 = res.result
    })
    postAction('/sys/sysDepart/getDepartByParams', { orgCategory: '1' }).then(res => {
      this.departList = res.result
      console.log(11111,this.departList)
    })
  },
  mounted () {
    this.getList()
  },
  methods: {
    handleSelectionChange (val) {
      let array = []
      val.forEach(el => {
        array.push(el.id)
      })
      this.selectList = array
    },
    getValue (val, array) {
      let index = array.findIndex(o => {
        return o.value == val
      })
      if (index == -1) return '--'
      else {
        return array[index].title
      }
    },
    open (type) {
      this.$refs.boxForm.visible = true
    },
    getList () {
      list(this.searchForm).then(res => {
        this.list = res.result.records
        this.total = res.result.total
      })
    },
    reset () {
      this.searchForm = {
        pageNo: 1,
        pageSize: 10
      }
      this.getList()
    },
    handleDelete (id) {
      del(id).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.getList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    int (a, b) {
      let c = ''
      a.forEach(item => {
        if (item.orgCode == b) {
          c = item.departName
        }
      })
      return c
    },
    downLoad (id) {
      window.open(
        window._CONFIG['domianURL'] +
          '/mwBoxMaintain/mwBoxMaintain/test?param=' +
          id +
          '&token=' +
          JSON.parse(localStorage.getItem('pro__Access-Token')).value
      )
    },
    downLoads () {
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
    getDictTitle
  }
}
</script>
<style scoped lang="less">
.header1 {
  display: flex;
  flex-wrap: wrap;
  > * {
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
