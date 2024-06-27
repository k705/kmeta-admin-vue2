import request from '@/utils/request'

// K星配置
export function reqGetStarConfig() {
  return request({
    url: '/config/star/get',
    method: 'get',
  })
}

// 更新K星配置
export function reqSetStarConfig(data) {
  return request({
    url: '/config/star/set',
    method: 'post',
    data
  })
}

// APP审核开关配置
export function reqGetAuditSwitchConfig() {
  return request({
    url: '/config/auditSwitch/get',
    method: 'get',
  })
}

// 更新APP审核开关配置
export function reqSetAuditSwitchConfig(data) {
  return request({
    url: '/config/auditSwitch/set',
    method: 'post',
    data
  })
}

// APP审核开关配置
export function reqGetInviteConfig() {
  return request({
    url: '/config/inviteConfig/get',
    method: 'get',
  })
}

// 更新APP审核开关配置
export function reqSetInviteConfig(data) {
  return request({
    url: '/config/inviteConfig/set',
    method: 'post',
    data
  })
}

export function reqGetSpendSuggest() {
  return request({
    url: '/config/spendSuggest/get',
    method: 'get',
  })
}

// 更新APP审核开关配置
export function reqSetSpendSuggest(param) {
  return request({
    url: '/config/spendSuggest/set?' + param,
    method: 'post'
  })
}
