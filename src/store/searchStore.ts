
import searchIndexService from '@/services/searchIndexService'

const searchStore = {
  namespaced: true,
  state: {
    resultSet: null
  },
  getters: {
    getResultSet: (state: { resultSet: any }) => {
      return state.resultSet
    }
  },
  mutations: {
    addResultSet: (state: { resultSet: Array<any> }, resultSet: Array<any>) => {
      state.resultSet = resultSet
    }
  },
  actions: {
    findByProjectId ({ commit }: any, projectId: string) {
      return new Promise((resolve, reject) => {
        searchIndexService.findByProjectId(projectId).then((resultSet) => {
          commit('addResultSet', resultSet)
          resolve(resultSet)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    },
    search ({ commit }: any, query: string) {
      return new Promise((resolve, reject) => {
        searchIndexService.findArtworkByTitleOrDescriptionOrCategoryOrKeyword(query).then((resultSet) => {
          commit('addResultSet', resultSet)
          resolve(resultSet)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    }
  }
}
export default searchStore
