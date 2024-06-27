import request from '@/utils/request'

// 任务列表
export function reqGetTaskList(param) {
  return request({
    url: '/task/pageList?' + param,
    method: 'get',
  })
}

// 添加任务
export function reqAddTask(data) {
  return request({
    url: '/task/add',
    method: 'post',
    data

  })
}

// 修改任务
export function reqUpdateTask(data) {
  return request({
    url: '/task/update',
    method: 'post',
    data
  })
}

// 删除任务
export function reqDeleteTask(data) {
  return request({
    url: '/task/delete',
    method: 'post',
    data
  })
}
