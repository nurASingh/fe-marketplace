import axios from 'axios'
import { AppConfig, UserSession } from '@stacks/connect'
import { Storage } from '@stacks/storage'
import Stomp from '@stomp/stompjs'
import SockJS from 'sockjs-client'

// Vue.use(Vuex)
let socket = null
let stompClient = null
const MESH_API_PATH = process.env.VUE_APP_API_MESH

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })
const storage = new Storage({ userSession })

const tokenFromHash = function (state, ahash) {
  let retToken = null
  if (!state.registry || !state.registry.applications) return
  state.registry.applications.forEach((app) => {
    if (app.tokenContract && app.tokenContract.tokens) {
      const index = app.tokenContract.tokens.findIndex((o) => o.tokenInfo.assetHash === ahash)
      if (index > -1 && app.status === 0) {
        retToken = app.tokenContract.tokens[index]
        retToken.contractId = app.contractId
        retToken.contractStatus = app.status
      }
    }
  })
  return retToken
}

const fetchGaiaData = function (commit, state, data) {
  try {
    const index = state.gaiaAssets.findIndex((o) => o.assetHash === data.assetHash)
    if (index > -1) return // already read this file in current page session
    const options = {
      decrypt: false,
      username: data.gaiaUsername
    }
    storage.getFile(data.gaiaFilename, options).then((file) => {
      const rootFile = JSON.parse(file)
      if (rootFile && rootFile.records && rootFile.records.length > -1) {
        rootFile.records.forEach((gaiaAsset) => {
          const token = tokenFromHash(state, gaiaAsset.assetHash)
          if (token) {
            gaiaAsset.nftIndex = token.nftIndex
            gaiaAsset.saleData = token.saleData
            commit('addGaiaAsset', gaiaAsset)
          }
        })
      }
    }).catch((error) => {
      console.log(error)
    })
  } catch (err) {
    console.log(err)
  }
}

const loadAssetsFromGaia = function (commit, state) {
  if (!state.registry || !state.registry.applications) return
  state.registry.applications.forEach((app) => {
    if (app.tokenContract && app.tokenContract.tokens) {
      app.tokenContract.tokens.forEach((token) => {
        fetchGaiaData(commit, state, { gaiaFilename: app.gaiaFilename, gaiaUsername: token.tokenInfo.gaiaUsername, assetHash: token.tokenInfo.assetHash })
      })
    }
  })
}

const subscribeApiNews = function (state, commit, connectUrl) {
  if (!socket) socket = new SockJS(connectUrl + '/api-news')
  if (!stompClient) stompClient = Stomp.over(socket)
  stompClient.connect({}, function () {
    stompClient.subscribe('/queue/rates-news', function (response) {
      const rates = JSON.parse(response.body)
      commit('setTickerRates', rates.tickerRates)
    })
    stompClient.subscribe('/queue/contract-news', function (response) {
      const registry = JSON.parse(response.body)
      commit('setRegistry', registry)
      // this isn't going to work like this since the marketplace is
      // on a different domain to the application
      // loadAssetsFromGaia(commit, state)
    })
  },
  function (error) {
    console.log(error)
  })
}

const contractStore = {
  namespaced: true,
  state: {
    application: null,
    registry: null,
    tickerRates: null,
    gaiaAssets: []
  },
  getters: {
    getRegistry: state => {
      return state.registry
    },
    getContractAssetFromHash: state => assetHash => {
      const token = tokenFromHash(state, assetHash)
      return token
    },
    getGaiaAssets: state => {
      return state.gaiaAssets
    },
    getGaiaAssetsByOwner: state => owner => {
      return state.gaiaAssets.filter((o) => o.owner === owner)
    },
    getGaiaAssetFromHash: state => assetHash => {
      const index = state.gaiaAssets.findIndex((o) => o.assetHash === assetHash)
      return state.gaiaAssets[index]
    }
  },
  mutations: {
    setRegistry (state, registry) {
      state.registry = registry
    },
    setTickerRates (state, tickerRates) {
      state.tickerRates = tickerRates
    },
    addGaiaAsset (state, asset) {
      if (!state.gaiaAssets) return
      const index = state.gaiaAssets.findIndex((o) => o.assetHash === asset.assetHash)
      if (index === -1) {
        state.gaiaAssets.splice(0, 0, asset)
      } else {
        state.gaiaAssets.splice(index, 1, asset)
      }
    }
  },
  actions: {
    initialiseTheOne ({ state, commit }) {
      return new Promise((resolve, reject) => {
        // if project id is set in config then read search index of this
        // project. Otherwise search projects recursively
        const path = MESH_API_PATH + '/v2/appmap/'
        axios.get(path).then(response => {
          subscribeApiNews(state, commit, MESH_API_PATH)
          commit('setRegistry', response.data)
          resolve(response.data)
        }).catch((error) => {
          reject(error)
        })
      })
    }
  }
}
export default contractStore
