import * as api from '@/api/api'  // 导入API模块
import { Modal } from "ant-design-vue"  // 导入Ant Design Vue的Modal组件
import { isURL } from '@/utils/validate'  // 导入URL验证工具
import onlineCommons from '@jeecg/antd-online-mini'  // 导入在线表单组件
import { initDictOptions } from '@/components/dict/JDictSelectUtil'  // 导入字典初始化工具

// 根据当前时间返回问候语
export function timeFix() {
    const time = new Date()
    const hour = time.getHours()
    return hour < 9 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour < 20 ? '下午好' : '晚上好')))
}

// 随机返回一条欢迎语
export function welcome() {
    const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
    let index = Math.floor((Math.random() * arr.length))
    return arr[index]
}

// 触发window的resize事件
export function triggerWindowResizeEvent() {
    let event = document.createEvent('HTMLEvents')
    event.initEvent('resize', true, true)
    event.eventType = 'message'
    window.dispatchEvent(event)
}

// 过滤对象中值为null、undefined或空字符串的属性
export function filterObj(obj) {
    if (!(typeof obj == 'object')) {
        return;
    }

    for (let key in obj) {
        if (obj.hasOwnProperty(key) &&
            (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
            delete obj[key];
        }
    }
    return obj;
}

// 格式化日期
export function formatDate(value, fmt) {
    let regPos = /^\d+(\.\d+)?$/;
    if (regPos.test(value)) {
        // 如果是数字
        let getDate = new Date(value);
        let o = {
            'M+': getDate.getMonth() + 1,
            'd+': getDate.getDate(),
            'h+': getDate.getHours(),
            'm+': getDate.getMinutes(),
            's+': getDate.getSeconds(),
            'q+': Math.floor((getDate.getMonth() + 3) / 3),
            'S': getDate.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (let k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt;
    } else {
        // 如果不是数字，直接截取字符串
        value = value.trim();
        return value.substr(0, fmt.length);
    }
}

// 生成首页路由
export function generateIndexRouter(data) {
    let indexRouter = [{
        path: '/',
        name: 'dashboard',
        component: resolve => require(['@/components/layouts/TabLayout'], resolve),
        meta: { title: '首页' },
        redirect: '/home',
        children: [
            ...generateChildRouters(data)
        ]
    }, {
        "path": "*",
        "redirect": "/404",
        "hidden": true
    }]
    return indexRouter;
}

// 生成嵌套路由（子路由）
function generateChildRouters(data) {
    const routers = [];
    for (let item of data) {
        let component = "";
        if (item.component.indexOf("layouts") >= 0) {
            component = "components/" + item.component;
        } else {
            component = "views/" + item.component;
        }

        // 处理URL中的占位符变量
        let URL = (item.meta.url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2))
        if (isURL(URL)) {
            item.meta.url = URL;
        }

        let componentPath
        if (item.component == "modules/online/cgform/OnlCgformHeadList") {
            componentPath = onlineCommons.OnlCgformHeadList
        } else if (item.component == "modules/online/cgform/OnlCgformCopyList") {
            componentPath = onlineCommons.OnlCgformCopyList
        } else if (item.component == "modules/online/cgform/auto/OnlCgformAutoList") {
            componentPath = onlineCommons.OnlCgformAutoList
        } else if (item.component == "modules/online/cgform/auto/OnlCgformTreeList") {
            componentPath = onlineCommons.OnlCgformTreeList
        } else if (item.component == "modules/online/cgform/auto/erp/OnlCgformErpList") {
            componentPath = onlineCommons.OnlCgformErpList
        } else if (item.component == "modules/online/cgform/auto/tab/OnlCgformTabList") {
            componentPath = onlineCommons.OnlCgformTabList
        } else if (item.component == "modules/online/cgform/auto/innerTable/OnlCgformInnerTableList") {
            componentPath = onlineCommons.OnlCgformInnerTableList
        } else if (item.component == "modules/online/cgreport/OnlCgreportHeadList") {
            componentPath = onlineCommons.OnlCgreportHeadList
        } else if (item.component == "modules/online/cgreport/auto/OnlCgreportAutoList") {
            componentPath = onlineCommons.OnlCgreportAutoList
        } else {
            componentPath = resolve => require(['@/' + component + '.vue'], resolve)
        }

        let menu = {
            path: item.path,
            name: item.name,
            redirect: item.redirect,
            component: componentPath,
            hidden: item.hidden,
            meta: {
                title: item.meta.title,
                icon: item.meta.icon,
                url: item.meta.url,
                permissionList: item.meta.permissionList,
                keepAlive: item.meta.keepAlive,
                internalOrExternal: item.meta.internalOrExternal,
                componentName: item.meta.componentName
            }
        }
        if (item.alwaysShow) {
            menu.alwaysShow = true;
            menu.redirect = menu.path;
        }
        if (item.children && item.children.length > 0) {
            menu.children = [...generateChildRouters(item.children)];
        }
        // 判断是否生成路由
        if (item.route && item.route === '0') {
            // 不生成路由
        } else {
            routers.push(menu);
        }
    }
    return routers
}

// 深度克隆对象或数组
export function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj))
}

