<template>
  <a-modal :title="title" :width="800" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk"
    @cancel="handleCancel" cancelText="关闭" wrapClassName="ant-modal-cust-warp"
    style="top:5%;height: 85%;overflow-y: hidden" :maskClosable="false">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名称">
          <a-input placeholder="请输入角色名称" v-decorator="[ 'roleName', validatorRules.roleName]" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色编码">
          <a-input placeholder="请输入角色编码" :disabled="roleDisabled"
            v-decorator="[ 'roleCode', validatorRules.roleCode]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="父级角色">
          <a-select placeholder="请选择父级角色" v-decorator="[ 'parentId', validatorRules.parentId]"
           :options="options">
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="描述">
          <a-textarea :rows="5" placeholder="..." v-decorator="[ 'description', validatorRules.description ]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import {
    addRole,
    editRole,
    duplicateCheck,
    getParentRole
  } from '@/api/api'

  export default {
    name: "RoleModal",
    data() {
      return {
        title: "操作",
        visible: false,
        roleDisabled: false,
        model: {
          parentId: ''
        },
        options: [{
          value: '',
          label: '无',
          disabled: false,
        }],
        labelCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 5
          },
        },
        wrapperCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 16
          },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          roleName: {
            rules: [{
                required: true,
                message: '请输入角色名称!'
              },
              {
                min: 2,
                max: 30,
                message: '长度在 2 到 30 个字符',
                trigger: 'blur'
              }
            ]
          },
          // parentId: {
          //   rules: [{
          //     required: true,
          //     message: '请选择父级角色'
          //   }]
          // },
          roleCode: {
            rules: [{
                required: true,
                message: '请输入角色名称!'
              },
              {
                min: 0,
                max: 64,
                message: '长度不超过 64 个字符',
                trigger: 'blur'
              },
              {
                validator: this.validateRoleCode
              }
            ]
          },
          description: {
            rules: [{
              min: 0,
              max: 126,
              message: '长度不超过 126 个字符',
              trigger: 'blur'
            }]
          }
        },
      }
    },
    created() {},
    methods: {
      add() {
        this.edit({});
      },
      getParentRoleList() {
        let that = this
        getParentRole().then((res) => {
          if (res.success) {
            this.options = [{
              value: '',
              label: '无',
              disabled: false,
            }]
            res.result.forEach((element) => {
              this.options.push({
                value: element.id,
                label: element.roleName,
                disabled: element.id == that.model.id,
              })
            })
          } else {
            this.$message.error(res.message)
          }
        })
      },
      edit(record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        if(this.model.parentId==undefined){
          this.model.parentId = ''
        }
        this.visible = true;

        //编辑页面禁止修改角色编码
        if (this.model.id) {
          this.roleDisabled = true;
        } else {
          this.roleDisabled = false;
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'roleName', 'description', 'roleCode','parentId'))
        });
        this.getParentRoleList()
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            values.roleName = (values.roleName || '').trim()
            values.roleCode = (values.roleCode || '').trim()
            let formData = Object.assign(this.model, values);
            let obj;
            console.log(formData)
            if (!this.model.id) {
              obj = addRole(formData);
            } else {
              obj = editRole(formData);
            }
            obj.then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
        })
      },
      handleCancel() {
        this.close()
      },
      validateRoleCode(rule, value, callback) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback("角色编码不可输入汉字!");
        } else {
          var params = {
            tableName: "sys_role",
            fieldName: "role_code",
            fieldVal: value,
            dataId: this.model.id,
          };
          duplicateCheck(params).then((res) => {
            if (res.success) {
              callback();
            } else {
              callback(res.message);
            }
          });
        }
      }

    }
  }
</script>

<style scoped>

</style>