import { axios } from '@/utils/request'

export function list(params) {
    return axios({
        url: '/mwStagingPoint/mwStagingPoint/list',
        method: "get",
        params: params
    })
}


export function add(data) {
    return axios({
        url: '/mwStagingPoint/mwStagingPoint/add',
        method: 'post',
        data: data
    })
}

export function del(id) {
    return axios({
        url: '/mwStagingPoint/mwStagingPoint/delete?id=' + id,
        method: 'delete',
    })
}


export function edit(data) {
    return axios({
        url: '/mwStagingPoint/mwStagingPoint/edit',
        method: 'put',
        data: data
    })
}