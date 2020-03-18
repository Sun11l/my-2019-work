import { getCookie } from '@/api/common/auth'
import {
  getInfo,
  getOnlineList,
  getUserList,
  updateUser,
  forbidUser,
  deleteUser,
  addUser,
  ADSearch,
  changePassword,
  getActionLog,
  getLoginLog,
  getLdap,
  setLdap,
  getRole,
  getPermisson,
  getRolePermission,
  changeRolePermission
} from '@/api/config/user'

import {
  getDataConfig,
  addDataConfig,
  getCefFieldLists,
  addCefField,
  getArtifacts,
  getDataConfigIndex,
  updateDataConfig,
  deleteDataConfig,
  getWarnRulesList,
  addWarnRulesList,
  updateWarnRulesList,
  deleteWarnRulesList
} from '@/api/config/data'

import {
  getAppPlugins,
  appUploadZip,
  downloadZip,
  getAppPluginsInfo,
  testAppPlugin,
  updateAppFiles,
  saveAppPlugins,
  deleteAppPlugins,
} from '@/api/config/app'

import {
  getLogsConfigIndices,
  getLogsTimeField,
  getLogsManageIndices,
  addLogsConfigIndex,
  getLogsConfigIndex,
  editLogsConfigIndex,
  deleteLogsConfigIndex
} from '@/api/config/logs'

const state = {
  token: getCookie('token'),
  roles: '',
  permissionlist: []
}

const mutations = {
  SET_INFO: (state, info) => {
    state.userInfo = info
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSON_LIST: (state, list) => {
    state.permissionlist = list
  }
}

const actions = {
  getInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          reject(new Error('error'))
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getOnlineList ({ commit }) {
    return new Promise((resolve, reject) => {
      getOnlineList().then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getUserList ({ commit }, params) {
    return new Promise((resolve, reject) => {
      getUserList(params).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateUserList ({commit}, {id, data}) {
    return new Promise((resolve, reject) => {
      updateUser(id, data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  forbidUser ({commit}, {id, data}) {
    return new Promise((resolve, reject) => {
      forbidUser(id, data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  addUser ({commit}, data) {
    return new Promise((resolve, reject) => {
      addUser(data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  deleteUser ({commit}, id) {
    return new Promise((resolve, reject) => {
      deleteUser(id).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  changePassword ({commit}, data) {
    return new Promise((resolve, reject) => {
      changePassword(data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getLoginLog ({ commit }, params) {
    return new Promise((resolve, reject) => {
      getLoginLog(params).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getActionLog ({ commit }, params) {
    return new Promise((resolve, reject) => {
      getActionLog(params).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getLdapConfig ({ commit }) {
    return new Promise((resolve, reject) => {
      getLdap().then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  setLdapConfig ({ commit }, data) {
    return new Promise((resolve, reject) => {
      setLdap(data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  ADSearch ({ commit }, data) {
    return new Promise((resolve, reject) => {
      ADSearch(data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getRoles ({ commit }) {
    return new Promise((resolve, reject) => {
      getRole().then(res => {
        commit('SET_ROLES', res.data)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getPermisson ({ commit }) {
    return new Promise((resolve, reject) => {
      getPermisson().then(res => {
        const { data } = res
        commit('SET_PERMISSON_LIST', data.results)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getRolePermission ({commit}, params) {
    return new Promise((resolve, reject) => {
      getRolePermission(params).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  changeRolePermission ({commit}, {id, data}) {
    return new Promise((resolve, reject) => {
      changeRolePermission(id, data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getAppPlugins ({ commit }, params) {
    return new Promise((resolve, reject) => {
      getAppPlugins(params).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  appUploadZip ({ commit }, file) {
    return new Promise((resolve, reject) => {
      appUploadZip(file).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getAppPluginsInfo ({ commit }, id) {
    return new Promise((resolve, reject) => {
      getAppPluginsInfo(id).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  testAppPlugin ({commit}, id) {
    return new Promise((resolve, reject) => {
      testAppPlugin(id).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  saveAppPlugins ({ commit }, file) {
    return new Promise((resolve, reject) => {
      saveAppPlugins(file).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateAppFiles ({ commit }, file) {
    return new Promise((resolve, reject) => {
      updateAppFiles(file).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  downloadZip ({commit}, id) {
    return new Promise((resolve, reject) => {
      downloadZip(id).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteAppPlugins ({ commit }, id) {
    return new Promise((resolve, reject) => {
      deleteAppPlugins(id).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getArtifacts ({ commit }) {
    return new Promise((resolve, reject) => {
      getArtifacts().then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getDataConfig ({ commit }, params) {
    return new Promise((resolve, reject) => {
      getDataConfig(params).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  addDataConfig ({ commit }, data) {
    return new Promise((resolve, reject) => {
      addDataConfig(data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getDataConfigIndex ({ commit }, index) {
    return new Promise((resolve, reject) => {
      getDataConfigIndex(index).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateDataConfig ({ commit }, { id, data }) {
    return new Promise((resolve, reject) => {
      updateDataConfig(id, data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteDataConfig ({ commit }, id) {
    return new Promise((resolve, reject) => {
      deleteDataConfig(id).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getWarnRulesList ({ commit }, params) {
    return new Promise((resolve, reject) => {
      getWarnRulesList(params).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  addWarnRulesList ({ commit }, data) {
    return new Promise((resolve, reject) => {
      addWarnRulesList(data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateWarnRulesList ({ commit }, { id, data }) {
    return new Promise((resolve, reject) => {
      updateWarnRulesList(id, data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteWarnRulesList ({ commit }, id) {
    return new Promise((resolve, reject) => {
      deleteWarnRulesList(id).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getLogsConfigIndices ({commit}, params) {
    return new Promise((resolve, reject) => {
      getLogsConfigIndices(params).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getLogsTimeField ({commit}, data) {
    return new Promise((resolve, reject) => {
      getLogsTimeField(data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getLogsManageIndices ({commit}) {
    return new Promise((resolve, reject) => {
      getLogsManageIndices().then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  addLogsConfigIndex ({commit}, data) {
    return new Promise((resolve, reject) => {
      addLogsConfigIndex(data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getLogsConfigIndex ({commit}, data) {
    return new Promise((resolve, reject) => {
      getLogsConfigIndex(data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  editLogsConfigIndex ({commit}, {id, data}) {
    return new Promise((resolve, reject) => {
      editLogsConfigIndex(id, data).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteLogsConfigIndex ({commit}, id) {
    return new Promise((resolve, reject) => {
      deleteLogsConfigIndex(id).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getCefFieldLists ({commit}) {
    return new Promise((resolve, reject) => {
      getCefFieldLists().then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  addCefField ({commit}, data) {
    return new Promise((resolve, reject) => {
      addCefField(data).then(res => {
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
