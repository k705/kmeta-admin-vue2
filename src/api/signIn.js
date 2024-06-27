import request from '@/utils/request'

export function reqGetSignInConfig() {
  return request({
    url: '/config/signIn/get',
    method: 'get',
  })
}

export function reqSetSignInConfig(data) {
  return request({
    url: '/config/signIn/set',
    method: 'post',
    data
  })
}
