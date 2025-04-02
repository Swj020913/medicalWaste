<template>
  <a-modal
    :visible="visible"
    width="30%"
    :title="type=='add'?'新增':'编辑'"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <el-form label-width="120px" :model="form" :rules="rules">
      <el-form-item label="机构名称" prop="orgId">
        <el-select v-model="form.orgId">
          <el-option
            v-for="item in departList"
            :key="item.id"
            :value="item.orgCode"
            :label="item.departName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医废箱类型">
        <el-select v-model="form.medicalWasteType">
          <el-option
            v-for="item in medicalWasteTypeArr"
            :key="item.value"
            :label="item.title"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="重量" prop="boxWeight">
        <el-input v-model="form.boxWeight" style="width:210px" placeholder="请输入重量">
          <template slot="append">kg</template>
        </el-input>
      </el-form-item>
    </el-form>
  </a-modal>
</template>
<script>
import { postAction } from '@api/manage'
import { add } from '@api/mwBoxMaintain/index'
export default {
  props: ['medicalWasteTypeArr'],
  data() {
    return {
      type: 'add',
      visible: false,
      departList: [],
      form: {},
      rules: {
        orgId: [{ required: true, message: '请选择机构', trigger: 'change' }],
        boxWeight: [{ required: true, message: '请输入机构', trigger: 'change' }],
      },
    }
  },
  mounted() {
    postAction('/sys/sysDepart/getDepartByParams', { orgCategory: '1' }).then((res) => {
      this.departList = res.result
    })
  },
  created() {},
  methods: {
    handleOk() {
      add(this.form).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.handleCancel()
          this.$emit('ok')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.form = {}
    },
  },
}
</script>