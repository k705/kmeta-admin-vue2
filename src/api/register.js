import request from '@/utils/request'

export function reqRegister(data) {
  return request({
    url: '/fast/register',
    method: 'post',
    data
  })
}

export function reqEmailVerify(data) {
  return request({
    url: '/fast/sendEmailVerifyCode',
    method: 'post',
    data
  })
}

export function reqSmsVerifyCode(data) {
  return request({
    url: '/fast/sendSmsVerifyCode',
    method: 'post',
    data
  })
}
