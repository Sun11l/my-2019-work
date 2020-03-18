import request from '@/utils/httpRequest'
import API from '@/api'

export function getDashboardStatistics () {
  return request({
    url: API.DASHBOARD_STATISTICS,
    method: 'get',
  })
}

export function getDashboardTrend (data) {
  return request({
    url: API.DASHBOARD_TREND,
    method: 'post',
    data
  })
}
