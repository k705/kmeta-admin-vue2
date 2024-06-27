import request from '@/utils/request'



/**
 *
 * @returns 奖品
 */

// 奖品列表
export function reqPrizeList() {
  return request({
    url: '/prize/pageList',
    method: 'get',
  })
}

// 创建奖品
export function reqCreatePrize(data) {
  return request({
    url: '/prize/create',
    method: 'post',
    data
  })
}

// 删除奖品
export function reqDeletePrize(data) {
  return request({
    url: '/prize/delete',
    method: 'post',
    data
  })
}

// 修改奖品
export function reqUpdatePrize(data) {
  return request({
    url: '/prize/update',
    method: 'post',
    data
  })
}

// 可选择的奖品
export function reqSelectPrize(enterpriseId) {
  return request({
    url: `/prize/getPrizeSelectByEnterprise?enterpriseId=${enterpriseId}`,
    method: 'get',
  })
}


//  可选择的企业
export function reqSelectEnterprise() {
  return request({
    url: '/prize/getSelectEnterprise',
    method: 'get',
  })
}