// 随机生成数字
export function randomNumber() {
    const random = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    if (arguments.length === 1) {
        let [length] = arguments
        let nums = [...Array(length).keys()].map((i) => (i > 0 ? random(0, 9) : random(1, 9)))
        return parseInt(nums.join(''))
    } else if (arguments.length >= 2) {
        let [min, max] = arguments
        return random(min, max)
    } else {
        return Number.NaN
    }
}

// 随机生成字符串
export function randomString(length, chats) {
    if (!length) length = 1
    if (!chats) chats = '0123456789qwertyuioplkjhgfdsazxcvbnm'
    let str = ''
    for (let i = 0; i < length; i++) {
        let num = randomNumber(0, chats.length - 1)
        str += chats[num]
    }
    return str
}

// 随机生成UUID
export function randomUUID() {
    let chats = '0123456789abcdef'
    return randomString(32, chats)
}

// 下划线转驼峰
export function underLine2CamelCase(string) {
    return string.replace(/_([a-z])/g, function (all, letter) {
        return letter.toUpperCase();
    });
}

// 判断是否显示办理按钮
export function showDealBtn(bpmStatus) {
    if (bpmStatus != "1" && bpmStatus != "3" && bpmStatus != "4") {
        return true;
    }
    return false;
}

// 增强CSS，可以在页面上输出全局CSS
export function cssExpand(css, id) {
    let style = document.createElement('style')
    style.type = "text/css"
    style.innerHTML = `@charset "UTF-8"; ${css}`
    if (id) {
        let $style = document.getElementById(id)
        if ($style != null) $style.outerHTML = ''
        style.id = id
    }
    document.head.appendChild(style)
}

// 用于JS增强事件，运行JS代码，可以传参
export function jsExpand(options = {}) {
    let windowKeyName = 'J_CLICK_EVENT_OPTIONS'
    if (typeof window[windowKeyName] != 'object') {
        window[windowKeyName] = {}
    }

    let id = randomString(16, 'qwertyuioplkjhgfdsazxcvbnm'.toUpperCase())
    let code = `
    (function (o_${id}) {
      try {
        (function (globalEvent, vm) {
          ${options.jsCode}
        })(o_${id}.event, o_${id}.vm)
      } catch (e) {
        o_${id}.error(e)
      }
      o_${id}.done()
    })(window['${windowKeyName}']['EVENT_${id}'])
  `
    const script = document.createElement('script')
    window[windowKeyName]['EVENT_' + id] = {
        vm: options.vm,
        event: options.event,
        done() {
            script.outerHTML = ''
            delete window[windowKeyName]['EVENT_' + id]
        },
        error(e) {
            console.group(`${options.errorMessage || '用户自定义JS增强代码运行出错'}（${new Date()}）`)
            console.error(e)
            console.groupEnd()
        }
    }
    script.innerHTML = code
    document.body.appendChild(script)
}

// 重复值验证工具方法
export function validateDuplicateValue(tableName, fieldName, fieldVal, dataId, callback) {
    if (fieldVal) {
        let params = { tableName, fieldName, fieldVal, dataId }
        api.duplicateCheck(params).then(res => {
            res['success'] ? callback() : callback(res['message'])
        }).catch(err => {
            callback(err.message || err)
        })
    } else {
        callback()
    }
}

// 根据编码校验规则code，校验传入的值是否合法
export function validateCheckRule(ruleCode, value, callback) {
    if (ruleCode && value) {
        value = encodeURIComponent(value)
        api.checkRuleByCode({ ruleCode, value }).then(res => {
            res['success'] ? callback() : callback(res['message'])
        }).catch(err => {
            callback(err.message || err)
        })
    } else {
        callback()
    }
}

// 如果值不存在就push进数组，反之不处理
export function pushIfNotExist(array, value, key) {
    for (let item of array) {
        if (key && (item[key] === value[key])) {
            return false
        } else if (item === value) {
            return false
        }
    }
    array.push(value)
    return true
}

