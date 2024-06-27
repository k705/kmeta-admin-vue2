import request from '@/utils/requestnotoken'



export function reqLargeScreenData(data) {
  return request({
    url: '/dataBoard/getLargeScreenData',
    method: 'post',
    data
  })
}


