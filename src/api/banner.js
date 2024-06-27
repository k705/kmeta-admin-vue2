import request from '@/utils/request'

// banner列表
export function reqGetBannerList(param) {
  return request({
    url: '/banner/pageList?' + param,
    method: 'get',
  })
}

export function reqGetWorldBannerList(param) {
  return request({
    url: '/banner/worldPageList?' + param,
    method: 'get',
  })
}

// 添加banner
export function reqAddBanner(data) {
  return request({
    url: '/banner/add',
    method: 'post',
    data

  })
}

// 修改banner
export function reqUpdateBanner(data) {
  return request({
    url: '/banner/update',
    method: 'post',
    data
  })
}

// 上架banner
export function reqBannerShelf(data) {
  return request({
    url: '/banner/shelf',
    method: 'post',
    data
  })
}

// 下架banner
export function reqBannerDelist(data) {
  return request({
    url: '/banner/delist',
    method: 'post',
    data
  })
}

// 删除banner
export function reqDeleteBanner(data) {
  return request({
    url: '/banner/delete',
    method: 'post',
    data
  })
}
