import axios from 'axios'

const SEARCH_API_PATH = process.env.VUE_APP_API_SEARCH

/**
 *  The service is a client to the brightblock sever side grpc client.
 **/
const searchIndexService = {
  removeRecord: function (field: string, value: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/removeRecord/' + field + '/' + value).then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable unindex record: ' + error))
      })
    })
  },

  addRecord: function (projectModel: any) {
    return new Promise(function (resolve, reject) {
      /**
      const project: any = {
        domain: projectModel.domain,
        indexFiles: [{
          indexFileName: PROJECT_ROOT_PATH,
          indexObjType: 'project'
        }],
        owner: projectModel.owner,
        projectId: projectModel.projectId,
        storeageModel: 'gaia'
      }
      **/
      axios.post(SEARCH_API_PATH + '/addRecord', projectModel).then((result) => {
        resolve(result)
      })
        .catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
    })
  },

  sizeOfIndex: function () {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/size').then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },

  clearDappsIndex: function () {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/dapps/clear').then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },

  clearNamesIndex: function () {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/names/clear').then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },

  fetchAllNamesIndex: function () {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/names/fetch').then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  searchNamesIndex: function (term: string, query: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/names/query/' + term + '?q=' + query).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  findAssets: function (): Promise < any[] > {
    return new Promise(function (resolve, reject) {
      const url = SEARCH_API_PATH + '/findByObject/artwork'
      axios.get(url).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  findByOwner: function (owner: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/findByOwner' + '?q=' + owner).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  findByProjectId: function (projectId: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/findByProjectId' + '?q=' + projectId).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  findByDomainAndObjectTypeAndTitleOrDescriptionOrCategoryOrKeyword: function (domain: string, objType: string, term: string, query: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/findByDomainAndObjectTypeAndTitleOrDescriptionOrCategoryOrKeyword/' + domain + '/' + objType + '/' + term + '?q=' + query).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  findArtworkById: function (query: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/findArtworkByTitleOrDescriptionOrCategoryOrKeyword/id' + '?q=' + query).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  findArtworkByTitleOrDescriptionOrCategoryOrKeyword: function (query: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/findArtworkByTitleOrDescriptionOrCategoryOrKeyword/title' + '?q=' + query).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  countByDomainAndObjectTypeAndCategories: function (domain: string, objType: string, term: string, query: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/countByDomainAndObjectTypeAndCategories/' + domain + '/' + objType + '/' + term + '?q=' + query).then((result) => {
        resolve(result.data.details)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  indexUsers: function (names: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/users/' + names).then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  indexUser: function (bsId: string) {
    return searchIndexService.indexUsers(bsId)
  },
  indexPages: function (from: string, to: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/pages/' + from + '/' + to).then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  remove: function (field: string, value: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/art/index/remove/' + field + '/' + value).then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  }
}
export default searchIndexService
