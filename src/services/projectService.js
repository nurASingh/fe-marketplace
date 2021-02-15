// import { UserSession } from 'blockstack'
import { UserSession } from '@stacks/connect'
import { Storage } from '@stacks/storage'
import moment from 'moment'
import axios from 'axios'

const SEARCH_API_PATH = process.env.VUE_APP_API_SEARCH
const PROJECT_ROOT_PATH = process.env.VUE_APP_PROJECT_ROOT_PATH

const userSession = new UserSession()
const storage = new Storage({ userSession })

const getNewRootFile = function () {
  const now = moment({}).valueOf()
  const newRootFile = {
    created: now,
    profile: {},
    favourites: [],
    projects: []
  }
  return newRootFile
}

const getFile = function (path) {
  return new Promise((resolve) => {
    storage.getFile(path).then((gaiaFile) => {
      resolve(gaiaFile)
    }).catch(() => {
      resolve()
    })
  })
}

const projectService = {
  initProject: function (profile) {
    return new Promise((resolve) => {
      if (!profile.loggedIn) {
        resolve(getNewRootFile())
        return
      }
      const rootFile = getNewRootFile()
      storage.getFile(PROJECT_ROOT_PATH, { decrypt: false }).then((file) => {
        if (!file) {
          storage.putFile(PROJECT_ROOT_PATH, JSON.stringify(rootFile), { encrypt: false })
          resolve(rootFile)
        } else {
          resolve(JSON.parse(file))
        }
      }).catch(() => {
        storage.putFile(PROJECT_ROOT_PATH, JSON.stringify(rootFile), { encrypt: false })
        resolve(rootFile)
      })
    })
  },
  fetchUserProjects: function (username) {
    return new Promise((resolve, reject) => {
      storage.getFile(PROJECT_ROOT_PATH, { username: username, decrypt: false }).then((file) => {
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
      storage.getFile(PROJECT_ROOT_PATH, { decrypt: false }).then((file) => {
        if (!file) {
          const rootFile = getNewRootFile()
          storage.putFile(PROJECT_ROOT_PATH, JSON.stringify(rootFile), { encrypt: false })
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
      getFile(path).then((file) => {
        if (file) console.log('overwriting file: ' + file)
        storage.putFile(path, imageData.imageBuffer, options).then(function () {
          storage.getFileUrl(path).then((gaiaUrl) => {
            resolve(gaiaUrl)
          }).catch(() => {
            resolve()
          })
        }).catch((error) => {
          console.log(error)
          resolve()
        })
      })
    })
  },
  saveProject: function (rootFile) {
    return new Promise((resolve, reject) => {
      rootFile.updated = moment({}).valueOf()
      storage.putFile(PROJECT_ROOT_PATH, JSON.stringify(rootFile), { encrypt: false }).then(() => {
        resolve(rootFile)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  saveDomainIndex: function (domainIndex) {
    return new Promise((resolve, reject) => {
      axios.post(SEARCH_API_PATH + '/v1/domain/register', domainIndex).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}
export default projectService
