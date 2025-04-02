/** init domain config */
import './config'

import Vue from 'vue'
import App from './App.vue'
import Storage from 'vue-ls'
import router from './router'
import store from './store/'
import { VueAxios } from "@/utils/request"
import Uicomponents from '@/components/ui';
import importDirective from '@/directive';
// import _ from 'lodash';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';

require('@jeecg/antd-online-mini')
require('@jeecg/antd-online-mini/dist/OnlineForm.css')

import Antd, { version } from 'ant-design-vue'
console.log('ant-design-vue version:', version)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import Viser from 'viser-vue'
import 'ant-design-vue/dist/antd.less'; // or 'ant-design-vue/dist/antd.less'

import '@/permission' // permission control
import '@/utils/filter' // base filter
import Print from 'vue-print-nb-jeecg'
/*import '@babel/polyfill'*/
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import SSO from '@/cas/sso'
//地图插件
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet.markercluster";
import {
    ACCESS_TOKEN,
    DEFAULT_COLOR,
    DEFAULT_THEME,
    DEFAULT_LAYOUT_MODE,
    DEFAULT_COLOR_WEAK,
    SIDEBAR_TYPE,
    DEFAULT_FIXED_HEADER,
    DEFAULT_FIXED_HEADER_HIDDEN,
    DEFAULT_FIXED_SIDEMENU,
    DEFAULT_CONTENT_WIDTH_TYPE,
    DEFAULT_MULTI_PAGE
} from "@/store/mutation-types"
import config from '@/defaultSettings'
import prints from '../src/views/print/prints.js'
import JDictSelectTag from './components/dict/index.js'
import hasPermission from '@/utils/hasPermission'
import vueBus from '@/utils/vueBus';
import JeecgComponents from '@/components/jeecg/index'
import '@/assets/less/JAreaLinkage.less'
import VueAreaLinkage from 'vue-area-linkage'
import '@/components/jeecg/JVxeTable/install'
import '@/components/JVxeCells/install'
import './directives.js';
import global from '@/components/Global' //引用全局变量文件
import x2js from 'x2js' //xml数据处理插件
Vue.prototype.GLOBAL = global //将全局变量挂载到Vue实例上面
Vue.prototype.$x2js = new x2js() //创建x2js对象，挂到vue原型上
Vue.config.productionTip = false
// 将自动注册所有组件为全局组件
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)
Vue.use(Storage, config.storageOptions)
Vue.use(Antd)
Vue.use(VueAxios, router)
Vue.use(Viser)
Vue.use(hasPermission)
Vue.use(JDictSelectTag)
Vue.use(Print)
Vue.use(preview)
Vue.use(vueBus);
Vue.use(JeecgComponents);
Vue.use(VueAreaLinkage);
Vue.use(ElementUI);
Vue.use(Uicomponents)
Vue.use(Viewer)
Vue.use(prints)
importDirective(Vue);
Vue.prototype.bus = new Vue()
SSO.init(() => {
    main()
})

function main() {
    new Vue({
        router,
        store,
        mounted() {
            store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, true))
            store.commit('TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
            store.commit('TOGGLE_LAYOUT_MODE', Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout))
            store.commit('TOGGLE_FIXED_HEADER', Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader))
            store.commit('TOGGLE_FIXED_SIDERBAR', Vue.ls.get(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar))
            store.commit('TOGGLE_CONTENT_WIDTH', Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth))
            store.commit('TOGGLE_FIXED_HEADER_HIDDEN', Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
            store.commit('TOGGLE_WEAK', Vue.ls.get(DEFAULT_COLOR_WEAK, config.colorWeak))
            store.commit('TOGGLE_COLOR', Vue.ls.get(DEFAULT_COLOR, config.primaryColor))
            store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
            store.commit('SET_MULTI_PAGE', Vue.ls.get(DEFAULT_MULTI_PAGE, config.multipage))
        },
        render: h => h(App)
    }).$mount('#app')
}