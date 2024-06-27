import request from '@/utils/request'

export function reqGetAdColumnList(param) {
  return request({
    url: '/worldAd/adColumnPageList?' + param,
    method: 'get',
  })
}


export function reqAddAdColumn(data) {
  return request({
    url: '/worldAd/addAdColumn',
    method: 'post',
    data

  })
}

export function reqUpdateAdColumn(data) {
  return request({
    url: '/worldAd/updateAdColumn',
    method: 'post',
    data
  })
}

export function reqDeleteAdColumn(data) {
  return request({
    url: '/worldAd/deleteAdColumn',
    method: 'post',
    data
  })
}

export function reqGetAdList(param) {
  return request({
    url: '/worldAd/adPageList?' + param,
    method: 'get',
  })
}


export function reqAddAd(data) {
  return request({
    url: '/worldAd/addAd',
    method: 'post',
    data

  })
}

export function reqUpdateAd(data) {
  return request({
    url: '/worldAd/updateAd',
    method: 'post',
    data
  })
}

export function reqPublishAd(data) {
  return request({
    url: '/worldAd/publishAd',
    method: 'post',
    data
  })
}

export function reqDeleteAd(data) {
  return request({
    url: '/worldAd/deleteAd',
    method: 'post',
    data
  })
}
