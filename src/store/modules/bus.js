const state = {
  addAppDialog: false,
  addEventDialog: false,
  addPlaybookDialog: false
}

const mutations = {
  OPEN_ADD_APP_DIALOG: state => {
    state.addAppDialog = true
  },
  CLOSE_ADD_APP_DIALOG: state => {
    state.addAppDialog = false
  },
  OPEN_EVENT_DIALOG: state => {
    state.addEventDialog = true
  },
  CLOSE_EVENT_DIALOG: state => {
    state.addEventDialog = false
  },
}

const actions = {
  openAddAppDialog ({commit}) {
    commit('OPEN_ADD_APP_DIALOG')
  },
  closeAddAppDialog ({commit}) {
    commit('CLOSE_ADD_APP_DIALOG')
  },
  openEventDialog ({commit}) {
    commit('OPEN_EVENT_DIALOG')
  },
  closeEventDialog ({commit}) {
    commit('CLOSE_EVENT_DIALOG')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
