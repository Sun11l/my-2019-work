import request from '@/utils/httpRequest'
import API from '@/api'

export function appUploadZip (data) {
  return request({
    url: API.CONFIG_APP_UPLOAD,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

export function downloadZip (id) {
  return request({
    url: API.CONFIG_APP_DOWNLOAD + id + '/',
    method: 'get',
    responseType: 'blob'
  })
}

export function getAppPlugins (params) {
  return request({
    url: API.CONFIG_APP_PLUGINS,
    method: 'get',
    params
  })
}

export function getAppPluginsInfo (id) {
  return request({
    url: API.CONFIG_APP_PLUGINS + id + '/',
    method: 'get'
  })
}

export function testAppPlugin (id) {
  return request({
    url: API.CONFIG_APP_TEST_PLUGINS + id + '/',
    method: 'put'
  })
}

export function saveAppPlugins ({id, data}) {
  return request({
    url: API.CONFIG_APP_PLUGINS + id + '/',
    method: 'put',
    data
  })
}

export function updateAppFiles ({id, data}) {
  return request({
    url: API.CONFIG_APP_UPDATE + id + '/',
    method: 'put',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

export function deleteAppPlugins (id) {
  return request({
    url: API.CONFIG_APP_PLUGINS + id + '/',
    method: 'delete'
  })
}