// 使promise无论如何都会resolve，除非传入的参数不是一个Promise对象或返回Promise对象的方法
export function alwaysResolve(promise) {
    return new Promise((resolve, reject) => {
        let p = promise
        if (typeof promise === 'function') {
            p = promise()
        }
        if (p instanceof Promise) {
            p.then(data => {
                resolve({ type: succeedSymbol, data })
            }).catch(error => {
                resolve({ type: failedSymbol, error })
            })
        } else {
            reject('alwaysResolve: 传入的参数不是一个Promise对象或返回Promise对象的方法')
        }
    })
}

// 简单实现防抖方法
export function simpleDebounce(fn, delay = 100) {
    let timer = null
    return function () {
        let args = arguments
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

// 不用正则的方式替换所有值
export function replaceAll(text, checker, replacer) {
    let lastText = text
    text = text.replace(checker, replacer)
    if (lastText !== text) {
        return replaceAll(text, checker, replacer)
    }
    return text
}

// 获取事件冒泡路径，兼容IE11，Edge，Chrome，Firefox，Safari
export function getEventPath(event) {
    let target = event.target
    let path = (event.composedPath && event.composedPath()) || event.path

    if (path != null) {
        return (path.indexOf(window) < 0) ? path.concat(window) : path
    }

    if (target === window) {
        return [window]
    }

    let getParents = (node, memo) => {
        memo = memo || []
        const parentNode = node.parentNode

        if (!parentNode) {
            return memo
        } else {
            return getParents(parentNode, memo.concat(parentNode))
        }
    }
    return [target].concat(getParents(target), window)
}

// 根据组件名获取父级
export function getVmParentByName(vm, name) {
    let parent = vm.$parent
    if (parent && parent.$options) {
        if (parent.$options.name === name) {
            return parent
        } else {
            let res = getVmParentByName(parent, name)
            if (res) {
                return res
            }
        }
    }
    return null
}

// 使一个值永远不会为（null | undefined）
export function neverNull(value, def) {
    return value == null ? (neverNull(def, '')) : value
}

// 根据元素值移除数组中的一个元素
export function removeArrayElement(array, prod, value) {
    let index = -1
    for (let i = 0; i < array.length; i++) {
        if (array[i][prod] == value) {
            index = i;
            break;
        }
    }
    if (index >= 0) {
        array.splice(index, 1);
    }
}

// 表格斑马纹
export const tableZebraStripe = (record, index) => {
    if (index % 2 !== 0) {
        return "odd-table-row";
    }
    return "";
}

// 加载数据字典
export const loadDictOptions = ({ dictCode = "" }) => {
    return new Promise(async (resolve, reject) => {
        initDictOptions(dictCode).then((res) => {
            if (res.success) {
                resolve(res.result)
            } else {
                console.group(`JVxeTable 查询字典(${dictCode})发生异常`)
                console.warn(res.message)
                resolve(new Array())
            }
        })
    })
}

// 接口扩展拦截器
export const responseInterceptor = ({ res = null }) => {
    return new Promise(async (resolve, reject) => {
        if (res.code == 200) {
            resolve(res);
        } else {
            Modal.error({
                mask: false,
                title: "错误提示",
                centered: true,
                content: (h) => {
                    return (
                        '<div style="color:red;" domPropsInnerHTML={res.message}></div>'
                    )
                },
                okText: "确定",
                onOk() {
                    resolve(false)
                },
            })
        }
    })
}

// 确认对话框
export const modalConfirm = ({ title = "提示", content = "" }) => {
    return new Promise(async (resolve, reject) => {
        Modal.confirm({
            mask: false,
            title,
            centered: true,
            content: (h) => {
                return (
                    '<div domPropsInnerHTML={content}></div>'
                )
            },
            onOk() {
                resolve(true)
            },
            onCancel() {
                resolve(false)
            },
        })
    })
}

// 信息提示
export const modalTips = ({ title = "", type = "error" }) => {
    return new Promise(async (resolve, reject) => {
        Modal[type]({
            mask: false,
            title: "提示",
            centered: true,
            content: (h) => {
                return (
                    '<div domPropsInnerHTML={title}></div>'
                )
            },
            onOk() {
                resolve(true)
            },
        })
    })
}

// 获取字典对应Title
export const getDictTitle = (val, list) => {
    let t = _.find(list, function (o) {
        return o.value == val
    })
    return t && t.title
}