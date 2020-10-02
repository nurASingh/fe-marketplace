import axios from 'axios'

const SEARCH_API_PATH = process.env.VUE_APP_SEARCH_INDEX
const PROJECT_ID = process.env.VUE_APP_PROJECT_ID || ''

const taxonomy = {
  keywords: ['contemporary', 'modern', 'outsider', 'political', 'bauhaus', 'impressionism', 'noir', 'cartoon', 'illustration', 'grafitti'],
  media: [
    { label: 'Digital Image', value: 'image' },
    { label: 'Digital Sound', value: 'sound' },
    { label: 'Digital Video', value: 'video' },
    { label: 'Jewellery', value: 'jewellery' },
    { label: 'Painting', value: 'painting' },
    { label: 'Photography', value: 'photography' },
    { label: 'Print', value: 'print' },
    { label: 'Sculpture', value: 'sculpture' }
  ],
  saleTypes: [
    { label: 'Buy Now', value: 'buyNow', soid: 1 },
    { label: 'Make Offer', value: 'makeOffer', soid: 3 },
    { label: 'In Auction', value: 'inAuction', soid: 2 },
    { label: 'Listing', value: 'listing', soid: 0 }
  ]
}

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

  addRecord: function (objType: string, indexable: { domain: string; projectId: string; objType: string; keywords: never[]; privacy: string; saleData: { soid: number; amount: number; fiatCurrency: string; reserve: number }; metaData: { medium: string; saleType: string; saleAmount: number; saleCurrency: string; saleReserve: number }; medium: string }) {
    return new Promise(function (resolve, reject) {
      indexable.domain = location.hostname
      indexable.projectId = PROJECT_ID
      indexable.objType = objType
      if (indexable.keywords && !Array.isArray(indexable.keywords)) {
        indexable.keywords = []
      }
      if (!indexable.privacy) {
        indexable.privacy = 'public'
      }
      const saleType = taxonomy.saleTypes[0]
      if (indexable.saleData) {
        let saleType = taxonomy.saleTypes.find(saleType => saleType.soid === indexable.saleData.soid)
        if (!saleType) {
          saleType = { label: '', soid: 0, value: '0' }
        }
      }
      indexable.metaData = {
        medium: indexable.medium,
        saleType: saleType.value,
        saleAmount: (indexable.saleData) ? indexable.saleData.amount : 0,
        saleCurrency: (indexable.saleData) ? indexable.saleData.fiatCurrency : 'EUR',
        saleReserve: (indexable.saleData) ? indexable.saleData.reserve : 0
      }
      axios.post(SEARCH_API_PATH + '/addRecord', indexable).then((result) => {
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
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  searchNamesIndex: function (term: string, query: string) {
    return new Promise(function (resolve, reject) {
      axios.get(SEARCH_API_PATH + '/names/query/' + term + '?q=' + query).then((result) => {
        resolve(result)
      }).catch((error) => {
        reject(new Error('Unable index record: ' + error))
      })
    })
  },
  findByProjectId: function (projectId: string) {
    return new Promise(function (resolve, reject) {
      let url = SEARCH_API_PATH + '/findAll'
      if (projectId) {
        url = SEARCH_API_PATH + '/findByProject/' + projectId
      }
      axios.get(url).then((result) => {
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
