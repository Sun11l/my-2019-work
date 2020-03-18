import { getDashboardStatistics, getDashboardTrend } from '@/api/common/dashboard'


const actions = {
  getDashboardStatistics () {
    return new Promise((resolve, reject) => {
      getDashboardStatistics().then(res => {
        resolve(res)
      })
    })
  },
  getDashboardTrend ({commit}, data) {
    return new Promise((resolve, reject) => {
      getDashboardTrend(data).then(res => {
        resolve(res)
      })
    })
  }
}

export default {
  namespaced: true,
  actions
}
