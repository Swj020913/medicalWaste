<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="医废条码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['barCode', validatorRules.barCode]" placeholder="请输入医废条码"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="登记人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['registrant', validatorRules.registrant]" placeholder="请输入登记人"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="异常原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['abnormalReason', validatorRules.abnormalReason]" placeholder="请输入异常原因"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="图片地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['picPath']" placeholder="请输入图片地址"  ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="医废类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['medicalWasteType', validatorRules.medicalWasteType]" placeholder="请输入医废类型" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="异常环节" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['abnormalLink', validatorRules.abnormalLink]" placeholder="请输入异常环节" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="上报时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择上报时间" v-decorator="['reportTime']" :trigger-change="true" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col v-if="showFlowSubmitButton" :span="24" style="text-align: center">
            <a-button @click="submitForm">提 交</a-button>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'mwAbnormalRecordForm',
    components: {
    },
    props: {
      //流程表单data
      formData: {
        type: Object,
        default: ()=>{},
        required: false
      },
      //表单模式：true流程表单 false普通表单
      formBpm: {
        type: Boolean,
        default: false,
        required: false
      },
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        form: this.$form.createForm(this),
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
          barCode: {
            rules: [
              { required: true, message: '请输入医废条码!'},
            ]
          },
          registrant: {
            rules: [
              { required: true, message: '请输入登记人!'},
            ]
          },
          abnormalReason: {
            rules: [
              { required: true, message: '请输入异常原因!'},
            ]
          },
          medicalWasteType: {
            rules: [
              { required: true, message: '请输入医废类型!'},
            ]
          },
          abnormalLink: {
            rules: [
              { required: true, message: '请输入异常环节!'},
            ]
          },
        },
        url: {
          add: "/mwAbnormalRecord/mwAbnormalRecord/add",
          edit: "/mwAbnormalRecord/mwAbnormalRecord/edit",
          queryById: "/mwAbnormalRecord/mwAbnormalRecord/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        if(this.formBpm===true){
          if(this.formData.disabled===false){
            return false
          }
          return true
        }
        return this.disabled
      },
      showFlowSubmitButton(){
        if(this.formBpm===true){
          if(this.formData.disabled===false){
            return true
          }
        }
        return false
      }
    },
    created () {
      //如果是流程中表单，则需要加载流程表单data
      this.showFlowData();
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'barCode','registrant','abnormalReason','picPath','medicalWasteType','abnormalLink','reportTime'))
        })
      },
      //渲染流程表单数据
      showFlowData(){
        if(this.formBpm === true){
          let params = {id:this.formData.dataId};
          getAction(this.url.queryById,params).then((res)=>{
            if(res.success){
              this.edit (res.result);
            }
          });
        }
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            console.log("表单提交数据",formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'barCode','registrant','abnormalReason','picPath','medicalWasteType','abnormalLink','reportTime'))
      },
    }
  }
</script>