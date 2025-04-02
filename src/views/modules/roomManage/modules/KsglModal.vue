<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="50%"
    v-dialog-drag
    :before-close="close"
  >
    <el-row>
      <el-form :rules="rules" ref="form" :model="form" label-width="120px">
        <el-col :span="12" v-if="isShow">
          <!-- <el-form-item label="所属医院" prop="parentId">
          <el-select
            style="width:230px"
            v-model="form.parentId"
            placeholder="请选择"
            @change="handchange"
          >
            <el-option
              v-for="item in option1"
              :key="item.departName"
              :label="item.departName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
          <el-form-item label="所属城镇" prop="townId">
            <el-select style="width:100%" v-model="form.townId" @change="getOrgLists" placeholder="请选择">
              <el-option v-for="item in townList" :key="item.id" :label="item.label" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属医院" prop="parentId">
            <el-select
              style="width:100%"
              :disabled="form.townId == undefined && isShow"
              v-model="form.parentId"
              placeholder="请选择"
              @change="handchange"
            >
              <el-option v-for="item in orgList" :key="item.orgCode" :label="item.departName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="科室名称" prop="departName">
            <el-input style="width:100%" v-model="form.departName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="科室编码" prop="orgCode">
            <el-input style="width:100%" v-model="form.orgCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="正职领导" prop="principalLeader">
            <el-select style="width:100%" v-model="form.principalLeader" placeholder="请选择">
              <el-option
                v-for="item in option2"
                :key="item.realname"
                :label="item.realname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="副职领导" prop="deputyLeader">
            <el-select style="width:100%" v-model="form.deputyLeader" placeholder="请选择">
              <el-option
                v-for="item in option3"
                :key="item.realname"
                :label="item.realname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分管院长" prop="presidentCharge">
            <el-select style="width:100%" v-model="form.presidentCharge" placeholder="请选择">
              <el-option
                v-for="item in option4"
                :key="item.realname"
                :label="item.realname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <a-button style="margin-right:8px" @click="close">取 消</a-button>
      <a-button type="primary" @click="preservation">确 定</a-button>
    </span>
  </el-dialog>
</template>
<script>
import { loadDictOptions } from '@/utils/util'
import { getDepartadd, getDepartedit, getUserByParams } from '@/api/Ksgl/index.js'
import { getTownInfoList, getOrgList } from '@/api/mwRibbonMaintain/index.js'
import { constants } from 'os'
export default {
  props: {
    option1: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      form: {},
      isShow: false,
      visible: false,
      isEdit: false,
      title: '',
      placeDatas: [],
      model: {},
      oilSupplyUnitList: [],
      oilSupplyUnit: [],
      isdisabled: false,
      hospitalGradeMap: [],
      hospitalCategoryMap: [],
      option2: [],
      option3: [],
      option4: [],
      townList: [],
      orgList: [],
      rules: {
        departName: [{ required: true, message: '请输入科室名称', trigger: 'blur' }],
        orgCode: [{ required: true, message: '请输入科室编码', trigger: 'blur' }],
        parentId: [{ required: true, message: '请选择医院', trigger: 'change' }],
        townId: [{ required: true, message: '请选择城镇', trigger: 'change' }]
      }
    }
  },
  watch: {},
  mounted () {
    this.initConfig()
  },
  methods: {
    handchange () {
      this.$forceUpdate()
      this.form.principalLeader = undefined
      this.form.deputyLeader = undefined
      this.form.presidentCharge = undefined
      if (this.form.parentId) {
        this.orgList.forEach(i => {
          if (this.form.parentId == i.id) {
            let ids = i.orgCode
            this.form.parentName = i.departName
            getUserByParams({ roleCode: 'zzld', orgCode: ids }).then(res => {
              this.option2 = res.result
            })
            getUserByParams({ roleCode: 'fzld', orgCode: ids }).then(res => {
              this.option3 = res.result
            })
            getUserByParams({ roleCode: 'fgyz', orgCode: ids }).then(res => {
              this.option4 = res.result
            })
          }
        })
      }
    },
    edit (record) {
      this.visible = true
      this.model = Object.assign({}, record)
      delete this.model.pName
      this.form = this.model
      this.getData()
      this.title = '修改'
      this.isEdit = true
    },
    add () {
      this.title = '新增'
      this.isEdit = false
      this.visible = true
    },
    changeInput () {
      this.$forceUpdate()
    },
    initConfig () {
      let that = this
      getTownInfoList().then(res => {
        if (res.success) {
          if (res.result.isShow) {
            that.isShow = true
            that.townList = res.result.city
          } else {
            that.isShow = false
            that.townList = []
            that.getOrgLists()
          }
        } else {
          that.$message.error(res.message)
        }
      })
    },
    getOrgLists () {
      let that = this
      that.form.parentId = undefined
      that.getData()
    },
    getData () {
      let that = this
      getOrgList(that.form.townId == undefined ? '' : that.form.townId).then(res => {
        if (res.success) {
          that.orgList = res.result
          that.handchange()
        } else {
          that.$message.error(res.message)
        }
      })
    },
    close () {
      this.form = {}
      this.visible = false
      this.isEdit = false
      this.$refs.form.resetFields()
    },
    preservation () {
      let that = this
      this.form.orgCategory = '2'
      this.$refs.form.validate(valid => {
        if (valid) {
          let connectApi
          if (!that.isEdit) {
            connectApi = getDepartadd
          } else {
            connectApi = getDepartedit
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
/deep/input.el-input__inner {
  height: 37.6px !important;
}
</style>
