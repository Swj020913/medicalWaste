<template>
  <el-dialog
    :title="title"
    :visible="visible"
    width="40%"
    style="z-index:1"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="90px">
      <el-form-item label="督导状态" prop="superviseState">
        <el-select :disabled="isDetail" v-model="form.superviseState" placeholder="请选择">
          <el-option v-for="item in superviseStateList" :key="item.value" :label="item.text" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="整改内容" prop="assessmentContent">
        <el-input
          :disabled="isDetail"
          type="textarea"
          style="width:300px;"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入整改内容"
          v-model="form.assessmentContent"
        >
        </el-input>
      </el-form-item>
      <a-form-item label="上传图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <!-- <a-input v-decorator="['inOutPicname']" placeholder="请输入出入库图片"></a-input> -->
        <a-upload
          :disabled="isDetail"
          multiple
          list-type="picture-card"
          class="avatar-uploader"
          :file-list="fileList"
          @preview="handlePreview"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <div v-if="fileList.length < 8">
            <a-icon type="plus" />
            <div class="ant-upload-text">
              上传图片
            </div>
          </div>
        </a-upload>
        <el-dialog :append-to-body="true" :visible.sync="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%;" :src="previewImage" />
        </el-dialog>
      </a-form-item>
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
import $ from '@/assets/ThreeJs/js/jquery-1.11.0'
import { getAction, deleteAction, putAction, postAction, httpAction, getFileAccessHttpUrl } from '@/api/manage'
import { getDictionary } from '@/api/dictionary.js'
import { getQueryPages } from '@/api/zzjg/zzjg'
import { addSupervise, editSupervise } from '@/api/companyManage/companyManage'
import { initDictOptions, filterDictText, filterDictTextByCache } from '@/components/dict/JDictSelectUtil'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
function getBase64forUrl(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

function getBase64fromUrl(img) {
  //传入图片路径，返回base64
  function getBase64Image(img, width, height) {
    //width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
    var canvas = document.createElement('canvas')
    canvas.width = width ? width : img.width
    canvas.height = height ? height : img.height

    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    var dataURL = canvas.toDataURL()
    return dataURL
  }
  var image = new Image()
  image.crossOrigin = ''
  image.src = img
  var deferred = $.Deferred()
  if (img) {
    image.onload = function() {
      deferred.resolve(getBase64Image(image)) //将base64传给done上传处理
    }
    return deferred.promise() //问题要让onload完成后再return sessionStorage['imgTest']
  }
}
export default {
  data() {
    return {
      form: {},
      isEdit: false,
      rules: {
        assessmentContent: [{ required: true, message: '请输入整改内容', trigger: 'blur' }],
        superviseState: [
          { required: true, message: '请选择督导状态', trigger: 'change' },
          { validator: this.checkSuperviseState, trigger: 'change' }
        ]
      },
      visible: false,
      title: '整改情况',
      deptIdList: [],
      fileList: [],
      previewVisible: false,
      previewImage: '',
      imgList: [],
      imageUrl: '',
      previewImage: false,
      assessmentResultsLsit: [
        { text: '是', value: '0' },
        { text: '否', value: '1' }
      ],
      eventTypeList: [],
      superviseStateList: [],
      personLiableList: [],
      isDetail: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
  },
  created() {
    this.getMsg()
  },
  methods: {
    checkSuperviseState(rule, value, callback) {
      if (value == '' || value == undefined || value == null) {
        callback()
      } else if (value == '0') {
        callback(new Error('请选择开始以外的流程!'))
      } else {
        callback()
      }
    },
    handleCancel() {
      this.previewVisible = false
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('只允许上传图片！！')
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('大小不能超过10M!')
      }
      return isJpgOrPng && isLt2M
    },
    async handleImgUrl(file) {
      await getBase64forUrl(file.originFileObj, imageUrl => {
        this.imageUrl = imageUrl
      })
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleClose() {
      this.form = {}
      this.visible = false
      this.isEdit = false
      this.isDetail = false
      this.previewVisible = false
    },
    //新增
    add() {
      this.title = '新增'
      this.visible = true
    },
    handleChange(info) {
      let that = this
      this.fileList = info.fileList
      that.imgList = []
      this.fileList.forEach(element => {
        if (element.name == 'image.png') {
          getBase64fromUrl(element.url).then(
            function(base64) {
              that.imageUrl = base64
            },
            function(err) {
              console.log(err)
            }
          )
        } else {
          that.handleImgUrl(element)
        }
      })

      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done' || info.file.status === 'error') {
        // Get this url from response in real world.
      }
    },
    //编辑
    edit(record) {
      this.title = '编辑'
      this.form = Object.assign({}, record)
      this.fileList = []
      if (this.form.photos && this.form.photos.length > 0) {
        this.form.photos.forEach((element, index) => {
          this.fileList.push({
            uid: index,
            name: 'image.png',
            status: 'done',
            url: getFileAccessHttpUrl(element)
          })
        })
      } else {
        this.fileList = []
      }
      this.isEdit = true
      this.visible = true
    },
    detail(record) {
      this.title = '详情 '
      this.form = Object.assign({}, record)
      this.fileList = []
      if (this.form.photos && this.form.photos.length > 0) {
        this.form.photos.forEach((element, index) => {
          this.fileList.push({
            uid: index,
            name: 'image.png',
            status: 'done',
            url: getFileAccessHttpUrl(element)
          })
        })
      } else {
        this.fileList = []
      }
      this.isDetail = true
      this.visible = true
    },
    getMsg() {
      getDictionary('event_type').then(res => {
        this.eventTypeList = res.result
      })
      getDictionary('supervise_state').then(res => {
        res.result.splice(0,1)
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
      this.$confirm('保存后将无法修改，是否确认保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.form.validate(valid => {
          if (valid) {
            let connectApi
            if (!that.isEdit) {
              connectApi = addSupervise
            } else {
              connectApi = editSupervise
            }
            that.form.photos = Array.from(new Set(that.imgList))
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
      })
    }
  },
  watch: {
    imageUrl(n, o) {
      this.imgList.push(n)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/input.el-input__inner {
  width: 300px;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
