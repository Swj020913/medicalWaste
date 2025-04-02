<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="医废新条码">
              <a-input placeholder="请输入医废条码" v-model="queryParam.newBarCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="医废类别">
              <el-select size="small" v-model="queryParam.medicalWasteType" placeholder="请选择">
                <el-option
                  v-for="item in medicalWasteTypeList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: true }"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange"
      >
        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img
            v-else
            :src="getImgView(text)"
            height="25px"
            alt=""
            style="max-width:80px;font-size: 12px;font-style: italic;"
          />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <!-- <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span> -->
      </a-table>
    </div>

    <mw-abnormal-record-modal ref="modalForm" @ok="modalFormOk"></mw-abnormal-record-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import mwAbnormalRecordModal from './modules/mwAbnormalRecordModal'
import { getDictionary } from '@/api/dictionary.js'

export default {
  name: 'mwAbnormalRecordList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    mwAbnormalRecordModal
  },
  data() {
    return {
      description: '异常管理管理页面',
      medicalWasteTypeList: [],
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '医废旧条码',
          align: 'center',
          dataIndex: 'oldBarCode'
        },
        {
          title: '医废新条码',
          align: 'center',
          dataIndex: 'newBarCode'
        },
        {
          title: '登记人',
          align: 'center',
          dataIndex: 'registrant'
        },
        {
          title: '异常原因',
          align: 'center',
          dataIndex: 'abnormalReason'
        },
        {
          title: '图片地址',
          align: 'center',
          dataIndex: 'picPath'
        },
        {
          title: '医废类型',
          align: 'center',
          dataIndex: 'medicalWasteType'
        },
        {
          title: '异常环节',
          align: 'center',
          dataIndex: 'abnormalLink'
        },
        {
          title: '上报时间',
          align: 'center',
          dataIndex: 'reportTime',
          customRender: function(text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          }
        },
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: 'center',
        //   fixed: 'right',
        //   width: 147,
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      url: {
        list: '/mwAbnormalRecord/mwAbnormalRecord/list',
        delete: '/mwAbnormalRecord/mwAbnormalRecord/delete',
        deleteBatch: '/mwAbnormalRecord/mwAbnormalRecord/deleteBatch',
        exportXlsUrl: '/mwAbnormalRecord/mwAbnormalRecord/exportXls',
        importExcelUrl: 'mwAbnormalRecord/mwAbnormalRecord/importExcel'
      },
      dictOptions: {},
      superFieldList: []
    }
  },
  created() {
    this.getSuperFieldList()
    this.initDictConfig()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    initDictConfig() {
      getDictionary('medical_waste_type').then(res => {
        this.medicalWasteTypeList = res.result
      })
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'barCode', text: '医废条码', dictCode: '' })
      fieldList.push({ type: 'string', value: 'registrant', text: '登记人', dictCode: '' })
      fieldList.push({ type: 'string', value: 'abnormalReason', text: '异常原因', dictCode: '' })
      fieldList.push({ type: 'string', value: 'picPath', text: '图片地址', dictCode: '' })
      fieldList.push({ type: 'int', value: 'medicalWasteType', text: '医废类型', dictCode: 'medical_waste_type,,' })
      fieldList.push({ type: 'int', value: 'abnormalLink', text: '异常环节', dictCode: '' })
      fieldList.push({ type: 'date', value: 'reportTime', text: '上报时间' })
      this.superFieldList = fieldList
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
