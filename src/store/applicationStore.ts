import projectService from '@/services/projectService.js'
import axios from 'axios'

const SEARCH_API_PATH = process.env.VUE_APP_API_SEARCH

const readProjectFromGaia = function (resolve, reject, projectLookups, commit) {
  try {
    projectLookups.forEach((projectLookup) => {
      // the lookups are records stored centrally which allow the data to be pulled
      // from users gaia storage
      projectService.fetchUserProjects(projectLookup.owner).then((connectedProjects) => {
        commit('setConnectedProjects', { owner: projectLookup.owner, projects: connectedProjects })
      })
    })
    resolve()
  } catch {
    reject(new Error('Unable to fetch project from users gaia storage.' + JSON.stringify(projectLookups)))
  }
}

const applicationStore = {
  namespaced: true,
  state: {
    rootFile: null,
    connectedProjects: null,
    appmapContractId: 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW.appmap'
  },
  getters: {
    getApplications: (state: any) => {
      return (state.rootFile && state.rootFile.projects) ? state.rootFile.projects : []
    }
  },
  mutations: {
    rootFile (state: any, rootFile: any) {
      state.rootFile = rootFile
    }
  },
  actions: {
    lookupApplications ({ commit }: any) {
      return new Promise((resolve, reject) => {
        const url = SEARCH_API_PATH + '/projectsAll'
        axios.get(url).then((response) => {
          readProjectFromGaia(resolve, reject, response.data, commit)
        }).catch((error) => {
          reject(new Error('Unable find projects: ' + error))
        })
      })
    },
    findApplicationsByDomain: function ({ commit }: any, domain: string) {
      return new Promise(function (resolve, reject) {
        if (!domain) {
          reject(new Error('No domain'))
          return
        }
        const url = SEARCH_API_PATH + '/projectsByDomain/' + domain
        axios.get(url).then((response) => {
          readProjectFromGaia(resolve, reject, response.data, commit)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    },
    findApplicationsByOwner: function ({ commit }: any, owner: string) {
      return new Promise(function (resolve, reject) {
        if (!owner) {
          reject(new Error('No owner'))
          return
        }
        const url = SEARCH_API_PATH + '/projectsByOwner/' + owner
        axios.get(url).then((response) => {
          readProjectFromGaia(resolve, reject, response.data, commit)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    },
    findApplicationByProjectId ({ commit }: any, projectId: string) {
      return new Promise((resolve, reject) => {
        if (!projectId) {
          reject(new Error('No domain'))
          return
        }
        const url = SEARCH_API_PATH + '/projectsByProjectId/' + projectId
        axios.get(url).then((response) => {
          if (response.data) {
            const projectLookups = [response.data]
            readProjectFromGaia(resolve, reject, projectLookups, commit)
          }
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    }
  }
}
export default applicationStore
