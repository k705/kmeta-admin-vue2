import request from '@/utils/request'

// 任务列表
export function reqGetPersonnelList(param) {
  return request({
    url: '/dataCollect/personnelList?' + param,
    method: 'get',
  })
}

// 添加任务
export function reqAddPersonnel(data) {
  return request({
    url: '/dataCollect/addPersonnel',
    method: 'post',
    data
  })
}

// 修改任务
export function reqUpdatePersonnel(data) {
  return request({
    url: '/dataCollect/updatePersonnel',
    method: 'post',
    data
  })
}


export function reqGenerateQrCode(id, effectiveHours) {
  return request({
    url: `/dataCollect/generateQrCode?id=${id}&effectiveHours=${effectiveHours}`,
    method: 'get',
  })
}

export function reqDeactivate(data) {
  return request({
    url: '/dataCollect/deactivate',
    method: 'post',
    data
  })
}

export function reqEnable(data) {
  return request({
    url: '/dataCollect/enable',
    method: 'post',
    data
  })
}

export function reqDelete(data) {
  return request({
    url: '/dataCollect/delete',
    method: 'post',
    data
  })
}
