<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">

      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo颜色根据主题颜色变化 -->
      <img src="~@/assets/jy_log.png" alt="logo">
<!--      <img  src="~@/assets/logo.svg" alt="logo">-->
      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo颜色根据主题颜色变化 -->

      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
  import { mixin } from '@/utils/mixin.js'

  export default {
    name: 'Logo',
    mixins: [mixin],
    props: {
      title: {
        type: String,
        default: '医疗废物管理',
        required: false
      },
      showTitle: {
        type: Boolean,
        default: true,
        required: false
      }
    }
  }
</script>
<style lang="less" scoped>
  /*缩小首页布 局顶部的高度*/
  @height: 59px;

  .sider {
    box-shadow: none !important;
    .logo {
      height: @height !important;
      line-height: @height !important;
      box-shadow: none !important;
      transition: background 300ms;

      a {
        color: white;
        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    &.light .logo {
      background-color: @primary-color;
    }
  }
</style>