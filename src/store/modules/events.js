import {
  getCounts,
  getEventsList,
  addEvent,
  editEvent,
  getEventsDetail,
  deleteEvent,
  AddRelatedEvent,
  getActions,
  getActionApps,
  runAction,
  getPeriodTask,
  updatePeriodTask,
  deletePeriodTask,
  getPlaybooknodeIO,
  switcherPlaybook
} from '@/api/common/events'

const state = {}

const mutations = {}

const actions = {
  getCounts ({commit}) {
    return new Promise((resolve, reject) => {
      getCounts().then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getEventsList ({commit}, params) {
    return new Promise((resolve, reject) => {
      getEventsList(params).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  addEvent ({commit}, data) {
    return new Promise((resolve, reject) => {
      addEvent(data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  editEvent ({commit}, {id, data}) {
    return new Promise((resolve, reject) => {
      editEvent(id, data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getEventsDetail ({commit}, id) {
    return new Promise((resolve, reject) => {
      getEventsDetail(id).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteEvent ({commit}, id) {
    return new Promise((resolve, reject) => {
      deleteEvent(id).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  AddRelatedEvent ({commit}, data) {
    return new Promise((resolve, reject) => {
      AddRelatedEvent(data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getActionApps ({commit}) {
    return new Promise((resolve, reject) => {
      getActionApps().then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getActions ({commit}, id) {
    return new Promise((resolve, reject) => {
      getActions(id).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  runAction ({commit}, {id, data}) {
    return new Promise((resolve, reject) => {
      runAction(id, data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getPlaybooknodeIO ({commit}, {name, artifact, id}) {
    return new Promise((resolve, reject) => {
      getPlaybooknodeIO(name, artifact, id).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  switcherPlaybook ({commit}, {id, data}) {
    return new Promise((resolve, reject) => {
      switcherPlaybook(id, data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getPeriodTask ({commit}, {id, params}) {
    return new Promise((resolve, reject) => {
      getPeriodTask(id, params).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updatePeriodTask ({commit}, {id, data}) {
    return new Promise((resolve, reject) => {
      updatePeriodTask(id, data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deletePeriodTask ({commit}, id) {
    return new Promise((resolve, reject) => {
      deletePeriodTask(id).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
