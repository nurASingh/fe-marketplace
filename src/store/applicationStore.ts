import projectService from '@/services/projectService.js'
import store from '.'
import { uintCV, intCV, bufferCV, serializeCV } from '@stacks/transactions'
import searchIndexService from '@/services/searchIndexService'

const KEY_GAIA_PROJECT = 'getGaiaProject'
const mac = JSON.parse(process.env.VUE_APP_WALLET_MAC || '')

const applicationStore = {
  namespaced: true,
  state: {
    rootFile: null,
    appmap: {
      apps: []
    },
    gaiaProjects: [],
    appCounter: -1,
    appmapContractId: mac.keyInfo.address + '.appmap'
  },
  getters: {
    getAppmapTxId: (state: any) => {
      return state.appmap.txId
    },
    getAppmap: state => {
      return state.appmap
    },
    getAppmapContractId: (state: any) => {
      return state.appmapContractId
    },
    getAppmapCounter: (state: any) => {
      return state.appCounter
    },
    getAppmapProject: (state: any) => projectId => {
      const index = state.appmap.apps.findIndex((o) => o.contractId === projectId)
      if (index > -1) {
        return state.appmap.apps[index]
      }
    },
    getGaiaProject: (state: any) => projectId => {
      // note a user might store multiple projects in their gaia space
      const index = state.gaiaProjects.findIndex((o) => o.projectId === projectId)
      if (index > -1) {
        return state.gaiaProjects[index]
      }
    }
  },
  mutations: {
    rootFile (state: any, rootFile: any) {
      state.rootFile = rootFile
    },
    setAppCounter (state, appCounter) {
      state.appCounter = appCounter
    },
    setGaiaProjects (state, gaiaProjects) {
      let index = -1
      gaiaProjects.forEach((project) => {
        index = state.gaiaProjects.findIndex((o) => o.projectId === project.projectId)
        if (index < 0) {
          state.gaiaProjects.splice(0, 0, project)
        } else {
          state.gaiaProjects.splice(index, 1, project)
        }
      })
    },
    setAppmap (state, appmap) {
      state.appmap = appmap
    },
    addAppToAppmap (state, application) {
      const index = state.appmap.apps.findIndex((o) => o.appCounter === application.appCounter)
      if (index < 0) {
        state.appmap.apps.splice(application.appCounter, 0, application)
      } else {
        state.appmap.apps.splice(index, 1, application)
      }
    },
    addTradeInfoToAppmap (state, data) {
      const index1 = state.appmap.apps.findIndex((o) => o.appCounter === data.application.appCounter)
      if (index1 > -1) {
        const application = state.appmap.apps[index1]
        const index = application.clarityAssets.findIndex((o) => o.nftIndex === data.nftIndex)
        if (index > -1) {
          application.clarityAssets[index].tradeInfo = data.tradeInfo
        }
      }
    },
    addClarityAssetToAppmap (state, data) {
      const index1 = state.appmap.apps.findIndex((o) => o.appCounter === data.application.appCounter)
      if (index1 > -1) {
        const application = state.appmap.apps[index1]
        const index = application.clarityAssets.findIndex((o) => o.assetHash === data.asset.assetHash)
        if (index < 0) {
          application.clarityAssets.splice(0, 0, data.asset)
        } else {
          application.clarityAssets.splice(index, 1, data.asset)
        }
      }
    }
  },
  actions: {
    lookupApplications ({ state, commit, dispatch }: any) {
      return new Promise((resolve, reject) => {
        store.dispatch('stacksStore/callContractReadOnly', { contractId: state.appmapContractId, functionName: 'get-app-counter' }).then((appCounter) => {
          commit('setAppCounter', appCounter)
          for (let i = 0; i < state.appCounter; i++) {
            dispatch('lookupApplicationByIndex', i)
          }
        }).catch((e) => {
          reject(e)
        })
      })
    },
    lookupApplicationByIndex: function ({ state, commit, dispatch, getters }: any, appCounter: number) {
      return new Promise(function (resolve, reject) {
        const index = state.appmap.apps.findIndex((o) => o.appCounter === appCounter)
        if (index > -1) {
          resolve(state.appmap.apps[index])
          return
        }
        const functionArgs = [`0x${serializeCV(intCV(appCounter)).toString('hex')}`]
        const config = {
          contractId: state.appmapContractId,
          functionName: 'get-app',
          functionArgs: functionArgs
        }
        store.dispatch('stacksStore/callContractReadOnly', config).then((application) => {
          application.appCounter = appCounter
          dispatch('fetchApplicationBaseTokenAddress', application)
          commit('addAppToAppmap', application)
          const gaiaProject = getters[KEY_GAIA_PROJECT](application.contractId)
          if (!gaiaProject) {
            projectService.fetchUserProjects(application.owner).then((gaiaProjects) => {
              commit('setGaiaProjects', gaiaProjects)
              const gp = getters[KEY_GAIA_PROJECT](application.contractId)
              application.gaiaProject = gp
              commit('addAppToAppmap', application)
              dispatch('lookupMintCounter', application)
              resolve(application)
            }).catch(() => {
              dispatch('lookupMintCounter', application)
              resolve(application)
            })
          } else {
            resolve(application)
          }
        }).catch((e) => {
          reject(e)
        })
      })
    },
    lookupMintCounter ({ commit }: any, application: any) {
      return new Promise((resolve, reject) => {
        store.dispatch('stacksStore/callContractReadOnly', { contractId: application.contractId, functionName: 'get-mint-counter' }).then((mintCounter) => {
          application.mintCounter = mintCounter
          application.clarityAssets = []
          commit('addAppToAppmap', application)
          resolve(application)
          /**
          application.clarityAssets = []
          for (let i = 0; i < application.mintCounter; i++) {
            dispatch('lookupMintedAssets', { application: application, index: i })
          }
          **/
        }).catch((e) => {
          reject(e)
        })
      })
    },
    indexMintedAssets: function ({ state, dispatch }: any) {
      return new Promise((resolve) => {
        state.appmap.apps.forEach((application) => {
          application.numberCalls = 0
          for (let i = 0; i < application.mintCounter; i++) {
            dispatch('lookupMintedAssets', { application: application, index: i })
          }
        })
        resolve('Indexing underway - please don\'t refresh or close this tab..')
      })
    },
    lookupMintedAssets: function ({ dispatch, commit }: any, appdata: any) {
      return new Promise(function (resolve, reject) {
        const functionArgs = [`0x${serializeCV(uintCV(appdata.index)).toString('hex')}`]
        const config = {
          contractId: appdata.application.contractId,
          functionName: 'get-token-info',
          functionArgs: functionArgs
        }
        store.dispatch('stacksStore/callContractReadOnly', config).then((clarityAsset) => {
          const buffer = `0x${serializeCV(bufferCV(Buffer.from(clarityAsset.assetHash, 'hex'))).toString('hex')}` // Buffer.from(hash.toString(CryptoJS.enc.Hex), 'hex')
          const myConfig = {
            contractId: appdata.application.contractId,
            functionName: 'get-index',
            functionArgs: [buffer]
          }
          store.dispatch('stacksStore/callContractReadOnly', myConfig).then((nftIndex) => {
            clarityAsset.nftIndex = nftIndex
            appdata.application.numberCalls++
            commit('addClarityAssetToAppmap', { application: appdata.application, asset: clarityAsset })
            dispatch('lookupTradeInfo', { application: appdata.application, nftIndex: nftIndex }).then(() => {
              if (appdata.application.numberCalls >= appdata.application.mintCounter) {
                searchIndexService.addRecords(appdata.application)
              }
            }).catch(() => {
              if (appdata.application.numberCalls >= appdata.application.mintCounter) {
                searchIndexService.addRecords(appdata.application)
              }
            })
          }).catch((e) => {
            reject(e)
          })
        }).catch((e) => {
          reject(e)
        })
      })
    },
    lookupTradeInfo: function ({ commit }: any, data: any) {
      return new Promise((resolve, reject) => {
        const functionArgs = [`0x${serializeCV(uintCV(data.nftIndex)).toString('hex')}`]
        const config = {
          contractId: data.application.contractId,
          functionName: 'get-sale-data',
          functionArgs: functionArgs
        }
        store.dispatch('stacksStore/callContractReadOnly', config).then((tradeInfo) => {
          commit('addTradeInfoToAppmap', { nftIndex: data.nftIndex, application: data.application, tradeInfo: tradeInfo })
          resolve(tradeInfo)
        }).catch((error) => {
          console.log(error)
          reject(error)
        })
      })
    },
    fetchApplicationBaseTokenAddress: function ({ commit }: any, application: any) {
      return new Promise(function (resolve, reject) {
        const config = {
          contractId: application.contractId,
          functionName: 'get-base-token-uri',
          functionArgs: []
        }
        store.dispatch('stacksStore/callContractReadOnly', config).then((baseTokenUri) => {
          application.baseTokenUri = baseTokenUri
          commit('addAppToAppmap', application)
          resolve(application)
        }).catch((e) => {
          reject(e)
        })
      })
    }
  }
}
export default applicationStore
