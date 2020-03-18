import request from '@/utils/httpRequest'
import API from '@/api'

export function getPubkey () {
  return request({
    url: API.USER_PUBKEY,
    method: 'get'
  })
}
