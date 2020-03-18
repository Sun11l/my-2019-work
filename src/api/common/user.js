import request from '@/utils/httpRequest'
import API from '@/api'

export function login (data) {
  return request({
    url: API.USER_LOGIN,
    method: 'post',
    data
  })
}

export function getPermission () {
  return request({
    url: API.USER_PERMISSION,
    method: 'get',
  })
}

export function getInfo () {
  return request({
    url: API.CONFIG_USER_INFO,
    method: 'get',
  })
}

export function logout () {
  return request({
    url: API.USER_LOGOUT,
    method: 'get'
  })
}

export function refreshToken (token) {
  return request({
    url: API.USER_REFRESH_TOKEN,
    method: 'post',
    data: {
      token
    }
  })
}

export function getBellLog () {
  return request({
    url: API.BELL_LOG,
    method: 'get',
  })
}

export function deleteBellLog (id) {
  return request({
    url: API.BELL_LOG + id + '/',
    method: 'delete',
  })
}
