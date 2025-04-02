import { axios } from '@/utils/request'


// 获取组织机构列表
export function getQueryPageList(params) {
  return axios({
    url: '/sys/sysDepart/getDepartByParams?pageNo='+params.pageNo+'&pageSize='+params.pageSize,
    method: 'post',
    data:params
  })
}

// 获取组织机构列表
export function getQueryPages(params) {
  return axios({
    url: '/sys/sysDepart/getDepartByParams',
    method: 'post',
    data:params
  })
}

// 添加组织机构
export function addDepart(params) {
  return axios({
    url: '/sys/sysDepart/add',
    method: 'post',
    data:params
  })
}

// 修改组织机构
export function editDepart(params) {
  return axios({
    url: '/sys/sysDepart/edit',
    method: 'put',
    data:params
  })
}

// 删除组织机构
export function deleteDepart(params) {
  return axios({
    url: '/sys/sysDepart/delete?id='+params.id,
    method: 'delete'
  })
}