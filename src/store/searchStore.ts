
import searchIndexService from '@/services/searchIndexService'
import store from '.'
import { bufferCV, serializeCV } from '@stacks/transactions'

const matchAssetIndex = function (commit, result) {
  const bCV = bufferCV(Buffer.from(result.assetHash))
  const sCV = serializeCV(bCV)
  const functionArg = '0x' + sCV
  const functionArgs = [functionArg]
  if (result.projectId.indexOf('.') === -1) return
  const config = {
    contractId: (result.projectId) ? result.projectId : '',
    functionName: 'get-index',
    functionArgs: functionArgs
  }
  store.dispatch('stacksStore/callContractReadOnly', config).then((data) => {
    result.index = data.value.data.index.value
    commit('addSearchResult', result)
  }).catch((error) => {
    console.log(error)
  })
}

const searchStore = {
  namespaced: true,
  state: {
    searchResults: null,
    projects: null
  },
  getters: {
    getSearchResults: (state: any) => {
      return state.searchResults
    },
    getAsset: (state: any) => (assetHash: string) => {
      if (assetHash && state.searchResults && state.searchResults.length > 0) {
        const asset = state.searchResults.find(o => o.assetHash === assetHash)
        return asset
      }
      return null
    },
    getProjects: (state: any) => {
      return state.projects
    }
  },
  mutations: {
    setSearchResults: (state: any, searchResults: any) => {
      state.searchResults = searchResults
    },
    addSearchResult: (state: any, result: any) => {
      if (!state.searchResults) {
        state.searchResults = []
      }
      if (result) state.searchResults.push(result)
    },
    setProjects: (state: any, projects: any) => {
      state.projects = projects
    }
  },
  actions: {
    indexUsers ({ commit }: any, users: string) {
      return new Promise((resolve, reject) => {
        searchIndexService.indexUsers(users).then((resultSet) => {
          commit('setUsers', resultSet)
          resolve(resultSet)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    },
    clearAssets ({ commit }: any) {
      return new Promise((resolve, reject) => {
        searchIndexService.clearDappsIndex().then((resultSet) => {
          commit('setArtworks', resultSet)
          resolve(resultSet)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    },
    clearUsers ({ commit }: any) {
      return new Promise((resolve, reject) => {
        searchIndexService.clearNamesIndex().then((resultSet: any) => {
          commit('setUsers', resultSet)
          resolve(resultSet)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    },
    findArtworkById ({ commit }: any, assetHash: string) {
      return new Promise((resolve, reject) => {
        searchIndexService.findArtworkById(assetHash).then((results) => {
          commit('addSearchResult', results[0])
          resolve(results[0])
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    },
    findAssets ({ commit }: any) {
      return new Promise((resolve, reject) => {
        searchIndexService.findAssets().then((resultSet) => {
          resultSet.forEach((result) => {
            matchAssetIndex(commit, result)
          })
          commit('setSearchResults', resultSet)
          resolve(resultSet)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    },
    findUsers ({ commit }: any) {
      return new Promise((resolve, reject) => {
        searchIndexService.fetchAllNamesIndex().then((resultSet) => {
          commit('setUsers', resultSet)
          resolve(resultSet)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    },
    findBySearchTerm ({ commit, dispatch }: any, query: string) {
      return new Promise((resolve, reject) => {
        if (query && query.length > 0) {
          query += '*'
          searchIndexService.findArtworkByTitleOrDescriptionOrCategoryOrKeyword(query).then((resultSet) => {
            commit('setSearchResults', resultSet)
            resolve(resultSet)
          }).catch((error) => {
            reject(new Error('Unable index record: ' + error))
          })
        } else {
          return dispatch('findAssets')
        }
      })
    }
  }
}
export default searchStore
