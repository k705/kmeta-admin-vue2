import request from '@/utils/request'

// K分配置
export function reqGetScoreConfig() {
  return request({
    url: '/config/score/get',
    method: 'get',
  })
}

// 更新K分配置
export function reqSetScoreConfig(data) {
  return request({
    url: '/config/score/set',
    method: 'post',
    data
  })
}
