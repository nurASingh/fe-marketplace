import projectService from '@/services/projectService.js'
import searchIndexService from '@/services/searchIndexService'
import store from '.'
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'

const projectStore = {
  namespaced: true,
  state: {
    rootFile: null
  },
  getters: {
    getProjects: (state: any) => {
      return (state.rootFile && state.rootFile.projects) ? state.rootFile.projects : []
    }
  },
  mutations: {
    rootFile (state: any, rootFile: any) {
      state.rootFile = rootFile
    }
  },
  actions: {
    fetchProjects ({ commit }: any) {
      return new Promise(resolve => {
        const profile = store.getters[APP_CONSTANTS.KEY_PROFILE]
        projectService.fetchProjects(profile).then((rootFile: any) => {
          commit('rootFile', rootFile)
          resolve(rootFile)
        })
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
          projectService.fetchProjects(profile).then((rootFile: any) => {
            commit('rootFile', rootFile)
            const item = state.rootFile.projects.find(item => item.projectId === projectId)
            resolve(item)
          })
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
        if (!data.project.contractName ||
          !data.project.contractAddress ||
          !data.project.title ||
          !data.project.description) {
          reject(new Error('Bad project data'))
          return
        }
        projectService.uploadProjectLogo(data.project.contractName, data.imageData).then((gaiaUrl: string) => {
          const project = {
            domain: location.hostname,
            imageUrl: gaiaUrl,
            updated: moment({}).valueOf(),
            projectId: data.project.contractAddress + '.' + data.project.contractName,
            title: data.project.title,
            description: data.project.description,
            owner: data.project.owner,
            objType: 'project'
          }
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
              reject(error)
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
