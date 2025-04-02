<template>
  <el-dialog :title="title" :destroy-on-close="true" :close-on-click-modal="false" :visible.sync="visible" width="50%"
    v-dialog-drag :before-close="close">
    <el-form :rules="rules" ref="form" :model="form" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构名称" prop="departName">
            <el-input style="width:70%" v-model="form.departName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织机构类型" prop="hospitalCategory">
            <el-select style="width:70%" v-model="form.hospitalCategory" placeholder="请选择组织机构类型">
              <el-option v-for="item in hospitalCategoryMap" :key="item.text" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织机构等级" prop="hospitalGrade">
            <el-select style="width:70%" v-model="form.hospitalGrade" placeholder="请选择组织机构等级">
              <el-option v-for="item in hospitalGradeMap" :key="item.text" :label="item.text" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机构编码" prop="orgCode">
            <el-input style="width:70%" :disabled="isEdit" v-model="form.orgCode"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
        <el-form-item label="所在地址" prop="address">
          <el-input style="width:70%" v-model="form.address"></el-input>
        </el-form-item>
      </el-col>-->
        <el-col :span="12">
          <el-form-item label="机构地址" style="float: left; width: 100%" prop="diqu">
            <el-cascader style="width: 70%" :props="{value:'id'}" @change="changeDiqu" v-model="form.diqu"
              :options="cityList">
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="address" style="float: left; margin-left: -20%;width:90%">
            <el-input style="width: 100%" v-model="form.address" placeholder="请输入机构地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属父机构" prop="parentId">
            <el-select :popper-append-to-body="false" style="width: 85%" v-model="form.parentId" placeholder="请选择所属父机构">
              <el-option :key="''" :label="'无'" :value="''"></el-option>
              <el-option v-for="item in parentHospitalList" :key="item.id" :label="item.departName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="preservation">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import {
    loadDictOptions
  } from '@/utils/util'
  import {
    getAction,
    deleteAction,
    putAction,
    postAction,
    httpAction
  } from '@/api/manage'
  import {
    addDepart,
    editDepart
  } from '@/api/zzjg/zzjg'
  export default {
    data() {
      return {
        form: {
          parentId: ''
        },
        visible: false,
        isEdit: false,
        title: '',
        placeDatas: [],
        cityList: [],
        model: {},
        parentHospitalList: [],
        oilSupplyUnitList: [],
        oilSupplyUnit: [],
        isdisabled: false,
        hospitalGradeMap: [],
        hospitalCategoryMap: [],
        rules: {
          departName: [{
            required: true,
            message: '请输入机构名称',
            trigger: 'blur'
          }],
          address: [{
            required: true,
            message: '请输入机构详细地址',
            trigger: 'blur'
          }],
          orgCode: [{
            required: true,
            message: '请输入机构编码',
            trigger: 'blur'
          }],
          hospitalCategory: [{
            required: true,
            message: '请选择组织机构类型',
            trigger: 'change'
          }],
          hospitalGrade: [{
            required: true,
            message: '请选择组织机构等级',
            trigger: 'change'
          }],
          diqu: [{
            required: true,
            message: '请选择机构所在区域',
            trigger: 'blur'
          }],
        }
      }
    },
    watch: {},
    created() {
      this.initDictConfig()
      this.getCityList()
    },
    methods: {
      changeDiqu(e) {
        if (e != undefined) {
          this.getCityName(this.cityList, 0, e)
        }
      },
      getCityName(array, index, e) {
        array.forEach(element => {
          if (element.id == e[index]) {
            if (index == 0) {
              this.form.countyName = element.label
            } else if (index == 1) {
              this.form.townName = element.label
            } else if (index == 2) {
              this.form.villageName = element.label
            }
            if (element.children != null && element.children.length > 0) {
              this.getCityName(element.children, index + 1, e)
            }
          }
        });
      },
      getCityList() {
        getAction('/mwCity/getCityTree').then(res => {
          if (res.success) {
            this.cityList = res.result
          } else {
            this.$message.error(res.message)
          }
        })
      },
      getParentHospitalList() {
        getAction('/sys/sysDepart/getDepartList?deptId=' + this.form.id).then(res => {
          if (res.success) {
            this.parentHospitalList = res.result
          } else {
            this.$message.error(res.message)
          }
        })
      },
      async initDictConfig() {
        this.hospitalCategoryMap = await loadDictOptions({
          dictCode: 'hospital_category'
        })
        this.hospitalGradeMap = await loadDictOptions({
          dictCode: 'hospital_grade'
        })
      },
      edit(record) {
        this.title = '修改组织机构'
        this.visible = true
        this.isEdit = true
        this.model = Object.assign({}, record)
        this.form = this.model
        if (this.form.countyId == null) {
          this.form.diqu = [this.form.townId, this.form.villageId]
        } else if (this.form.townId == null) {
          this.form.diqu = [this.form.countyId, this.form.villageId]
        } else {
          this.form.diqu = [this.form.countyId, this.form.townId, this.form.villageId]
        }
        this.getParentHospitalList()
      },
      add() {
        this.title = '新增组织机构'
        this.isEdit = false
        this.visible = true
        this.getParentHospitalList()
      },
      changeInput() {
        this.$forceUpdate()
      },
      close() {
        this.form = {}
        this.visible = false
        this.isEdit = false
        this.parentHospitalList = []
      },
      preservation() {
        let that = this
        this.form.orgCategory = '1'
        this.$refs.form.validate(valid => {
          if (valid) {
            let connectApi
            if (!that.isEdit) {
              connectApi = addDepart
            } else {
              connectApi = editDepart
            }
            if (that.form.diqu.length == 2) {
              that.form.countyId = that.form.diqu[0]
              that.form.townId = null
              that.form.villageId = that.form.diqu[1]
            } else {
              that.form.countyId = that.form.diqu[0]
              that.form.townId = that.form.diqu[1]
              that.form.villageId = that.form.diqu[2]
            }
            connectApi(that.form).then(res => {
              if (res.success) {
                this.$message.success('保存成功!')
                this.$emit('cancel')
                this.close()
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
    }
  }
</script>
<style lang="less" scoped>
  /deep/.el-form-item__content {
    width: 150px;
  }

  /deep/input.el-input__inner {
    height: 37.6px !important;
  }

  /deep/.el-form-item__content {
    width: 100%
  }
</style>