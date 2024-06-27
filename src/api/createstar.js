

import request from '@/utils/request'

export function reqCreateStar(data) {
  return request({
    url: '/star/create',
    method: 'post',
    data
  })
}


