import request from '@/utils/request'

// 版本列表
export function reqGetVersionList(param) {
  return request({
    url: '/appVersion/pageList?' + param,
    method: 'get',
  })
}

// 添加版本
export function reqAddVersion(data) {
  return request({
    url: '/appVersion/add',
    method: 'post',
    data

  })
}

// 修改版本
export function reqUpdateVersion(data) {
  return request({
    url: '/appVersion/update',
    method: 'post',
    data
  })
}

// 删除版本
export function reqDeleteVersion(data) {
  return request({
    url: '/appVersion/delete',
    method: 'post',
    data
  })
}

// 发布版本
export function reqPublishVersion(data) {
  return request({
    url: '/appVersion/publish',
    method: 'post',
    data
  })
}

// 撤销版本
export function reqRevokeVersion(data) {
  return request({
    url: '/appVersion/revoke',
    method: 'post',
    data
  })
}
