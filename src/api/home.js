import request from '@/utils/request'



/**
 *
 * @returns 判断首页状态
 */

// 判断首页状态
export function reqGetApplyState() {
  return request({
    url: '/brand/getApplyState',
    method: 'get',

  })
}

