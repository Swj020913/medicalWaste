import { axios } from '@/utils/request'
// 获取列表
export function getQueryPageList(params) {
    return axios({
        url: '/sys/sysDepart/getDepartByParams?pageNo=' + params.pageNo + '&pageSize=' + params.pageSize,
        method: 'post',
        data: params
    })
}
//获取医院
export function getDepartByParams() {
    return axios({
        url: '/sys/sysDepart/getDepartByParams',
        method: 'post',
        data: {
            orgCategory: 1
        }
    })
}
//人员
export function getUserByParams(params) {
    return axios({
        url: '/sys/user/getUserByParams',
        method: 'get',
        params,
    })
}
//新增
export function getDepartadd(params) {
    return axios({
        url: '/sys/sysDepart/add',
        method: 'post',
        data: params
    })
}
//编辑
export function getDepartedit(params) {
    return axios({
        url: '/sys/sysDepart/edit',
        method: 'put',
        data: params
    })
}
// 删除
export function deleteDepart(params) {
    return axios({
        url: '/sys/sysDepart/delete?id=' + params.id,
        method: 'delete'
    })
}
//转运记录list
export function getTransportList(params) {
    return axios({
        url: '/mwTransferRecord/list',
        method: 'get',
        params
    })
}
//转运记录查询
export function getTransportDetails(params) {
    return axios({
        url: '/mwProcessManagement/mwProcessManagement/getTransportDetails',
        method: 'get',
        params
    })
}