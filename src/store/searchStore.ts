
import searchIndexService from '@/services/searchIndexService'
import store from '.'

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
    findProjects ({ commit }: any) {
      return new Promise((resolve, reject) => {
        searchIndexService.findProjects().then((resultSet) => {
          commit('setProjects', resultSet)
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
            commit('setSearchResults', resultSet)
            resolve(resultSet)
          }).catch((error) => {
            reject(new Error('Unable index record: ' + error))
          })
        } else {
          return store.dispatch('searchStore/findByProjectId')
        }
      })
    }
  }
}
export default searchStore
