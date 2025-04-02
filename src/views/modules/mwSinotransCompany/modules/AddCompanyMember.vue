<template>
  <el-dialog :title="title" :append-to-body="true" :destroy-on-close="true" :close-on-press-escape="false"
    :close-on-click-modal="false" :visible="visible" width="30%" :before-close="handleClose">
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="员工姓名" prop="userName">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number :min="15" :max="99" v-model="form.age"></el-input-number>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择">
          <el-option v-for="item in sexTypeList" :key="item.value" :label="item.text" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="联系方式" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码" prop="idCard">
        <el-input v-model="form.idCard"></el-input>
      </el-form-item>
      <el-form-item label="照片" prop="personalPhotos" style="height:150px">
        <el-upload :action="uploadAction" :headers="headers" list-type="picture-card"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :class="{ hide: uploadDisabled }"
          :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess" :limit="1" :file-list="fileList">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :modal="false" :append-to-body="true" :close-on-click-modal='false' :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <a-button size="large" @click="handleClose">取 消</a-button>
      <a-button size="large" style="margin-left:20px" type="primary" @click="submitForm">保 存</a-button>
    </span>
  </el-dialog>
</template>
<script>
  import Vue from 'vue'
  import {
    getAction,
    deleteAction,
    putAction,
    postAction,
    httpAction
  } from '@/api/manage'
  import {
    addCompanyMember,
    editCompanyMember
  } from '@/api/companyManage/companyManage'
  import {
    getDictionary
  } from '@/api/dictionary.js'
  import {
    ACCESS_TOKEN
  } from '@/store/mutation-types'
  export default {
    props: {
      companyId: {
        type: String,
        default: ''
      },
    },
    data() {
      const idCardValidity = (rule, code, callback) => {
        var city = {
          11: "北京",
          12: "天津",
          13: "河北",
          14: "山西",
          15: "内蒙古",
          21: "辽宁",
          22: "吉林",
          23: "黑龙江 ",
          31: "上海",
          32: "江苏",
          33: "浙江",
          34: "安徽",
          35: "福建",
          36: "江西",
          37: "山东",
          41: "河南",
          42: "湖北 ",
          43: "湖南",
          44: "广东",
          45: "广西",
          46: "海南",
          50: "重庆",
          51: "四川",
          52: "贵州",
          53: "云南",
          54: "西藏 ",
          61: "陕西",
          62: "甘肃",
          63: "青海",
          64: "宁夏",
          65: "新疆",
          71: "台湾",
          81: "香港",
          82: "澳门",
          91: "国外 "
        };
        var tip = ""
        var pass = true
        if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
          tip = "身份证号格式错误"
          pass = false;
        } else if (!city[code.substr(0, 2)]) {
          // tip = "地址编码错误"
          tip = "身份证输入错误"
          pass = false
        } else {
          // 18位身份证需要验证最后一位校验位
          if (code.length === 18) {
            code = code.split('')
            // ∑(ai×Wi)(mod 11)
            // 加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
            // 校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
            var sum = 0
            var ai = 0
            var wi = 0
            for (var i = 0; i < 17; i++) {
              ai = code[i]
              wi = factor[i]
              sum += ai * wi
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
              // tip = "校验位错误"
              tip = "身份证输入错误"
              pass = false
            }
          }
        }
        if (!pass) {
          callback(new Error(tip))
        } else {
          callback()
        }
      }
      return {
        form: {},
        isEdit: false,
        dialogVisible: false,
        editUploadAction: window._CONFIG['staticDomainURL'] = Vue.prototype.API_BASE_URL + '/sys/common/static/',
        dialogImageUrl: '',
        uploadDisabled: false,
        uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
        rules: {
          userName: [{
            required: true,
            message: '请输入员工姓名',
            trigger: 'change'
          }],
          age: [{
            required: true,
            message: '请输入员工年龄',
            trigger: 'change'
          }],
          sex: [{
            required: true,
            message: '请选择性别',
            trigger: 'change'
          }],
          personalPhotos: [{
            required: true,
            message: '请选择照片',
            trigger: 'change'
          }],
          phone: [{
            required: true,
            message: '请输入联系方式',
            trigger: 'change'
          },{ type: 'number',
            message: '手机号格式不正确',
            trigger: 'blur',
            transform(value) {
              var phonereg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
              if (!phonereg.test(value)) {
                return false
              } else {
                return Number(value)
              }
            }
          }],
          idCard: [{
              required: true,
              message: '请输入身份证号',
              trigger: 'blur'
            },
            {
              pattern: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
              message: '请输入正确的身份证号'
            },
            {
              validator: idCardValidity,
              trigger: 'blur'
            }
          ]
        },
        sexTypeList: [],
        visible: false,
        title: '新增员工',
        fileList: [],
      }
    },
    created() {
      this.initConfig()
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {
        'X-Access-Token': token
      };
    },
    methods: {
      initConfig() {
        getDictionary('sex_type').then(res => {
          this.sexTypeList = res.result
        })
      },
      handleClose() {
        this.form = {}
        this.fileList = []
        this.uploadDisabled = false
        this.visible = false
      },
      //新增
      add() {
        this.title = '新增员工'
        this.isEdit = false
        this.visible = true
        this.form.companyId = this.companyId
      },
      //编辑
      edit(record) {
        this.title = '编辑员工'
        this.form = Object.assign({}, record)
        this.form.sex = this.form.sex + ''
        this.form.companyId = this.companyId
        this.fileList = [];
        var personalPhotos = this.form.personalPhotos;
        if (personalPhotos != null && personalPhotos != '') {
          this.fileList = [{
            name: personalPhotos,
            url: this.editUploadAction + this.form.personalPhotos
          }]
          this.uploadDisabled = true
        }
        this.isEdit = true
        this.visible = true
      },
      handleRemove(file, fileList) {
        this.form.personalPhotos = '';
        this.uploadDisabled = false
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      beforeAvatarUpload(file) {
        const isPicture = file.type;
        const isLt2M = file.size / 1024 / 1024 < 20;
        if (isPicture.indexOf('image') == -1) {
          this.$message.error('只能上传图片!');
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 20MB!');
        }
        return isPicture && isLt2M;
      },
      handleAvatarSuccess(res, file) {
        this.form.personalPhotos = res.message;
        this.uploadDisabled = true
      },
      submitForm() {
        let that = this
        this.$refs.form.validate(valid => {
          if (valid) {
            let connectApi
            if (!that.isEdit) {
              connectApi = addCompanyMember
            } else {
              connectApi = editCompanyMember
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

  /deep/.el-input-number__increase {
    right: -66% !important
  }

  ::v-deep .el-dialog .hide .el-upload--picture-card {
    display: none;
  }

  ::v-deep .el-dialog .hide {
    height: 80px;
  }
</style>