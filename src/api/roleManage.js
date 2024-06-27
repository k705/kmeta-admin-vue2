import request from '@/utils/request'


export function reqAddRole(data) {
  return request({
    url: '/role/add',
    method: 'post',
    data
  })
}

export function reqRoleList() {
  return request({
    url: '/role/pageList',
    method: 'get'
  })
}

export function reqUpdateRole(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data
  })
}

export function reqDeleteRole(data) {
  return request({
    url: '/role/delete',
    method: 'post',
    data
  })
}



export function reqRolePermission(roleId) {
  return request({
    url: `/role/getRolePermission?roleId=${roleId}`,
    method: 'get'
  })
}

export function reqRoleDistribute(data) {
  return request({
    url: '/role/distributePermission',
    method: 'post',
    data
  })
}
