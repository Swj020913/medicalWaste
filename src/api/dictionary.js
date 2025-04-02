import { axios } from '@/utils/request'


// 获取数据字典
export function getDictionary(dicCode) {
  return axios({
    url: '/sys/common/getDescription?dicCode='+dicCode,
    method: 'get',
  })
}
//获取油罐信息
export function getGYOilName() {
  return axios({
    url: '/oilFile/jyOilFile/getGYOilName',
    method: 'get',
  })
}
//获取油罐档案的油品名称
export function getOilName() {
  return axios({
    url: '/oilFile/jyOilFile/getOilName',
    method: 'get',
  })
}

//获取油罐信息
export function getOilInfo() {
  return axios({
    url: '/oilFile/jyOilFile/getOilInfo',
    method: 'get',
  })
}

export function getZBCount() {
  return axios({
    url: '/sbqcgl/jySbqcgl/getZBCount',
    method: 'get',
  })
}
export function getZBCNum() {
  return axios({
    url: '/sbqcgl/jySbqcgl/getZBCNum',
    method: 'get',
  })
}