import request from '@/utils/httpRequest'
import API from '@/api'

export function getLogsConfigIndices (params) {
  return request({
    url: API.CONFIG_LOG_INDICES,
    method: 'get',
    params
  })
}

export function getLogsConfigIndex (params) {
  return request({
    url: API.CONFIG_LOG_INDEX,
    method: 'get',
    params
  })
}

export function getLogsTimeField (data) {
  return request({
    url: API.CONFIG_LOG_TIMEFIELD,
    method: 'post',
    data
  })
}

export function getLogsManageIndices () {
  return request({
    url: API.CONFIG_LOG_INDICES,
    method: 'get',
  })
}

export function addLogsConfigIndex (data) {
  return request({
    url: API.CONFIG_LOG_INDEX,
    method: 'post',
    data
  })
}

export function editLogsConfigIndex (id, data) {
  return request({
    url: API.CONFIG_LOG_INDEX + id + '/',
    method: 'put',
    data
  })
}

export function deleteLogsConfigIndex (id) {
  return request({
    url: API.CONFIG_LOG_INDEX + id + '/',
    method: 'delete',
  })
}
