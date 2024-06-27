import request from '@/utils/request'

// 列表数据
export function reqGetBlockPrizeList(param) {
  return request({
    url: '/blockPrize/pageList?' + param,
    method: 'get',
  })
}

// 添加
export function reqAddBlockPrize(data) {
  return request({
    url: '/blockPrize/add',
    method: 'post',
    data

  })
}

// 修改
export function reqUpdateBlockPrize(data) {
  return request({
    url: '/blockPrize/update',
    method: 'post',
    data
  })
}

// 发布
export function reqPublishBlockPrize(data) {
  return request({
    url: '/blockPrize/publish',
    method: 'post',
    data
  })
}

// 撤销
export function reqRevokeBlockPrize(data) {
  return request({
    url: '/blockPrize/revoke',
    method: 'post',
    data
  })
}

// 删除
export function reqDeleteBlockPrize(data) {
  return request({
    url: '/blockPrize/delete',
    method: 'post',
    data
  })
}

export function reqUploadUsedCode(data) {
  return request({
    url: '/blockPrize/uploadUsedCode',
    method: 'post',
    data
  })
}

// 开奖信息
export function reqLotteryInfo(blockPrizeId) {
  return request({
    url: '/blockPrize/lotteryInfo?blockPrizeId=' + blockPrizeId,
    method: 'get',
  })
}

// 中奖名单
export function reqWinningList(blockPrizeId) {
  return request({
    url: '/blockPrize/winningList?blockPrizeId=' + blockPrizeId,
    method: 'get',
  })
}

export function reqSetBlockWaybillNo(data) {
  return request({
    url: '/blockPrize/setBlockWaybillNo',
    method: 'post',
    data
  })
}
