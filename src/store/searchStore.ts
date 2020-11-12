
import searchIndexService from '@/services/searchIndexService'
import store from '.'
import { APP_CONSTANTS } from '@/app-constants'

const connectSearchResultToAssets = function (commit, resultSet) {
  resultSet.forEach((result) => {
    commit('addSearchResult', result)
    if (result.assetHash && !result.tokenId) {
      store.dispatch('stacksStore/matchAssetIndex', result).then((data) => {
        result.index = data.value.data.index.value
        commit('addSearchResult', result)
      })
    }
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
        searchIndexService.findArtworkById(assetHash).then((resultSet) => {
          connectSearchResultToAssets(commit, resultSet)
          commit('addSearchResult', resultSet[0])
          resolve(resultSet[0])
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    },
    findAssets ({ commit }: any) {
      return new Promise((resolve, reject) => {
        searchIndexService.findAssets().then((resultSet) => {
          connectSearchResultToAssets(commit, resultSet)
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
    findBySearchTerm ({ commit }: any, query: string) {
      return new Promise((resolve, reject) => {
        if (query && query.length > 0) {
          query += '*'
          searchIndexService.findArtworkByTitleOrDescriptionOrCategoryOrKeyword(query).then((resultSet) => {
            connectSearchResultToAssets(commit, resultSet)
            commit('setSearchResults', resultSet)
            resolve(resultSet)
          }).catch((error) => {
            reject(new Error('Unable index record: ' + error))
          })
        } else {
          query += '*'
          searchIndexService.findAssets().then((resultSet) => {
            connectSearchResultToAssets(commit, resultSet)
            commit('setSearchResults', resultSet)
            resolve(resultSet)
          }).catch((error) => {
            reject(new Error('Unable index record: ' + error))
          })
        }
      })
    },
    findByProjectId ({ commit }: any, projectId: string) {
      return new Promise((resolve, reject) => {
        searchIndexService.findByProjectId(projectId).then((resultSet) => {
          commit('setSearchResults', resultSet)
          resolve(resultSet)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    },
    findByOwner ({ commit }: any) {
      return new Promise((resolve, reject) => {
        const profile = store.getters[APP_CONSTANTS.KEY_PROFILE]
        searchIndexService.findByOwner(profile.username).then((resultSet) => {
          connectSearchResultToAssets(commit, resultSet)
          commit('setSearchResults', resultSet)
          resolve(resultSet)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    }
  }
}
export default searchStore
