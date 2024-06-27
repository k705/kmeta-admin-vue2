import request from '@/utils/request'

export function reqGetScore() {
  return request({
    url: '/score/getScore',
    method: 'get',
    // data
  })
}

export function reqGetAllSelectEnterprise(containPlatform) {
  return request({
    url: '/brand/getAllSelectEnterprise?containPlatform=' + containPlatform,
    method: 'get',
  })
}

export function reqGetSelectStar(enterpriseId) {
  return request({
    url: '/star/getSelectStar?enterpriseId=' + enterpriseId,
    method: 'get',
  })
}

export function reqAllocation(data) {
  return request({
    url: '/score/allocation',
    method: 'post',
    data
  })
}

export function reqRecharge(data) {
  return request({
    url: '/score/recharge',
    method: 'post',
    data
  })
}

export function reqScoreRechargeRecord(param) {
  return request({
    url: '/score/rechargeRecord?' + param,
    method: 'get',
  })
}

export function reqAllocationEnterpriseRecord(param) {
  return request({
    url: `/score/allocationEnterpriseRecord?` + param,
    method: 'get'
  })
}

export function reqAllocationStarRecord(param) {
  return request({
    url: `/score/allocationStarRecord?` + param,
    method: 'get'
  })
}


