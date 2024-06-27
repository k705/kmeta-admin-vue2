import request from '@/utils/request'

export function reqGetPropList(param) {
  return request({
    url: '/prop/pageList?' + param,
    method: 'get',
  })
}

export function reqAddProp(data) {
  return request({
    url: '/prop/add',
    method: 'post',
    data

  })
}

export function reqUpdateProp(data) {
  return request({
    url: '/prop/update',
    method: 'post',
    data
  })
}

export function reqDeleteProp(data) {
  return request({
    url: 'prop/delete',
    method: 'post',
    data
  })
}

export function reqPublishProp(data) {
  return request({
    url: 'prop/publish',
    method: 'post',
    data
  })
}
