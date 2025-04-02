<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="数量" prop="endCode">
        <el-input-number :min="0" :precision="0" v-model="form.endCode"/>
      </el-form-item>
      <el-form-item label="生产商" prop="manufacturer">
        <el-input v-model="form.manufacturer"></el-input>
      </el-form-item>
      <el-form-item label="科室名称" prop="deptId">
        <el-select v-model="form.deptId" placeholder="请选择">
          <el-option v-for="item in option" :key="item.id" :label="item.departName" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <a-button style="margin-right:8px" @click="handleClose">取 消</a-button>
      <a-button type="primary" @click="add">保 存</a-button>
    </span>
  </el-dialog>
</template>
<script>
import { Ribbonadd} from '@/api/mwRibbonMaintain/index.js'
export default {
  props: ['dialogVisible', 'title'],
  data () {
    return {
      form: {
        endCode:0,
        manufacturer:'',
        deptId:''
      },
      option: [],
      rules: {
        endCode: [{ required: true, message: '请输入数量', trigger: 'blur' }],
        manufacturer: [{ required: true, message: '请输入生产商', trigger: 'blur' }],
        deptId: [{ required: true, message: '请选择科室名称', trigger: 'change' }]
      }
    }
  },
  methods: {
    handleClose () {
      this.$emit('update:dialogVisible', false)
      this.$refs.form.resetFields()
    },
    //新增
    add () {
      this.$refs.form.validate(valid => {
        if (valid) {
          Ribbonadd(this.form).then(res => {
            if (res.code == 200) {
              this.$message.success(res.message)
              this.handleClose()
              this.$emit('getlist')
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    }
  },
  watch: {
    dialogVisible (val) {
      if (val) {
        this.option = this.$parent.$parent.option
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-input{
  width: 250px;
}
.el-select{
  width: 250px;
}
</style>
