<template>
  <el-dialog :title="title" :visible="visible" width="30%" :before-close="handleClose">
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="公司类型" prop="companyType">
        <el-select v-model="form.companyType" placeholder="请选择">
          <el-option v-for="item in companyTypeList" :key="item.value" :label="item.text" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公司编码" prop="companyCode">
        <el-input v-model="form.companyCode"></el-input>
      </el-form-item>
      <el-form-item label="公司名称" prop="companyName">
        <el-input v-model="form.companyName"></el-input>
      </el-form-item>
      <el-form-item label="公司电话" prop="companyPhone">
        <el-input v-model="form.companyPhone"></el-input>
      </el-form-item>
      <el-form-item label="公司地址" prop="companyAddress">
        <el-input v-model="form.companyAddress"></el-input>
      </el-form-item>
      <el-form-item label="医废处置地点" prop="disposalLocation">
        <el-input v-model="form.disposalLocation"></el-input>
      </el-form-item>
      <el-form-item label="所属医院" prop="affiliatedHospital">
        <el-select v-model="form.affiliatedHospital" placeholder="请选择">
          <el-option v-for="item in belongHospitalList" :key="item.id" :label="item.departName" :value="item.orgCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医废分类" prop="medicalWasteType">
        <el-select multiple v-model="form.medicalWasteType" placeholder="请选择">
          <el-option v-for="item in medicalWasteTypeList" :key="item.value" :label="item.text" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <a-button size="large" @click="handleClose">取 消</a-button>
      <a-button size="large" style="margin-left:20px" type="primary" @click="submitForm">保 存</a-button>
    </span>
  </el-dialog>
</template>
<script>
import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'
import { addCompany, editCompany } from '@/api/companyManage/companyManage'
import { getDictionary } from '@/api/dictionary.js'
import { getQueryPages } from '@/api/zzjg/zzjg'
export default {
  data() {
    return {
      form: {},
      companyTypeList: [], //公司类型
      medicalWasteTypeList: [], //医废分类
      belongHospitalList: [], //所属医院
      isEdit: false,
      rules: {
        companyType: [{ required: true, message: '请选择公司类型', trigger: 'change' }],
        companyCode: [{ required: true, message: '请输入公司编码', trigger: 'blur' }],
        companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        companyPhone: [{ required: true, message: '请输入公司电话', trigger: 'blur' }],
        disposalLocation: [{ required: true, message: '请输入公司电话', trigger: 'blur' }],
        affiliatedHospital: [{ required: true, message: '请选择所属医院', trigger: 'change' }],
        medicalWasteType: [{ required: true, message: '请选择医废分类', trigger: 'change' }]
      },
      visible: false,
      title: '新增转运公司'
    }
  },
  created() {
    this.getMsg()
  },
  methods: {
    handleClose() {
      this.form = {}
      this.visible = false
    },
    //新增
    add() {
      this.title = '新增转运公司'
      this.isEdit = false
      this.visible = true
    },
    //编辑
    edit(record) {
      this.title = '编辑转运公司'
      this.form = Object.assign({}, record)
      this.form.medicalWasteType = this.form.medicalWasteType.split(',')
      this.isEdit = true
      this.visible = true
    },
    getMsg() {
      getQueryPages({ orgCategory: '1' }).then(res => {
        this.belongHospitalList = res.result
      })
      getDictionary('company_type').then(res => {
        this.companyTypeList = res.result
      })
      getDictionary('medical_waste_type').then(res => {
        this.medicalWasteTypeList = res.result
      })
    },
    submitForm() {
      let that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          let connectApi
          if (!that.isEdit) {
            connectApi = addCompany
          } else {
            connectApi = editCompany
          }
          that.form.medicalWasteType = that.form.medicalWasteType.toString()
          connectApi(that.form).then(res => {
            if (res.success) {
              this.$message.success('保存成功!')
              this.$emit('ok')
              this.handleClose()
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  watch: {}
}
</script>
<style lang="less" scoped>
/deep/input.el-input__inner {
  width: 300px;
}
</style>
