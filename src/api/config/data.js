import request from '@/utils/httpRequest'
import API from '@/api'

export function getDataConfig (params) {
  return request({
    url: API.CONFIG_DATA_CEF,
    method: 'get',
    params
  })
}

export function getArtifacts (id) {
  return request({
    url: API.CONFIG_DATA_ARTIFACTS,
    method: 'get',
  })
}

export function addDataConfig (data) {
  return request({
    url: API.CONFIG_DATA_CEF,
    method: 'post',
    data
  })
}

export function getDataConfigIndex (data) {
  return request({
    url: API.CONFIG_DATA_CEF_INDEX,
    method: 'post',
    data
  })
}

export function updateDataConfig (id, data) {
  return request({
    url: API.CONFIG_DATA_CEF + id + '/',
    method: 'put',
    data
  })
}

export function deleteDataConfig (id) {
  return request({
    url: API.CONFIG_DATA_CEF + id + '/',
    method: 'delete',
  })
}

export function getWarnRulesList (params) {
  return request({
    url: API.CONFIG_DATA_WARNRULES,
    method: 'get',
    params
  })
}

export function addWarnRulesList (data) {
  return request({
    url: API.CONFIG_DATA_WARNRULES,
    method: 'post',
    data
  })
}

export function updateWarnRulesList (id, data) {
  return request({
    url: API.CONFIG_DATA_WARNRULES + id + '/',
    method: 'put',
    data
  })
}

export function deleteWarnRulesList (id) {
  return request({
    url: API.CONFIG_DATA_WARNRULES + id + '/',
    method: 'delete',
  })
}

export function getCefFieldLists () {
  return request({
    url: API.CONFIG_DATA_CEF_FIELD,
    method: 'get',
  })
}

export function addCefField (data) {
  return request({
    url: API.CONFIG_DATA_CEF_FIELD,
    method: 'post',
    data
  })
}
