<template>
  <el-dialog title="打印详情" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
    <div id="printId">
      <h1 style="font-size:24px;font-weight:500;text-align: center;margin-bottom: 60px;">医疗废物转运单</h1>
      <el-form ref="form" :model="form" label-width="132px" style="font-size: 18px!important;">
        <el-row>
          <el-col :span="14">
            <div class="grid-content bg-purple" style="margin-bottom:6px">
              <!-- <el-form-item label="医疗卫生机构名称 :" style="margin-bottom:0px!important"> -->
              医疗卫生机构名称 :
              {{ form.departName }}
              <!-- </el-form-item> -->
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple-light" style="margin-bottom:6px">
              <!-- <el-form-item label="三联单编号 :" style="margin-bottom:0px!important"> -->
              <span style="margin-left: 18px;">三联单编号 :</span>
              {{ form.triplicateFormCode }}
              <!-- </el-form-item> -->
            </div>
          </el-col>
          <el-col :span="14">
            <div class="grid-content bg-purple-light" style="margin-bottom:6px">
              <!-- <el-form-item label="医废生产单位地址 :" style="margin-bottom:0px!important"> -->

              医疗废物运输单位 :
              {{ form.companyName }}
              <!-- </el-form-item> -->
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purple-light" style="margin-bottom:6px">
              <!-- <el-form-item label="医废处置地点 :" style="margin-bottom:0px!important" -->
              医废处置地点 :
              {{ form.disposalLocation }}
              <!-- </el-form-item> -->
            </div>
          </el-col>
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">
              <!-- <el-form-item style="float:left;" label="医疗废物运输单位 :">  -->
              医废生产单位地址 :
              {{ form.orgAddress }}
              <!-- </el-form-item> -->
              <div style="float:right;margin-right: 20px;line-height: 28px;">{{ year }}年{{ month }}月{{ day }}日</div>
            </div>
          </el-col>
        </el-row>

        <table style="border:1px solid #ccc;width: 100%;text-align:center;margin-top: 15px;">
          <tr>
            <td style="border:1px solid #ccc;padding:10px 0">医废箱编码</td>
            <td style="border:1px solid #ccc;padding:10px 0">医废类型</td>
            <td style="border:1px solid #ccc;padding:10px 0">医废包装方式</td>
            <td style="border:1px solid #ccc;padding:10px 0">包装数量</td>
            <td style="border:1px solid #ccc;padding:10px 0">合计重量</td>
          </tr>
          <tr v-for="(item, index) in tableList" :key="index" style="border:1px solid #ccc;">
            <td style="border:1px solid #ccc;padding:10px 0">{{ item.temporaryContainerCode }}</td>
            <td style="border:1px solid #ccc;padding:10px 0">{{ fun(medicaltypeList, item.medicalWasteType) }}</td>
            <td style="border:1px solid #ccc;padding:10px 0">{{ fun(medicalpackList, item.medicalWastePack) }}</td>
            <td style="border:1px solid #ccc;padding:10px 0">{{ item.bagNum }}</td>
            <td style="border:1px solid #ccc;padding:10px 0">{{ item.medicalWasteWeight }}</td>
          </tr>
        </table>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <!-- <el-form-item label="交接人联系方式 :" style="margin-bottom:0px!important;"> -->
              <span style="margin-left:16px">交接人联系方式 : </span>
              <div
                style="line-height:40px;border-bottom: 1px solid #000;height: 45px;width: 40%;display: inline-block;">
              </div>
              <!-- </el-form-item> -->
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <!-- <el-form-item label="运输人员联系方式 :" style="margin-bottom:0px!important"> -->
              运输人员联系方式 :
              <div
                style="line-height:40px;border-bottom: 1px solid #000;height: 45px;width: 40%;display: inline-block;">
              </div>
              <!-- </el-form-item> -->
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <!-- <el-form-item label="接收人联系方式 :" style="margin-bottom:0px!important"> -->
              <span style="margin-left:16px">接收人联系方式 : </span>
              <div
                style="line-height:40px;border-bottom: 1px solid #000;height: 45px;width: 40%;display: inline-block;">
              </div>
              <!-- </el-form-item> -->
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <!-- <el-form-item label="交接人签名 :" style="margin-bottom:0px!important;"> -->

              <span style="margin-left: 54px;margin-right: 1px;">交接人签名 : </span>
              <div
                style="line-height:40px;border-bottom: 1px solid #000;height: 45px;width: 40%;display: inline-block;">
              </div>
              <!-- </el-form-item> -->
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <!-- <el-form-item label="医废运输人员签名 :" style="margin-bottom:0px!important;"> -->
              医废运输人员签名 :
              <div
                style="line-height:40px;border-bottom: 1px solid #000;height: 45px;width: 40%;display: inline-block;">
              </div>
              <!-- </el-form-item> -->
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <!-- <el-form-item label="接收人签名 :" style="margin-bottom:0px!important;"> -->
              <span style="margin-left: 54px;margin-right: 1px;">接收人签名 : </span>
              <div
                style="line-height:40px;border-bottom: 1px solid #000;height: 45px;width: 40%;display: inline-block;">
              </div>
              <!-- </el-form-item> -->
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" v-print="'#printId'">打印</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getTransportDetails } from '@/api/Ksgl/index'
import { getDictionary } from '@/api/dictionary.js'
export default {
  props: ['dialogVisible', 'obj'],
  data() {
    return {
      form: {},
      tableList: [],
      year: '',
      month: '',
      day: '',
      medicaltypeList: [],
      medicalpackList: []
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
    },
    fun(a, b) {
      let c = ''
      a.forEach(i => {
        if (i.value == b) {
          c = i.text
        }
      })
      return c
    }
  },
  mounted() {
    getDictionary('medical_waste_type').then(res => {
      this.medicaltypeList = res.result
    })
    getDictionary('medical_waste_pack').then(res => {
      this.medicalpackList = res.result
    })
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.tableList = []
        getTransportDetails({ processIdList: this.obj.processId }).then(res => {
          this.form = res.result[0]
          this.year = this.form.createTime.split('-')[0]
          this.month = this.form.createTime.split('-')[1]
          this.day = this.form.createTime.split('-')[2].split(' ')[0]
          this.tableList = res.result
        })
      }
    }
  }
}
</script>
