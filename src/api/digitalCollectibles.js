import request from '@/utils/request'

export function reqGetNftSeries(param) {
  return request({
    url: '/digitalCollectibles/seriesList',
    method: 'get',
  })
}

// 添加
export function reqAddNftSeries(data) {
  return request({
    url: '/digitalCollectibles/addSeries',
    method: 'post',
    data

  })
}

// 修改
export function reqUpdateNftSeries(data) {
  return request({
    url: '/digitalCollectibles/updateSeries',
    method: 'post',
    data
  })
}

// 删除
export function reqDeleteNftSeries(data) {
  return request({
    url: '/digitalCollectibles/deleteSeries',
    method: 'post',
    data
  })
}

// 列表数据
export function reqGetDigitalCollectiblesList(param) {
  return request({
    url: '/digitalCollectibles/pageList?' + param,
    method: 'get',
  })
}

// 添加
export function reqAddDigitalCollectibles(data) {
  return request({
    url: '/digitalCollectibles/add',
    method: 'post',
    data

  })
}

// 修改
export function reqUpdateDigitalCollectibles(data) {
  return request({
    url: '/digitalCollectibles/update',
    method: 'post',
    data
  })
}

// 发布
export function reqPublishDigitalCollectibles(data) {
  return request({
    url: '/digitalCollectibles/publish',
    method: 'post',
    data
  })
}

// 撤销
export function reqRevokeDigitalCollectibles(data) {
  return request({
    url: '/digitalCollectibles/revoke',
    method: 'post',
    data
  })
}

// 删除
export function reqDeleteDigitalCollectibles(data) {
  return request({
    url: '/digitalCollectibles/delete',
    method: 'post',
    data
  })
}
