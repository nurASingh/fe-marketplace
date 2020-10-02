import Vue from 'vue'
import Vuex from 'vuex'
import searchStore from './searchStore'
import authStore from './authStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    searchStore,
    authStore
  },
  state: {
  },
  mutations: {
  },
  actions: {
  }
})
