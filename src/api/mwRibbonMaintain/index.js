import { axios } from '@/utils/request'
// 获取列表
export function RibbonList(params) {
  return axios({
    url: '/mwRibbonMaintain/mwRibbonMaintain/list',
    method: 'get',
    params
  })
}
// 删除
export function Ribbondelet(id) {
  return axios({
    url: '/mwRibbonMaintain/mwRibbonMaintain/delete?id='+id,
    method: 'delete',
  })
}
//新增
export function Ribbonadd(params) {
  return axios({
    url: '/mwRibbonMaintain/mwRibbonMaintain/add',
    method: 'post',
    data:params,
  })
}
//编辑
export function Ribbonedit(params) {
  return axios({
    url: '/mwRibbonMaintain/mwRibbonMaintain/edit',
    method: 'put',
    data:params,
  })
}
//查询
export function RibbonqueryById(params) {
  return axios({
    url: '/mwRibbonMaintain/mwRibbonMaintain/queryById',
    method: 'post',
    data:params,
  })
}
//下载
export function getdownFile(id){
  return axios({
    url: '/mwRibbonMaintain/mwRibbonMaintain/exportXls?id='+id,
    method:'get',
    responseType: 'blob'
  })
}
//完成打印
export function mwRibbonedit(id){
  return axios({
    url: '/mwRibbonMaintain/mwRibbonMaintain/edit',
    method:'put',
    data:{
      printState:1,
      id,
    },
  })
}

//查询医废流程
export function getYfList(params){
  return axios({
    url:'/mwProcessManagement/mwProcessManagement/list',
    method: 'get',
    params
  })
}

//查询医废箱流程
export function getYfBoxList(params){
  return axios({
    url:'/mwBoxMaintain/mwBoxMaintain/processList',
    method: 'get',
    params
  })
}

//查询饼图数据
export function getPieData(params){
  return axios({
    url:'/mwStatistics/mwStatistics/queryCollectStatistics',
    method: 'get',
    params
  })
}

//查询饼图数据
export function getBarData(params){
  return axios({
    url:'/mwStatistics/mwStatistics/queryDeptStatistics',
    method: 'get',
    params
  })
}

//查询医废箱内部的医废袋
export function getYfdFromBoxList(params){
  return axios({
    url:'/mwBoxMaintain/mwBoxMaintain/getRibbonByBoxCode',
    method: 'get',
    params
  })
}

//查询医废流程历史
export function getYfHistoryList(params){
  return axios({
    url:'/mwProcessDetails/mwProcessDetails/queryByProcessId?id='+params,
    method: 'get'
  })
}

//获取城镇列表
export function getTownInfoList(params){
  return axios({
    url:'/mwCity/getTownInfoList',
    method: 'get'
  })
}

//获取机构列表
export function getOrgList(params){
  return axios({
    url:'/sys/sysDepart/getOrgList?townId='+params,
    method: 'get'
  })
}