import { login, logout, getPermission, getInfo, refreshToken, getBellLog, deleteBellLog } from '@/api/common/user'
import { getCookie, setCookie, removeCookie } from '@/api/common/auth'
import router, { resetRouter } from '@/router'
import { JWTPayloadHandler } from '@/utils'

const state = {
  token: getCookie('token'),
  name: getCookie('name'),
  roles: [],
  expireTime: getCookie('expires'),
  userPermission: getCookie('userPermission')
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },

  SET_NAME: (state, name) => {
    state.name = name
  },

  REFRESH_TOKEN: (state, payload) => {
    state.token = payload
  },
  SET_EXPIRE: (state, payload) => {
    state.expireTime = payload
  },
  SET_USER_PERMISSION: (state, payload) => {
    state.userPermission = payload
  },
}

const actions = {
  login ({ commit }, userInfo) {
    console.log(userInfo)
    const { username, password } = userInfo

    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          commit('SET_EXPIRE', JWTPayloadHandler(data.token))
          setCookie('token', data.token)
          setCookie('expires', JWTPayloadHandler(data.token))
          resolve()
        }).catch(error => {
          reject(error.response)
        })
    })
  },

  getInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        console.log(response)
        const { data } = response
        if (!data) {
          reject(new Error('无法获取用户信息，请重新登录！'))
        }
        const { alias, username } = data
        commit('SET_NAME', alias === '' ? username : alias)
        setCookie('name', alias === '' ? username : alias)
        resolve(data)
      }).catch(error => {
        reject(error.response)
      })
    })
  },

  // 此接口暂时无用
  getPermission ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getPermission().then(response => {
        const { data } = response
        if (!data) {
          reject(new Error('验证失败，请重新登录！'))
        }
        commit('SET_USER_PERMISSION', data)
        setCookie('userPermission', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 此接口暂时无用
  changeRoles ({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setCookie('token', token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      router.addRoutes(accessRoutes)

      resolve()
    })
  },

  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_EXPIRE', '')
        commit('SET_USER_PERMISSION', '[]')
        commit('SET_NAME', '')
        removeCookie('token')
        removeCookie('name')
        removeCookie('expires')
        removeCookie('userPermission')
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  resetToken ({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      removeCookie('token')
      removeCookie('name')
      removeCookie('expires')
      resolve()
    })
  },

  refreshToken ({commit}, token) {
    return new Promise(resolve => {
      refreshToken(token).then(({data}) => {
        commit('SET_TOKEN', data.token)
        commit('SET_EXPIRE', JWTPayloadHandler(data.token))
        setCookie('token', data.token)
        setCookie('expires', JWTPayloadHandler(data.token))
        resolve()
      })
    })
  },

  getBellLog ({commit}) {
    return new Promise((resolve, reject) => {
      getBellLog().then(res => {
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },
  deleteBellLog ({commit}, id) {
    return new Promise((resolve, reject) => {
      deleteBellLog(id).then(res => {
        resolve(res)
      }).catch(e => {
        reject(e)
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
