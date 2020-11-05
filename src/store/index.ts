/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from 'vue'
import Vuex from 'vuex'
import authStore from './authStore'
import applicationStore from './applicationStore'
import contentStore from './contentStore'
import searchStore from './searchStore'
import stacksStore from './stacksStore'
import projectStore from './projectStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    authStore,
    applicationStore,
    contentStore,
    searchStore,
    projectStore,
    stacksStore
  },
  state: {
    apiKey: null,
    paymentOptions: null,
    eventCode: 'connect-session',
    creditAttributes: {},
    windims: {
      innerHeight: 0,
      innerWidth: 0
    },
    myProfile: {
      loggedIn: false
    }
  },
  getters: {
    getEventCode: state => {
      return state.eventCode
    },
    getLoginConfiguration: () => {
      return {
        opcode: 'connect-login'
      }
    },
    getSectionHeight: state => {
      return (state.windims.innerHeight)
    },
    getSectionWidth: state => {
      return (state.windims.innerWidth)
    }
  },
  mutations: {
    setWinDims (state) {
      state.windims = {
        innerWidth: window.innerWidth, innerHeight: window.innerHeight
      }
    },
    myProfile (state, myProfile) {
      state.myProfile = myProfile
    },
    setEventCode (state, data) {
      state.eventCode = data.eventCode
    }
  },
  actions: {
  }
})
