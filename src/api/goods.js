import request from '@/utils/request'



/**
 *
 * @returns 计算卡系列
 */

// 结算卡系列管理（结算卡系列总览）
export function reqDebitCardSeriesList() {
  return request({
    url: '/goods/findSeries',
    method: 'get',

  })
}

// 添加结算卡系列
export function reqAddDebitCardSeries(data) {
  return request({
    url: '/goods/addSeries',
    method: 'post',
    data
  })
}

/**
 *
 * @returns 每个系列内计算卡
 */
// 添加结算卡（每张）
export function reqAddDebitCard(data) {
  return request({
    url: '/goods/addGoods',
    method: 'post',
    data
  })
}
// 结算卡(每个系列列表）管理（结算卡每个系列所有结算卡列表）
export function reqDebitCardList(seriesId) {
  return request({
    url: `/goods/findGoods?seriesId=${seriesId}`,
    method: 'get',

  })
}
// 添加结算卡（每张）
export function reqUpdateDebitCard(data) {
  return request({
    url: '/goods/updateGoods',
    method: 'post',
    data
  })
}


// 添加结算卡（每张）
export function reqDeleteDebitCard(data) {
  return request({
    url: '/goods/delGoods',
    method: 'post',
    data
  })
}

//上下架
export function reqDelist(data) {
  return request({
    url: '/goods/delist',
    method: 'post',
    data
  })
}

export function reqShelf(data) {
  return request({
    url: '/goods/shelf',
    method: 'post',
    data
  })
}
