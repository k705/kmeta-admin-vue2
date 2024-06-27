import request from '@/utils/request'




export function reqCheck(data) {
  return request({
    url: '/approval/approve',
    method: 'post',
    data
  })
}



export function reqStarCheckList() {
  return request({
    url: '/star/findStarWaitApproval',
    method: 'get',

  })
}


export function reqBrandCheckList() {
  return request({
    url: '/brand/findWaitApproval',
    method: 'get',

  })
}

export function reqStarApprove(data) {
  return request({
    url: '/approval/starApprove',
    method: 'post',
    data
  })
}

