import request from '@/utils/request'

// 列表数据
export function reqGetMarketGoodsList(param) {
  return request({
    url: '/marketGoods/pageList?' + param,
    method: 'get',
  })
}

// 添加
export function reqAddMarketGoods(data) {
  return request({
    url: '/marketGoods/add',
    method: 'post',
    data

  })
}

// 修改
export function reqUpdateMarketGoods(data) {
  return request({
    url: '/marketGoods/update',
    method: 'post',
    data
  })
}

// 发布
export function reqPublishMarketGoods(data) {
  return request({
    url: '/marketGoods/publish',
    method: 'post',
    data
  })
}

// 撤销
export function reqRevokeMarketGoods(data) {
  return request({
    url: '/marketGoods/revoke',
    method: 'post',
    data
  })
}

// 删除
export function reqDeleteMarketGoods(data) {
  return request({
    url: '/marketGoods/delete',
    method: 'post',
    data
  })
}

export function reqGetEntityExchangeList(param) {
  return request({
    url: '/marketGoods/entityExchangeList?' + param,
    method: 'get',
  })
}

export function reqExportEntityExchangeList(goodsId) {
  return request({
    url: '/export/goods/entityExchangeList?goodsId=' + goodsId,
    method: 'get',
    responseType: 'blob'
  })
}
