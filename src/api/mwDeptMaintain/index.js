import { axios } from '@/utils/request'
export function mwDeptMaintainlist (params) {
  return axios({
    url: '/mwDeptMaintain/mwDeptMaintain/list',
    method: 'get',
    params
  })
}
export function mwDeptdelete (id) {
  return axios({
    url: '/mwDeptMaintain/mwDeptMaintain/delete?id=' + id,
    method: 'delete'
  })
}
export function mwDeptadd (params) {
  return axios({
    url: '/mwDeptMaintain/mwDeptMaintain/add',
    method: 'post',
    data: params
  })
}
export function mwDeptedit (params) {
  return axios({
    url: '/mwDeptMaintain/mwDeptMaintain/edit',
    method: 'put',
    data: params
  })
}
export function mwDeptqueryById (params) {
  return axios({
    url: '/mwDeptMaintain/mwDeptMaintain/queryById',
    method: 'get',
    params
  })
}
export function mwDeptlistAll (params) {
  return axios({
    url: '/sys/sysDepart/getDepartmentList?orgCode='+(params==undefined?'':params),
    method: 'get',
  })
}
