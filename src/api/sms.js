import request from '@/utils/request'



/**
 *
 * @returns 短信
 */

// 创建奖品
export function reqSendSms(data) {
  return request({
    url: '/sms/sendNotifySms',
    method: 'post',
    data
  })
}



