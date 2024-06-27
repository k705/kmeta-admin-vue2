import request from '@/utils/request'



/**
 *
 * @returns 奖品
 */

// 奖品列表
export function reqActivityPrizeList(activityDrawId) {
  return request({
    url: `/activityDraw/prizeList?activityDrawId=${activityDrawId}`,
    method: 'get',
  })
}

// 添加奖品
export function reqActivityPrize(data) {
  return request({
    url: '/activityDraw/addPrize',
    method: 'post',
    data
  })
}

// 删除奖品
export function reqActivityDelPrize(data) {
  return request({
    url: '/activityDraw/delPrize',
    method: 'post',
    data
  })
}

/**
 *
 * @returns 活动
 */

// 活动列表
export function reqActivityList(param) {
  return request({
    url: '/activityDraw/pageList?' + param,
    method: 'get',
  })
}

// 添加活动
export function reqActivityCreate(data) {
  return request({
    url: '/activityDraw/create',
    method: 'post',
    data
  })
}

// 删除活动
export function reqActivityDel(data) {
  return request({
    url: '/activityDraw/delete',
    method: 'post',
    data
  })
}

// 修改活动
export function reqActivityUpdate(data) {
  return request({
    url: '/activityDraw/update',
    method: 'post',
    data
  })
}

// 发布活动
export function reqActivityPublish(data) {
  return request({
    url: '/activityDraw/publish',
    method: 'post',
    data
  })
}

// 撤销活动
export function reqActivityRevoke(data) {
  return request({
    url: '/activityDraw/revoke',
    method: 'post',
    data
  })
}

// 设置奖品
export function reqSetPrize(data) {
  return request({
    url: '/activityDraw/setPrize',
    method: 'post',
    data
  })
}
