<template>
  <el-dialog :title="title" :visible="visible" width="30%" :before-close="handleClose">
    <el-form ref="form" :rules="rules" :model="form" label-width="90px">
      <el-form-item label="事件类型" prop="eventType">
        <el-select v-model="form.eventType" :disabled="isDetail" placeholder="请选择">
          <el-option v-for="item in eventTypeList" :key="item.value" :label="item.text" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事件编码" prop="eventCode">
        <el-input :disabled="isDetail" v-model="form.eventCode"></el-input>
      </el-form-item>
      <!-- <el-form-item label="督导状态" prop="superviseState">
        <el-select v-model="form.superviseState" placeholder="请选择">
          <el-option v-for="item in superviseStateList" :key="item.value" :label="item.text" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="责任科室" prop="deptId">
        <el-select :disabled="isDetail" v-model="form.deptId" placeholder="请选择">
          <el-option v-for="item in deptIdList" :key="item.id" :label="item.departName" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否整改" prop="assessmentResults">
        <el-select :disabled="isDetail" v-model="form.assessmentResults" placeholder="请选择">
          <el-option v-for="item in assessmentResultsLsit" :key="item.value" :label="item.text" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="责任人" prop="personLiable">
        <el-select :disabled="isDetail" v-model="form.personLiable" placeholder="请选择">
          <el-option v-for="item in personLiableList" :key="item.id" :label="item.realname" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="督导原因" prop="superviseReason">
        <el-input
          :disabled="isDetail"
          type="textarea"
          style="width:300px;"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入督导原因"
          v-model="form.superviseReason"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <a-button size="large" @click="handleClose">取 消</a-button>
      <a-button size="large" style="margin-left:20px" v-if="!isDetail" type="primary" @click="submitForm"
        >保 存</a-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'
import { getDictionary } from '@/api/dictionary.js'
import { getQueryPages } from '@/api/zzjg/zzjg'
import { addSupervise, editSupervise } from '@/api/companyManage/companyManage'
import { initDictOptions, filterDictText, filterDictTextByCache } from '@/components/dict/JDictSelectUtil'
export default {
  data() {
    return {
      form: {},
      isEdit: false,
      rules: {
        eventType: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
        eventCode: [{ required: true, message: '请输入事件编码', trigger: 'blur' }],
        superviseReason: [{ required: true, message: '请输入督导原因', trigger: 'blur' }],
        superviseState: [{ required: true, message: '请选择督导状态', trigger: 'change' }],
        deptId: [{ required: true, message: '请选择责任科室', trigger: 'change' }],
        assessmentResults: [{ required: true, message: '请确认是否整改', trigger: 'change' }],
        affiliatedHospital: [{ required: true, message: '请选择所属医院', trigger: 'change' }],
        personLiable: [{ required: true, message: '请填写责任人', trigger: 'blur' }]
      },
      visible: false,
      title: '新增转运公司',
      deptIdList: [],
      assessmentResultsLsit: [
        { text: '是', value: '0' },
        { text: '否', value: '1' }
      ],
      eventTypeList: [],
      superviseStateList: [],
      personLiableList: [],
      isDetail: false
    }
  },
  created() {
    this.getMsg()
  },
  methods: {
    handleClose() {
      this.form = {}
      this.visible = false
      this.isEdit = false
      this.isDetail = false
    },
    //新增
    add() {
      this.title = '新增'
      this.visible = true
    },
    //编辑
    edit(record) {
      this.title = '编辑'
      this.form = Object.assign({}, record)
      this.isEdit = true
      this.visible = true
    },
    detail(record) {
      this.title = '详情 '
      this.form = Object.assign({}, record)
      this.isDetail = true
      this.visible = true
    },
    getMsg() {
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
    submitForm() {
      let that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          let connectApi
          if (!that.isEdit) {
            connectApi = addSupervise
          } else {
            connectApi = editSupervise
          }
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
