import request from '@/utils/request'



export function reqActivateEmail(data) {
  return request({
    url: '/fast/activateEmail',
    method: 'post',
    data
  })
}



export function reqSendEmailVerify(data) {
  return request({
    url: '/fast/sendEmailVerify',
    method: 'post',
    data
  })
}
