<template>
  <div>

    <!-- 第三方登录绑定账号密码输入弹框 -->
    <a-modal title="请输入密码" :visible="thirdPasswordShow" @ok="thirdLoginCheckPassword" @cancel="thirdLoginNoPassword" :maskClosable="false">
      <a-input-password placeholder="请输入密码" v-model="thirdLoginPassword" />
    </a-modal>

    <!-- 第三方登录提示是否绑定账号弹框 -->
    <a-modal :footer="null" :closable="false" :visible="thirdConfirmShow" :class="'ant-modal-confirm'" :maskClosable="false">
      <div class="ant-modal-confirm-body-wrapper">
        <div class="ant-modal-confirm-body">
          <a-icon type="question-circle" style="color:#faad14"/>
          <span class="ant-modal-confirm-title">提示</span>
          <div class="ant-modal-confirm-content">
            已有同名账号存在,请确认是否绑定该账号？
          </div>
        </div>
        <div class="ant-modal-confirm-btns">
          <a-button @click="thirdLoginUserCreate" :loading="thirdCreateUserLoding">创建新账号</a-button>
          <a-button @click="thirdLoginUserBind" type="primary">确认绑定</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 第三方登录绑定手机号 -->
    <a-modal :visible="bindingPhoneModal" :class="'ant-modal-confirm'">
      <template slot="footer">
        <a-button key="submit" type="primary" @click="thirdHandleOk">
          确定
        </a-button>
      </template>
      <div class="ant-modal-confirm-body-wrapper">
        <a-form-item>
          <span>绑定手机号</span>
        </a-form-item>
        <a-form-item>
          <a-input
              size="large"
              type="text"
              placeholder="手机号"
              v-model="thirdPhone">
            <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-item>

        <a-row :gutter="16">
          <a-col class="gutter-row" :span="16">
            <a-form-item>
              <a-input
                  size="large"
                  type="text"
                  placeholder="请输入验证码"
                  v-model="thirdCaptcha">
                <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="thirdState.smsSendBtn"
                @click.stop.prevent="getThirdCaptcha"
                v-text="!thirdState.smsSendBtn && '获取验证码' || (thirdState.time+' s')"></a-button>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { JeecgThirdLoginMixin } from '@views/user/third/JeecgThirdLoginMixin'
import { Icon } from 'ant-design-vue';

const IconFont = Icon.createFromIconfontCN({
 // scriptUrl: '//at.alicdn.com/t/font_2316098_umqusozousr.js',
  scriptUrl: '/cdn/font-icon/font_2316098_umqusozousr.js',
});
export default {
  name: 'thirdLogin',
  mixins: [JeecgThirdLoginMixin],
  components: {
    IconFont,
  }
}
</script>

<style lang="less" scoped>
.user-login-other {
  text-align: left;
  margin-top: 24px;
  line-height: 22px;

.item-icon {
  font-size: 24px;
  color: rgba(0, 0, 0, .2);
  margin-left: 16px;
  vertical-align: middle;
  cursor: pointer;
  transition: color .3s;

&  :hover {
  color: #13C2C2;
}
}
.register {
  float: right;
}
}
</style>