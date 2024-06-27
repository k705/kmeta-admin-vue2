import request from '@/utils/request'

// 任务列表
export function reqGetProtocolInfo() {
  return request({
    url: '/agreement/get',
    method: 'get',
  })
}

// 更新协议
export function reqAgreementUpdate(data) {
  return request({
    url: '/agreement/update',
    method: 'post',
    data
  })
}
