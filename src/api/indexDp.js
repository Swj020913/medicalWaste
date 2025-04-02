import { axios } from '@/utils/request'

//油罐信息
export function getbigscreen(params){
  return axios({
    url: '/bigscreen/templat/getOilData',
    method: 'get',
    params,
  })
}
//库房档案
export function getWarehouseFile(params){
  return axios({
    url: '/bigscreen/templat/getWarehouseFile',
    method: 'get',
    params,
  })
}

//视频监控
export function getVideoData(mapType){
  return axios({
    url: '/bigscreen/templat/getVideoData?mapType=' + mapType,
    method: 'get',
  })
}

//获取硬盘录像机信息
export function getVedioConfig(){
  return axios({
    url: '/monitor/jyMonitor/getVedioConfig',
    method: 'get',
  })
}

//获取抓拍文件名
export function getFileName(){
  return axios({
    url: '/sys/common/getFileName',
    method: 'get',
  })
}