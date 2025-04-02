import { axios } from '@/utils/request'


export function list(params) {
    return axios({
        url: '/mwBoxMaintain/mwBoxMaintain/list',
        method: "get",
        params: params
    })
}


export function add(data) {
    return axios({
        url: '/mwBoxMaintain/mwBoxMaintain/add',
        method: 'post',
        data: data
    })
}

export function del(id) {
    return axios({
        url: '/mwBoxMaintain/mwBoxMaintain/delete?id=' + id,
        method: 'delete',
    })
}