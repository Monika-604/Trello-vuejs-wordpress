import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    API: 'http://127.0.0.1:8000/wp-json/wp/v2',
    nonce: '',
    username: 'admin',
    password: '123456'
  },
  mutations: {
    setNonce(state, payload) {
      state.nonce = payload
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    API(state) {
      return state.API
    },
    credentials(state) {
      return {
        username: state.username,
        password: state.password
      }
    },
    nonce(state) {
      return state.nonce
    }
  }
})
