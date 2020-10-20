import projectService from '@/services/projectService.js'
import searchIndexService from '@/services/searchIndexService'
import store from '.'
import { APP_CONSTANTS } from '@/app-constants'

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
    findProjectByContractId ({ state, commit }: any, contractId: string) {
      return new Promise(resolve => {
        const profile = store.getters[APP_CONSTANTS.KEY_PROFILE]
        let item = null
        if (state.rootFile) {
          item = state.rootFile.projects.find(item => item.contractAddress + '-' + item.contractName === contractId)
        }
        if (item) {
          resolve(item)
        } else {
          projectService.fetchProjects(profile).then((rootFile: any) => {
            commit('rootFile', rootFile)
            const item = state.rootFile.projects.find(item => item.contractAddress + '-' + item.contractName === contractId)
            resolve(item)
          })
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
        projectService.uploadProjectLogo(data.project.contractName, data.imageData).then((gaiaUrl: string) => {
          data.project.logo = gaiaUrl
          let index = state.rootFile.projects.findIndex((o) => o.contractName === data.project.contractName)
          if (index < 0) {
            state.rootFile.projects.splice(0, 0, data.project)
            index = 0
          } else {
            state.rootFile.projects.splice(index, 1, data.project)
          }
          projectService.saveProject(state.rootFile).then((rootFile) => {
            commit('rootFile', rootFile)
            searchIndexService.addRecord('project', state.rootFile.projects[index]).then((record) => {
              resolve(record)
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
