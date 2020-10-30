import projectService from '@/services/projectService.js'
import searchIndexService from '@/services/searchIndexService'
import store from '.'
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'

const projectStore = {
  namespaced: true,
  state: {
    rootFile: null,
    connectedProjects: null
  },
  getters: {
    getProjects: (state: any) => {
      return (state.rootFile && state.rootFile.projects) ? state.rootFile.projects : []
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
