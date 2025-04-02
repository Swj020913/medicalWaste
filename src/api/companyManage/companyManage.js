import { axios } from '@/utils/request'


// 添加组织机构
export function addCompany(params) {
  return axios({
    url: '/mwSinotransCompany/mwSinotransCompany/add',
    method: 'post',
    data:params
  })
}

// 修改组织机构
export function editCompany(params) {
  return axios({
    url: '/mwSinotransCompany/mwSinotransCompany/edit',
    method: 'put',
    data:params
  })
}
// 添加组织机构成员
export function addCompanyMember(params) {
  return axios({
    url: '/mwCompanyStaff/add',
    method: 'post',
    data:params
  })
}

// 修改组织机构成员
export function editCompanyMember(params) {
  return axios({
    url: '/mwCompanyStaff/edit',
    method: 'put',
    data:params
  })
}
// 修改督导考核
export function editSupervise(params) {
  return axios({
    url: '/mwSuperviseAssessment/mwSuperviseAssessment/edit',
    method: 'put',
    data:params
  })
}

export function addSupervise(params) {
  return axios({
    url: '/mwSuperviseAssessment/mwSuperviseAssessment/add',
    method: 'post',
    data:params
  })
}