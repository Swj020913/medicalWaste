<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item v-if="isShow" label="所属城镇" prop="townId">
        <el-select v-model="form.townId" @change="getOrgList" placeholder="请选择">
          <el-option v-for="item in townList" :key="item.id" :label="item.label" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机构名称" prop="orgId">
        <el-select :disabled="form.townId==undefined&&isShow" @change="getDepartList" v-model="form.orgId"
          placeholder="请选择">
          <el-option v-for="item in orgList" :key="item.orgCode" :label="item.departName" :value="item.orgCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室名称" prop="deptId">
        <el-select v-model="form.deptId" :disabled="form.orgId==undefined" @change="getId" placeholder="请选择">
          <el-option v-for="item in option" :key="item.id" :label="item.departName" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="endCode">
        <el-input-number :min="0" :precision="0" v-model="form.endCode" />
      </el-form-item>
      <el-form-item label="生产商" prop="manufacturer">
        <el-input v-model="form.manufacturer"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <a-button style="margin-right:8px" @click="handleClose">取 消</a-button>
      <a-button type="primary" @click="add">保 存</a-button>
    </span>
  </el-dialog>
</template>
<script>
  import {
    Ribbonadd,
    getTownInfoList,
    getOrgList
  } from '@/api/mwRibbonMaintain/index.js'
  import {
    mwDeptlistAll
  } from '@/api/mwDeptMaintain/index.js'
  export default {
    props: ['dialogVisible', 'title'],
    data() {
      return {
        form: {
          endCode: 0,
          manufacturer: '',
          deptId: ''
        },
        option: [],
        orgList: [],
        townList: [],
        isShow: false,
        rules: {
          endCode: [{
            required: true,
            message: '请输入数量',
            trigger: 'blur'
          }],
          manufacturer: [{
            required: true,
            message: '请输入生产商',
            trigger: 'blur'
          }],
          townId: [{
            required: true,
            message: '请选择所属城镇',
            trigger: 'change'
          }],
          orgId: [{
            required: true,
            message: '请选择机构名称',
            trigger: 'change'
          }],
          deptId: [{
            required: true,
            message: '请选择科室名称',
            trigger: 'change'
          }]
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit('update:dialogVisible', false)
        this.$refs.form.resetFields()
      },
      getId(id) {
        this.form.deptId = id
        this.$forceUpdate()
      },
      getDepartList() {
        this.form.deptId = undefined
        this.$forceUpdate()
        mwDeptlistAll(this.form.orgId == undefined ? '' : this.form.orgId).then(res => {
          this.option = res.result
        })
      },
      getOrgList() {
        let that = this
        that.form.orgId = undefined
        that.form.deptId = undefined
        getOrgList(that.form.townId == undefined ? '' : that.form.townId).then(res => {
          if (res.success) {
            that.orgList = res.result
            if (this.orgList.length > 0 && !this.isShow) {
              this.form.orgId = this.orgList[0].orgCode
              this.getDepartList()
            }
          } else {
            that.$message.error(res.message)
          }
        })
      },
      //新增
      add() {
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
      dialogVisible(val) {
        if (val) {
          let that = this
          getTownInfoList().then(res => {
            if (res.success) {
              if (res.result.isShow) {
                that.isShow = true
                that.townList = res.result.city
              } else {
                that.isShow = false
                that.townList = []
                that.getOrgList()
              }
            } else {
              that.$message.error(res.message)
            }
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-input {
    width: 250px;
  }

  .el-select {
    width: 250px;
  }
</style>