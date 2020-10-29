import projectService from '@/services/projectService.js'
import searchIndexService from '@/services/searchIndexService'
import store from '.'
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'
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

const projectStore = {
  namespaced: true,
  state: {
    rootFile: null,
    connectedProjects: null,
    appmapContractId: 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW.appmap'
  },
  getters: {
    getProjects: (state: any) => {
      return (state.rootFile && state.rootFile.projects) ? state.rootFile.projects : []
    },
    getAppmapContractId: (state: any) => {
      return state.appmapContractId
    },
    getAppmapTxId: (state: any) => {
      if (!state.rootFile || !state.rootFile.appmap) return
      return state.rootFile.appmap.txId
    },
    getConnectedProjects: (state: any) => {
      return state.connectedProjects || []
    }
  },
  mutations: {
    rootFile (state: any, rootFile: any) {
      state.rootFile = rootFile
    },
    setConnectedProjects (state: any, connectedProjects: any) {
      state.connectedProjects = connectedProjects
    },
    addContractData (state, data) {
      const index = state.rootFile.projects.findIndex((o) => o.projectId === data.projectId)
      if (index > -1) {
        const project = state.rootFile.projects[index]
        project.info = data.info
        project.interface = data.interface
        state.rootFile.projects.splice(index, 1, project)
      }
    }
  },
  actions: {
    findProjects ({ commit }: any) {
      return new Promise((resolve, reject) => {
        const url = SEARCH_API_PATH + '/projectsAll'
        axios.get(url).then((response) => {
          readProjectFromGaia(resolve, reject, response.data, commit)
        }).catch((error) => {
          reject(new Error('Unable find projects: ' + error))
        })
      })
    },
    findProjectsByDomain: function ({ commit }: any, domain: string) {
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
    findProjectsByOwner: function ({ commit }: any, owner: string) {
      return new Promise(function (resolve, reject) {
        if (!owner) {
          reject(new Error('No owner'))
          return
        }
        const url = SEARCH_API_PATH + '/projectsByDomain/' + owner
        axios.get(url).then((response) => {
          readProjectFromGaia(resolve, reject, response.data, commit)
        }).catch((error) => {
          reject(new Error('Unable index record: ' + error))
        })
      })
    },
    findProjectsByProjectId ({ commit }: any, projectId: string) {
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
    },
    fetchMyProjects ({ state, commit }: any, forced: boolean) {
      return new Promise(resolve => {
        if (state.rootFile && !forced) {
          resolve(state.rootFile)
        } else {
          const profile = store.getters[APP_CONSTANTS.KEY_PROFILE]
          projectService.fetchMyProjects(profile).then((rootFile: any) => {
            rootFile.projects.forEach((project) => {
              store.dispatch('stacksStore/lookupContractInterface', project.projectId)
            })
            commit('rootFile', rootFile)
            resolve(rootFile)
          })
        }
      })
    },
    findProjectByProjectId ({ state, commit }: any, projectId: string) {
      return new Promise(resolve => {
        const profile = store.getters[APP_CONSTANTS.KEY_PROFILE]
        let item = null
        if (state.rootFile) {
          item = state.rootFile.projects.find(item => item.projectId === projectId)
        }
        if (item) {
          resolve(item)
        } else {
          projectService.fetchMyProjects(profile).then((rootFile: any) => {
            commit('rootFile', rootFile)
            const item = state.rootFile.projects.find(item => item.projectId === projectId)
            resolve(item)
          })
        }
      })
    },
    updateProject ({ state, commit }: any, data: any) {
      return new Promise((resolve, reject) => {
        if (!state.rootFile) reject(new Error('application not initialised?'))
        if (data.contractId.indexOf('appmap') > -1) {
          state.rootFile.appmap = {
            contractId: data.contractId,
            txId: data.txId
          }
          projectService.saveProject(state.rootFile).then((rootFile) => {
            commit('rootFile', rootFile)
            resolve(state.rootFile.appmap)
          })
        } else {
          const index = state.rootFile.projects.findIndex((o) => o.projectId === data.projectId)
          if (index > -1) {
            const project = state.rootFile.projects[index]
            project.projectId = data.contractId
            project.txId = data.txId
            searchIndexService.removeRecord('project', data.projectId)
            state.rootFile.projects.splice(index, 1, project)
            projectService.saveProject(state.rootFile).then((rootFile) => {
              commit('rootFile', rootFile)
              searchIndexService.addRecord(project)
              resolve(project)
            })
          } else {
            reject(new Error('project not initialised?'))
          }
        }
      })
    },
    deleteProject ({ state, commit }: any, projectId: string) {
      return new Promise(resolve => {
        const profile = store.getters[APP_CONSTANTS.KEY_PROFILE]
        if (!profile.superAdmin) {
          resolve(false)
          return
        }
        if (state.rootFile) {
          const index = state.rootFile.projects.findIndex((o) => o.projectId === projectId)
          if (index > -1) {
            state.rootFile.projects.splice(index, 1)
            searchIndexService.removeRecord('project', projectId).then(() => {
              projectService.saveProject(state.rootFile).then((rootFile) => {
                commit('rootFile', rootFile)
                resolve(true)
              }).catch(() => {
                resolve(false)
              })
            }).catch(() => {
              resolve(false)
            })
          } else {
            resolve(false)
          }
        } else {
          resolve(false)
        }
      })
    },
    saveContractToGaia ({ state, commit }, data) {
      return new Promise((resolve, reject) => {
        if (!state.rootFile.projects) {
          state.rootFile.projects = []
        }
        const item = state.rootFile.projects.find(item => item.txData === data.txData)
        if (item) {
          resolve(item)
          return
        } else {
          state.rootFile.projects.push(data)
        }
        projectService.saveProject(state.rootFile).then((rootFile) => {
          commit('rootFile', rootFile)
          resolve(data)
        }).catch((error) => {
          console.log(error)
          reject(error)
        })
      })
    },
    saveProject ({ state, commit }: any, data: any) {
      return new Promise((resolve, reject) => {
        if (!data.project.projectId ||
          data.project.projectId.indexOf('.') === -1 ||
          data.project.projectId.split('.').length !== 2 ||
          !data.project.projectId.split('.')[0].startsWith('S') ||
          !data.project.owner ||
          !data.project.title ||
          !data.project.description) {
          reject(new Error('Bad project data'))
          return
        }
        const contractName = data.project.projectId.split('.')[1]
        projectService.uploadProjectLogo(contractName, data.imageData).then((gaiaUrl: string) => {
          const project = data.project
          project.logo = null
          project.domain = location.hostname
          project.imageUrl = gaiaUrl
          project.objType = 'project'
          project.updated = moment({}).valueOf()
          let index = state.rootFile.projects.findIndex((o) => o.projectId === project.projectId)
          if (index < 0) {
            state.rootFile.projects.splice(0, 0, project)
            index = 0
          } else {
            state.rootFile.projects.splice(index, 1, project)
          }
          projectService.saveProject(state.rootFile).then((rootFile) => {
            commit('rootFile', rootFile)
            searchIndexService.addRecord(state.rootFile.projects[index]).then((result) => {
              console.log(result)
              resolve(project)
            }).catch((error) => {
              console.log(error)
              resolve(project)
            })
          }).catch((error) => {
            console.log(error)
            reject(error)
          })
        })
      })
    }
  }
}
export default projectStore
