<template>
  <a-modal
    :visible="visible"
    width="30%"
    :title="type == 'add' ? '新增' : '编辑'"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <el-form label-width="120px" :model="form" :rules="rules">
      <el-form-item v-if="isShow" label="所属城镇">
        <el-select v-model="form.townId" @change="getOrgLists" placeholder="请选择">
          <el-option v-for="item in townList" :key="item.id" :label="item.label" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机构名称">
        <el-select
          :disabled="form.townId == undefined && isShow"
          v-model="form.orgCode"
          placeholder="请选择"
          @change="getDepartList"
        >
          <el-option v-for="item in orgList" :key="item.orgCode" :label="item.departName" :value="item.orgCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="暂存地名称" prop="stagingPointName">
        <el-input v-model="form.stagingPointName" style="width:210px" placeholder="请输入暂存地名称 "></el-input>
      </el-form-item>
      <el-form-item label="暂存地库管" prop="commissionaire">
        <el-select @change="getoptiontList" :disabled="form.orgCode==undefined && isShow" v-model="form.commissionaire" placeholder="请选择">
          <el-option v-for="item in option" :key="item.id" :label="item.realname" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="摄像头数量" prop="cameraNum">
        <el-input v-model="form.cameraNum" style="width:210px" placeholder="请输入摄像头数量"></el-input>
      </el-form-item>
      <!-- <el-form-item label="所属医院" prop="orgId">
        <el-select v-model="form.orgId">
          <el-option
            v-for="item in departList"
            :key="item.id"
            :value="item.id"
            :label="item.departName"
          ></el-option>
        </el-select>
      </el-form-item>-->
    </el-form>
  </a-modal>
</template>
<script>
import { postAction } from '@api/manage'
import { add, edit } from '@api/stagingPoint/index'
import { getTownInfoList, getOrgList } from '@/api/mwRibbonMaintain/index.js'
import { getUserByParams } from '@/api/Ksgl/index.js'
export default {
  data () {
    return {
      type: 'add',
      visible: false,
      departList: [],
      isShow: false,
      form: {},
      townList: [],
      option: [],
      orgList: [],
      rules: {
        //orgId: [{ required: true, message: '请选择机构', trigger: 'change' }],
        stagingPointName: [{ required: true, message: '请输入暂存地名称', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    postAction('/sys/sysDepart/getDepartByParams', { orgCategory: '1' }).then(res => {
      this.departList = res.result
    })
    this.initConfig()
  },
  created () {},
  methods: {
    handleOk () {
      if (this.type == 'add') {
        add(this.form).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.handleCancel()
            this.$emit('ok')
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        edit(this.form).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.handleCancel()
            this.$emit('ok')
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    getDepartList (id) {
      this.form.orgCode = id
      this.form.commissionaire = undefined
      this.orgList.forEach(item=>{
        if(item.orgCode==id)this.form.orgName=item.departName
      })
      this.$forceUpdate()
      this.handchange()
    },
    getoptiontList(id){
      this.form.commissionaire = id
      this.option.forEach(item=>{
        if(item.id==id)this.form.kgName=item.realname
      })
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
    handchange () {
      if (this.form.orgCode) {
        getUserByParams({ roleCode: 'kg', orgCode: this.form.orgCode }).then(res => {
          this.option = res.result
        })
      }
    },
    getOrgLists () {
      let that = this
      that.form.orgCode = undefined
      that.getData()
    },
    getData () {
      let that = this
      getOrgList(that.form.townId == undefined ? '' : that.form.townId).then(res => {
        if (res.success) {
          that.orgList = res.result
        } else {
          that.$message.error(res.message)
        }
      })
    },
    handleCancel () {
      this.visible = false
      setTimeout(() => {
        this.type = 'add'
        this.form = {}
      }, 500)
    }
  },
}
</script>
