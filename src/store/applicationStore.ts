import projectService from '@/services/projectService.js'
import utils from '@/services/utils'
import store from '.'
import { uintCV, intCV, serializeCV } from '@stacks/transactions'

const KEY_GAIA_PROJECT = 'getGaiaProject'

const applicationStore = {
  namespaced: true,
  state: {
    rootFile: null,
    appmap: {
      apps: []
    },
    gaiaProjects: [],
    appCounter: -1,
    appmapContractId: 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW.appmap'
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
    }
  },
  actions: {
    lookupApplications ({ state, commit, dispatch }: any) {
      return new Promise((resolve, reject) => {
        store.dispatch('stacksStore/callContractReadOnly', { contractId: state.appmapContractId, functionName: 'get-app-counter' }).then((data) => {
          const appCounter = data.value.value
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
        store.dispatch('stacksStore/callContractReadOnly', config).then((response) => {
          const application: any = utils.toObjectApplication(response)
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
            })
          } else {
            resolve(application)
          }
        }).catch((e) => {
          reject(e)
        })
      })
    },
    lookupMintCounter ({ commit, dispatch }: any, application: any) {
      return new Promise((resolve, reject) => {
        const config = {
          contractId: application.contractId,
          functionName: 'get-base-token-uri',
          functionArgs: []
        }
        store.dispatch('stacksStore/callContractReadOnly', config).then((response) => {
          const baseTokenUri = utils.toObjectString(response)
          application.baseTokenUri = baseTokenUri
          commit('addAppToAppmap', application)
          store.dispatch('stacksStore/callContractReadOnly', { contractId: application.contractId, functionName: 'get-mint-counter' }).then((data) => {
            application.mintCounter = data.value.value
            commit('addAppToAppmap', application)
            application.assets = []
            for (let i = 0; i < application.mintCounter; i++) {
              dispatch('lookupMintedAssets', { application: application, index: i })
            }
          }).catch((e) => {
            reject(e)
          })
        }).catch((e) => {
          reject(e)
        })
      })
    },
    lookupMintedAssets: function ({ commit }: any, appdata: any) {
      return new Promise(function (resolve, reject) {
        const functionArgs = [`0x${serializeCV(uintCV(appdata.index)).toString('hex')}`]
        const config = {
          contractId: appdata.application.contractId,
          functionName: 'get-token-info',
          functionArgs: functionArgs
        }
        store.dispatch('stacksStore/callContractReadOnly', config).then((data) => {
          const asset: any = utils.toObjectAsset(data)
          asset.nftIndex = appdata.index
          appdata.application.assets.push(asset)
          commit('addAppToAppmap', appdata.application)
          resolve(appdata.application)
        }).catch((e) => {
          reject(e)
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
        store.dispatch('stacksStore/callContractReadOnly', config).then((response) => {
          const baseTokenUri = utils.toObjectString(response)
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
