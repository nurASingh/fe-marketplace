import { UserSession } from 'blockstack'
import moment from 'moment'
import axios from 'axios'

const SEARCH_API_PATH = process.env.VUE_APP_API_SEARCH
const PROJECT_ROOT_PATH = process.env.VUE_APP_PROJECT_ROOT_PATH

const userSession = new UserSession()

const getNewRootFile = function () {
  const now = moment({}).valueOf()
  const newRootFile = {
    created: now,
    profile: {},
    projects: []
  }
  return newRootFile
}

const projectService = {
  initProject: function (profile) {
    return new Promise((resolve) => {
      if (!profile.loggedIn) {
        resolve(getNewRootFile())
        return
      }
      const rootFile = getNewRootFile()
      userSession.getFile(PROJECT_ROOT_PATH, { decrypt: false }).then((file) => {
        if (!file) {
          userSession.putFile(PROJECT_ROOT_PATH, JSON.stringify(rootFile), { encrypt: false })
          resolve(rootFile)
        } else {
          resolve(JSON.parse(file))
        }
      }).catch(() => {
        userSession.putFile(PROJECT_ROOT_PATH, JSON.stringify(rootFile), { encrypt: false })
        resolve(rootFile)
      })
    })
  },
  fetchUserProjects: function (username) {
    return new Promise((resolve, reject) => {
      userSession.getFile(PROJECT_ROOT_PATH, { username: username, decrypt: false }).then((file) => {
        if (!file) {
          resolve()
        } else {
          const rootFile = JSON.parse(file)
          resolve(rootFile.projects)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },
  fetchMyProjects: function (profile) {
    return new Promise((resolve, reject) => {
      if (!profile.loggedIn) {
        resolve(getNewRootFile())
        return
      }
      userSession.getFile(PROJECT_ROOT_PATH, { decrypt: false }).then((file) => {
        if (!file) {
          const rootFile = getNewRootFile()
          userSession.putFile(PROJECT_ROOT_PATH, JSON.stringify(rootFile), { encrypt: false })
          resolve(rootFile)
        } else {
          const rootFile = JSON.parse(file)
          resolve(rootFile)
        }
      }).catch(() => {
        reject(new Error('Failed to fetch - logged in?'))
      })
    })
  },
  uploadProjectLogo: function (projectName, imageData) {
    return new Promise((resolve) => {
      // const artwork = Buffer.from(imageData.imageBuffer).toString('base64') // imageDataURI.decode(dataUrl)
      const path = projectName + '.png'
      const options = {
        contentType: imageData.mimeType,
        encrypt: false
      }
      userSession.putFile(path, imageData.imageBuffer, options).then(function () {
        userSession.getFileUrl(path).then((gaiaUrl) => {
          resolve(gaiaUrl)
        }).catch(() => {
          resolve()
        })
      }).catch(() => {
        resolve()
      })
    })
  },
  registerProject: function (project) {
    return new Promise((resolve, reject) => {
      axios.post(SEARCH_API_PATH + '/register', project).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  saveProject: function (rootFile) {
    return new Promise((resolve, reject) => {
      rootFile.updated = moment({}).valueOf()
      userSession.putFile(PROJECT_ROOT_PATH, JSON.stringify(rootFile), { encrypt: false }).then(() => {
        resolve(rootFile)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}
export default projectService
