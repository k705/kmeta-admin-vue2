import request from '@/utils/request'



export function reqCheck(data) {
  return request({
    url: '/approval/approve',
    method: 'post',
    data
  })
}

export function reqSubmitMaterial(data) {
  return request({
    url: '/brand/submitMaterial',
    method: 'post',
    data
  })
}


export function reqUpload(data) {
  return request({
    url: '/file/upload',
    method: 'post',
    data
  })
}

export function reqGetMaterial() {
  return request({
    url: '/brand/getMaterial',
    method: 'get',

  })
}


