import request from '@/utils/request'

// 任务列表
export function reqGetPersonnelCodeList(param) {
  return request({
    url: '/promotionCode/pageList?' + param,
    method: 'get',
  })
}

export function reqGetDataSummary(param) {
  return request({
    url: '/promotionCode/dataSummary?' + param,
    method: 'get'
  })
}

// 修改任务
export function reqImportUsedCode(data) {
  return request({
    url: '/promotionCode/importUsedCode',
    method: 'post',
    data
  })
}

export function reqExportSendRecord(param) {
  return request({
    url: '/promotionCode/exportSendRecord?' + param,
    method: 'get',
  })
}
