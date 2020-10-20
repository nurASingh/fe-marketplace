import { UserSession } from 'blockstack'
import moment from 'moment'

const projectRootFileName = 'projects_v001.json'
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
      userSession.getFile(projectRootFileName, { decrypt: false }).then((file) => {
        if (!file) {
          userSession.putFile(projectRootFileName, JSON.stringify(rootFile), { encrypt: false })
          resolve(rootFile)
        } else {
          resolve(JSON.parse(file))
        }
      }).catch(() => {
        userSession.putFile(projectRootFileName, JSON.stringify(rootFile), { encrypt: false })
        resolve(rootFile)
      })
    })
  },
  fetchProjects: function (profile) {
    return new Promise((resolve) => {
      if (!profile.loggedIn) {
        resolve(getNewRootFile())
        return
      }
      userSession.getFile(projectRootFileName, { decrypt: false }).then((file) => {
        if (!file) {
          const rootFile = getNewRootFile()
          userSession.putFile(projectRootFileName, JSON.stringify(rootFile), { encrypt: false })
          resolve(rootFile)
        } else {
          const rootFile = JSON.parse(file)
          resolve(rootFile)
        }
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
  saveProject: function (rootFile) {
    return new Promise((resolve) => {
      rootFile.updated = moment({}).valueOf()
      userSession.putFile(projectRootFileName, JSON.stringify(rootFile), { encrypt: false }).then(() => {
        resolve(rootFile)
      })
    })
  }
}
export default projectService
