import request from '@/utils/request'

// 刷新cdn缓存
export function reqCdnRefreshObjectCaches(param) {
  return request({
    url: '/file/cdnRefreshObjectCaches?dir=' + param,
    method: 'post'
  })
}
