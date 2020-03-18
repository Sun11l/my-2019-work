import {
  getPlaybookLists,
  runPlaybook,
  deletePlaybook,

} from '@/api/common/playbooks'
const state = {}

const mutations = {}

const actions = {
  getPlaybookLists ({commit}, params) {
    return new Promise((resolve, reject) => {
      getPlaybookLists(params).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  runPlaybook ({commit}, {id, data}) {
    return new Promise((resolve, reject) => {
      runPlaybook(id, data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  deletePlaybook ({commit}, {id, data}) {
    return new Promise((resolve, reject) => {
      deletePlaybook(id, data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
