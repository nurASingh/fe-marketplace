import {
  Person,
  UserSession,
  decodeToken,
  getPublicKeyFromPrivate
} from 'blockstack'

const BLOCKSTACK_LOGIN = Number(process.env.VUE_APP_BLOCKSTACK_LOGIN)

const userSession = new UserSession()
const getProfile = function () {
  let myProfile: any = {
    loggedIn: false
  }
  try {
    const account = userSession.loadUserData()
    if (account) {
      let uname = account.username
      const person = new Person(account.profile)
      let name = person.name()
      if (uname) {
        if (!name) {
          const indexOfDot = uname.indexOf('.')
          name = uname.substring(0, indexOfDot)
        }
      }
      if (!uname && name) {
        uname = name
      }
      if (!uname) {
        uname = ''
      }
      const showAdmin =
        uname === 'mike.personal.id' ||
        uname.indexOf('brightblock') > -1 ||
        uname.indexOf('risidio') > -1 ||
        uname.indexOf('radicle') > -1 ||
        uname.indexOf('mijoco') > -1 ||
        uname.indexOf('head') > -1 ||
        uname.indexOf('testuser0934583') > -1 ||
        uname.indexOf('feek') > -1
      const avatarUrl = person.avatarUrl()
      // let privateKey = account.appPrivateKey + '01'
      // privateKey = hexStringToECPair(privateKey).toWIF()
      const authResponseToken = account.authResponseToken
      // const decodedToken = decodeToken(authResponseToken)
      // let publicKey = decodedToken.payload.public_keys[0]
      const publicKey = getPublicKeyFromPrivate(account.appPrivateKey)
      const loggedIn = true
      myProfile = {
        loggedIn: loggedIn,
        identityAddress: account.identityAddress,
        publicKey: publicKey,
        showAdmin: showAdmin,
        showSuperAdmin: uname === 'mijoco.id.blockstack',
        name: name,
        description: person.description(),
        avatarUrl: avatarUrl,
        username: uname,
        hubUrl: account.hubUrl,
        apps: account.profile.apps
      }
    }
    return myProfile
  } catch (err) {
    return myProfile
  }
}

const authHeaders = function () {
  let authResponseToken
  let publicKey
  let token = 'v1:no-token' // note: not all requests require auth token - e.g. getPaymentAddress
  if (userSession.isUserSignedIn()) {
    const account = userSession.loadUserData()
    if (account) {
      token = 'v1:' + account.authResponseToken
    }
  }
  const headers = {
    IdentityAddress: publicKey,
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + token
  }
  return headers
}

const authStore = {
  namespaced: true,
  state: {
    myProfile: {
      username: null,
      loggedIn: false,
      showAdmin: false
    },
    authHeaders: null
  },
  getters: {
    getMyProfile: (state: { myProfile: any }) => {
      return state.myProfile
    },
    getAuthHeaders: (state: { authHeaders: any }) => {
      return state.authHeaders
    }
  },
  mutations: {
    loggedIn (state: { myProfile: { loggedIn: any } }, loggedIn: any) {
      state.myProfile.loggedIn = loggedIn
    },
    myProfile (state: { myProfile: any }, myProfile: any) {
      state.myProfile = myProfile
    },
    authHeaders (state: { authHeaders: any }, authHeaders: any) {
      state.authHeaders = authHeaders
    }
  },
  actions: {
    fetchMyAccount ({ commit }: any) {
      return new Promise(resolve => {
        if (userSession.isUserSignedIn()) {
          // userSession.signUserOut(window.location.origin)
          const profile = getProfile()
          commit('myProfile', profile)
          commit('authHeaders', authHeaders())
          resolve(profile)
        } else if (userSession.isSignInPending()) {
          userSession.handlePendingSignIn().then(() => {
            const profile = getProfile()
            commit('myProfile', profile)
            commit('authHeaders', authHeaders())
            resolve(profile)
          })
        } else {
          const profile = getProfile()
          commit('myProfile', profile)
          commit('authHeaders', authHeaders())
          resolve(profile)
        }
      })
    },
    startLogin () {
      return new Promise(resolve => {
        if (BLOCKSTACK_LOGIN === 1) {
          // showBlockstackConnect(authOptions)
        } else if (BLOCKSTACK_LOGIN === 2) {
          // authenticate(authOptions)
        } else {
          const origin = window.location.origin
          const transitKey = userSession.generateAndStoreTransitKey()
          const scopes = [
            'store_write',
            'publish_data'
          ]
          const authRequest = userSession.makeAuthRequest(transitKey, origin, origin + '/manifest.json', scopes)
          userSession.redirectToSignInWithAuthRequest(authRequest, 'http://localhost:8888/auth')
          resolve()
        }
      })
    },
    startLogout ({ commit }: any) {
      return new Promise(() => {
        if (userSession.isUserSignedIn()) {
          userSession.signUserOut(window.location.origin)
          commit('myProfile', getProfile())
        }
      })
    }
  }
}
export default authStore
