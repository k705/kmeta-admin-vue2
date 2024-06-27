import request from '@/utils/request'


export function reqDebitCardRecommendedList() {
  return request({
    url: '/recommend/pageList',
    method: 'get'
  })
}

export function reqUpdateDebitCardRecommended(data) {
  return request({
    url: '/recommend/updateGoods',
    method: 'post',
    data
  })
}


export function reqDeleteDebitCardRecommended(data) {
  return request({
    url: '/recommend/delete',
    method: 'post',
    data
  })
}

export function reqDddDebitCardRecommended(data) {
  return request({
    url: '/recommend/addGoods',
    method: 'post',
    data
  })
}


export function reqSelectDebitCard(enterpriseId) {
  return request({
    url: `/recommend/getGoodsSelectByEnterprise?enterpriseId=${enterpriseId}`,
    method: 'get',

  })
}

export function reqSelectEnterprise() {
  return request({
    url: '/recommend/getSelectEnterprise',
    method: 'get'
  })
}


