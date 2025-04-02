<template>
  <a-card :bordered="false">
    <result :is-success="true" :description="description" :title="title">
      <template slot="action">
        <a-button type="primary">返回列表</a-button>
        <a-button style="margin-left: 8px">查看项目</a-button>
        <a-button style="margin-left: 8px">打印</a-button>
      </template>
      <div>
        <div style="font-size: 16px; color: rgba(0, 0, 0, 0.85); font-weight: 500; margin-bottom: 20px;"></div>
        <a-steps :current="4" :direction="isMobile() && directionType.vertical || directionType.horizontal" progressDot>
          <a-step >
            <span style="font-size: 14px" slot="title">油车到站</span>
<!--            <template slot="description">-->
<!--              <div style="fontSize: 12px; color: rgba(0, 0, 0, 0.45); position: relative; left: 42px;" slot="description" >-->
<!--                <div style="margin: 8px 0 4px">-->
<!--                  曲丽丽-->
<!--                  <a-icon style="margin-left: 8px" type="dingding-o" />-->
<!--                </div>-->
<!--                <div>2016-12-12 12:32</div>-->
<!--              </div>-->
<!--            </template>-->
          </a-step>
          <a-step>
            <span style="font-size: 14px" slot="title">罐车测量剂量</span>
<!--            <template slot="description">-->
<!--              <div style="fontSize: 12px; color: rgba(0, 0, 0, 0.45); position: relative; left: 42px;" slot="description" >-->
<!--                <div style="margin: 8px 0 4px">-->
<!--                  周毛毛-->
<!--                  <a-icon style="margin-left: 8px; color: #00A0E9" type="dingding-o" />-->
<!--                </div>-->
<!--                <div><a href="">催一下</a></div>-->
<!--              </div>-->
<!--            </template>-->
          </a-step>
          <a-step>
            <span style="font-size: 14px" slot="title">取样化验</span>

          </a-step>
          <a-step>
            <span style="font-size: 14px" slot="title">下达任务</span>
          </a-step>
          <a-step  >
            <span style="font-size: 14px" slot="title">开泵卸油</span>
          </a-step>
          <a-step  >
            <span style="font-size: 14px" slot="title">停泵</span>
          </a-step>
          <a-step  >
            <span style="font-size: 14px" slot="title">作业评奖</span>
          </a-step>
        </a-steps>
      </div>
    </result>
  </a-card>
</template>

<script>
  import Result from './Result'
  import { mixinDevice } from '@/utils/mixin.js'

  const directionType = {
    horizontal: 'horizontal',
    vertical: 'vertical'
  }

  export default {
    name: "Success",
    components: {
      Result
    },
    mixins: [mixinDevice],
    data () {
      return {
        title: '',
        description: '',
        directionType
      }
    }
  }
</script>

<style scoped>

</style>