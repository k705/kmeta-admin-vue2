import request from '@/utils/request'


export function reqUserList() {
  return request({
    url: '/user/pageList',
    method: 'get'
  })
}

export function reqUpdateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function reqAddUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function reqRoleSelect() {
  return request({
    url: '/role/select',
    method: 'get'
  })
}

export function reqDeleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}
