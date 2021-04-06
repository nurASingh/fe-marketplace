
import searchIndexService from '@/services/searchIndexService'
import store from '.'
import { APP_CONSTANTS } from '@/app-constants'

const sortResults = function (state, resultSet) {
  const currentSearch = (state.currentSearch) ? state.currentSearch : { filter: 'recent' }
  resultSet = resultSet.sort(function compare (a, b) {
    if (currentSearch.filter === 'recent') {
      if (!b.nftIndex || !a.nftIndex) return -1
      if (parseInt(a.nftIndex) > parseInt(b.nftIndex)) return -1
      if (parseInt(a.nftIndex) < parseInt(b.nftIndex)) return 1
      return 0
    } else if (currentSearch.filter === 'sort-by-application') {
      if (!b.projectId || !a.projectId) return -1
      if (a.projectId > b.projectId) return -1
      if (a.projectId < b.projectId) return 1
      return 0
    } else if (currentSearch.filter === 'sort-by-artist') {
      if (!b.artist) return -1
      if (a.artist > b.artist) return 1
      if (a.artist < b.artist) return -1
      return 0
    }
  })
  return resultSet
}

const matchResults = function (rootGetters, resultSet) {
  const results = []
  resultSet.forEach((searchResult) => {
    const token = rootGetters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](searchResult.assetHash)
    if (token) {
      searchResult.contractId = token.contractId
      searchResult.contractStatus = token.status
      searchResult.nftIndex = token.nftIndex
      searchResult.saleData = token.saleData
      results.push(searchResult)
    }
  })
  return results
}

const matchResult = function (rootGetters, result) {
  const token = rootGetters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](result.assetHash)
  if (token) {
    result.nftIndex = token.nftIndex
    result.saleData = token.saleData
  }
  return result
}

const searchStore = {
  namespaced: true,
  state: {
    searchResults: null,
    projects: null,
    currentSearch: null
  },
  getters: {
    getSearchResults: (state: any) => {
      if (state.searchResults) {
        return sortResults(state, state.searchResults)
      }
      // return state.searchResults
    },
    getCurrentSearch: (state: any) => {
      return state.currentSearch
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
    setCurrentSearch: (state: any, currentSearch: any) => {
      state.currentSearch = currentSearch
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
    findAssetByHash ({ commit, rootGetters }: any, assetHash: string) {
      return new Promise((resolve, reject) => {
        searchIndexService.findAssetByHash(assetHash).then((response: any) => {
          const result = matchResult(rootGetters, response.data)
          commit('addSearchResult', result)
          resolve(result)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    },
    findAssets ({ commit, rootGetters }: any) {
      return new Promise((resolve, reject) => {
        searchIndexService.findAssets().then((resultSet) => {
          const results = matchResults(rootGetters, resultSet)
          commit('setSearchResults', results)
          resolve(results)
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
    findBySearchTerm ({ commit, rootGetters }: any, query: string) {
      return new Promise((resolve, reject) => {
        if (query && query.length > 0) {
          query += '*'
          searchIndexService.findByTitleOrDescriptionOrCategoryOrKeyword(query).then((resultSet) => {
            const results = matchResults(rootGetters, resultSet)
            commit('setSearchResults', results)
            resolve(results)
          }).catch((error) => {
            reject(new Error('Unable index record: ' + error))
          })
        } else {
          query += '*'
          searchIndexService.findAssets().then((resultSet) => {
            const results = matchResults(rootGetters, resultSet)
            commit('setSearchResults', results)
            resolve(results)
          }).catch((error) => {
            reject(new Error('Unable index record: ' + error))
          })
        }
      })
    },
    findByProjectId ({ commit, rootGetters }: any, projectId: string) {
      return new Promise((resolve, reject) => {
        searchIndexService.findByProjectId(projectId).then((resultSet) => {
          const results = matchResults(rootGetters, resultSet)
          commit('setSearchResults', results)
          resolve(results)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    },
    findBySaleType ({ commit, rootGetters }: any, saleType: number) {
      return new Promise((resolve, reject) => {
        searchIndexService.findBySaleType(saleType).then((resultSet) => {
          const results = matchResults(rootGetters, resultSet)
          commit('setSearchResults', results)
          resolve(results)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    },
    findByObject ({ commit, rootGetters }: any, category: any) {
      return new Promise((resolve, reject) => {
        searchIndexService.findByObject(category.name).then((resultSet) => {
          const results = matchResults(rootGetters, resultSet)
          commit('setSearchResults', results)
          resolve(results)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    },
    findByOwner ({ commit, rootGetters }: any) {
      return new Promise((resolve, reject) => {
        const profile = store.getters[APP_CONSTANTS.KEY_PROFILE]
        searchIndexService.findByOwner(profile.username).then((resultSet) => {
          const results = matchResults(rootGetters, resultSet)
          commit('setSearchResults', results)
          resolve(results)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    }
  }
}
export default searchStore
