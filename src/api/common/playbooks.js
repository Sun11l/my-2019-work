import request from '@/utils/httpRequest'
import API from '@/api'

export function getPlaybookLists (params) {
  return request({
    url: API.PLAYBOOK_LIST,
    method: 'get',
    params
  })
}

export function runPlaybook (id, data) {
  return request({
    url: API.PLAYBOOK_RUN_TASK + id + '/',
    method: 'put',
    data
  })
}

export function getPlaybookDetail (id, params) {
  return request({
    url: API.PLAYBOOK_DETAIL + id + '/',
    method: 'get',
    params
  })
}

export function deletePlaybook (id, data) {
  return request({
    url: API.PLAYBOOK_DELETE + id + '/',
    method: 'delete',
    data
  })
}
