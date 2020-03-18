
const state = {
  nodename: '',
  node: null,
}

const mutations = {
  SET_NODENAME: (state, val) => {
    state.nodename = val
  },
  SET_NODE: (state, val) => {
    state.node = val
  }
}

const actions = {
  setNodeName ({commit}, val) {
    commit('SET_NODENAME', val)
  },
  setnode ({commit}, val) {
    commit('SET_NODE', val)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
