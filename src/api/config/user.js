import request from '@/utils/httpRequest'
import API from '@/api'

export function getInfo () {
  return request({
    url: API.CONFIG_USER_INFO,
    method: 'get',
  })
}

export function getOnlineList () {
  return request({
    url: API.CONFIG_USER_ONLINE,
    method: 'get'
  })
}

export function getUserList (params) {
  return request({
    url: API.CONFIG_USER_LIST,
    method: 'get',
    params
  })
}

export function getRole () {
  return request({
    url: API.CONFIG_USER_ROLE,
    method: 'get'
  })
}

export function getRolePermission (params) {
  return request({
    url: API.CONFIG_USER_PERMISSON,
    method: 'get',
    params
  })
}

export function changeRolePermission (id, data) {
  return request({
    url: API.CONFIG_USER_PERMISSON + id + '/',
    method: 'put',
    data
  })
}

export function addUser (data) {
  return request({
    url: API.CONFIG_USER_OPERATION,
    method: 'post',
    data
  })
}

export function updateUser (id, data) {
  return request({
    url: API.CONFIG_USER_OPERATION + id + '/',
    method: 'put',
    data
  })
}

export function forbidUser (id, data) {
  return request({
    url: API.CONFIG_USER_FORBID + id + '/',
    method: 'put',
    data
  })
}

export function deleteUser (id) {
  return request({
    url: API.CONFIG_USER_OPERATION + id + '/',
    method: 'delete',
  })
}

export function changePassword (data) {
  return request({
    url: API.CONFIG_USER_PASSWORD,
    method: 'post',
    data
  })
}

export function getPermisson (data) {
  return request({
    url: API.CONFIG_USER_PERMISSON,
    method: 'get'
  })
}

export function getActionLog (params) {
  return request({
    url: API.CONFIG_USER_ACTIONLOG,
    method: 'get',
    params
  })
}

export function getLoginLog (params) {
  return request({
    url: API.CONFIG_USER_LOGINLOG,
    method: 'get',
    params
  })
}

export function ADSearch (data) {
  return request({
    url: API.CONFIG_USER_AD,
    method: 'post',
    data
  })
}

export function getLdap () {
  return request({
    url: API.CONFIG_USER_LADP,
    method: 'get'
  })
}

export function setLdap (data) {
  return request({
    url: API.CONFIG_USER_LADP,
    method: 'put',
    data
  })
}
