import request from '@/utils/request'

export function reqStarList(param) {
  return request({
    url: '/star/pageList?' + param,
    method: 'get',
    // data
  })
}

export function reqShowStarAvatar(data) {
  return request({
    url: '/star/showStarAvatar',
    method: 'post',
    data
  })
}

export function reqGetStarOre(starId) {
  return request({
    url: '/star/getStarOre?starId=' + starId,
    method: 'get',
    // data
  })
}

export function reqUpdateStar(data) {
  return request({
    url: '/star/updateStar',
    method: 'post',
    data
  })
}

export function reqSetOre(data) {
  return request({
    url: '/star/setOre',
    method: 'post',
    data
  })
}

export function reqBatchSetOre(data) {
  return request({
    url: '/star/batchSetOre',
    method: 'post',
    data
  })
}

export function online(data) {
  return request({
    url: '/star/online',
    method: 'post',
    data
  })
}

export function offShelf(data) {
  return request({
    url: '/star/offShelf',
    method: 'post',
    data
  })
}

