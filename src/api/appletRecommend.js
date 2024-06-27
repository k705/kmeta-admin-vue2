import request from '@/utils/request'

export function reqGetAppletRecommendList(param) {
  return request({
    url: '/appletRecommend/pageList?' + param,
    method: 'get',
  })
}

export function reqAddAppletRecommend(data) {
  return request({
    url: '/appletRecommend/add',
    method: 'post',
    data

  })
}

export function reqUpdateAppletRecommend(data) {
  return request({
    url: '/appletRecommend/update',
    method: 'post',
    data
  })
}

export function reqDeleteAppletRecommend(data) {
  return request({
    url: 'appletRecommend/delete',
    method: 'post',
    data
  })
}
