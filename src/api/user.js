import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/fast/login',
    method: 'post',
    data
  })
}

export function authMenu() {
  return request({
    url: '/user/getRoutes',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/fast/logout',
    method: 'post'
  })
}
