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
        <el-select v-model="form.deptId" :disabled="form.orgId==undefined||form.townId==undefined" @change="getId"
          placeholder="请选择">
          <el-option v-for="item in option4" :key="item.id" :label="item.departName" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医废间条码" prop="barCode">
        <el-input v-model="form.barCode"></el-input>
      </el-form-item>
      <el-form-item label="医废类别" prop="medicalWasteType">
        <el-select v-model="form.medicalWasteType" placeholder="请选择" @change="change">
          <el-option v-for="item in option3" :key="item.value" :label="item.text" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医废形态" prop="medicalWasteShape">
        <el-select multiple v-model="form.medicalWasteShape" placeholder="请选择">
          <el-option v-for="item in option1" :key="item.value" :label="item.text" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="医废包装" prop="medicalWastePack">
        <el-select multiple v-model="form.medicalWastePack" placeholder="请选择">
          <el-option v-for="item in option2" :key="item.value" :label="item.text" :value="item.value"
            :disabled="item.value == 4">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运输单位" prop="transportUnit">
        <el-input v-model="form.transportUnit"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <a-button style="margin-right:8px" @click="handleClose">取 消</a-button>
      <a-button v-if="title == '新增'" type="primary" @click="add">保 存</a-button>
      <a-button v-if="title == '编辑'" type="primary" @click="edit">确 定</a-button>
    </span>
  </el-dialog>
</template>
<script>
  import {
    mwDeptadd,
    mwDeptedit,
    mwDeptqueryById
  } from '@/api/mwDeptMaintain/index.js'
  import {
    Ribbonadd,
    getTownInfoList,
    getOrgList
  } from '@/api/mwRibbonMaintain/index.js'
  import {
    mwDeptlistAll
  } from '@/api/mwDeptMaintain/index.js'
  export default {
    props: ['dialogVisible', 'title', 'id'],
    data() {
      return {
        form: {
          medicalWasteShape: [],
          medicalWastePack: [],
          deptId: '',
          barCode: '',
          medicalWasteType: '',
          transportUnit: ''
        },
        rules: {
          deptId: [{
            required: true,
            message: '请选择科室名称',
            trigger: 'change'
          }],
          barCode: [{
            required: true,
            message: '请输入医废间条码',
            trigger: 'blur'
          }],
          medicalWasteType: [{
            required: true,
            message: '请选择医废类别',
            trigger: 'change'
          }],
          medicalWasteShape: [{
            required: true,
            message: '请选择医废形态',
            trigger: 'change'
          }],
          medicalWastePack: [{
            required: true,
            message: '请选择医废包装',
            trigger: 'change'
          }],
          transportUnit: [{
            required: true,
            message: '请输入运输单位',
            trigger: 'blur'
          }]
        },
        option1: [], //形态
        option2: [], //包装
        option3: [], //类别
        option4: [],
        orgList: [],
        townList: [],
        isShow: false,
        isFirst: true
      }
    },
    methods: {
      handleClose() {
        this.$emit('update:dialogVisible', false)
        this.$refs.form.resetFields()
        this.isFirst = true
      },
      getOrgList() {
        let that = this
        if (!this.isFirst) {
          that.form.orgId = undefined
          that.form.deptId = undefined
        }
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
      getId(id) {
        this.form.deptId = id
        this.$forceUpdate()
      },
      getDepartList() {
        if (!this.isFirst) {
          this.form.deptId = undefined
        }
        this.$forceUpdate()
        mwDeptlistAll(this.form.orgId == undefined ? '' : this.form.orgId).then(res => {
          this.option4 = res.result
        })
      },
      change() {
        this.form.medicalWasteShape = []
        this.form.medicalWastePack = []
        if (this.form.medicalWasteType == this.option3[1].value) {
          this.form.medicalWasteShape.push(this.option1[0].value)
          this.form.medicalWastePack.push(this.option2[3].value)
        }
      },
      //新增
      add() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.form.medicalWasteShape = this.form.medicalWasteShape.toString()
            this.form.medicalWastePack = this.form.medicalWastePack.toString()
            mwDeptadd(this.form).then(res => {
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
      },
      //编辑
      edit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.form.medicalWasteShape = this.form.medicalWasteShape.toString()
            this.form.medicalWastePack = this.form.medicalWastePack.toString()
            mwDeptedit(this.form).then(res => {
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
          this.option1 = this.$parent.$parent.option1
          this.option2 = this.$parent.$parent.option2
          this.option3 = this.$parent.$parent.option3
          this.option4 = this.$parent.$parent.option4
          if (this.title == '编辑') {
            mwDeptqueryById({
              id: this.id
            }).then(res => {
              this.form = res.result
              that.getOrgList()
              that.getDepartList()
              that.isFirst = false
              this.form.medicalWasteShape = this.form.medicalWasteShape.split(',')
              this.form.medicalWastePack = this.form.medicalWastePack.split(',')
            })
          }
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
  /deep/input.el-input__inner {
    width: 300px;
  }
</style>