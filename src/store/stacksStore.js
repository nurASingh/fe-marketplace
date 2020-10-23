import store from '@/store'
import { APP_CONSTANTS } from '@/app-constants'
import {
  StacksTestnet,
  makeContractCall,
  broadcastTransaction,
  makeContractDeploy
} from '@blockstack/stacks-transactions'
import axios from 'axios'
import BigNum from 'bn.js'

let STX_PAYMENT_ADDRESS = process.env.VUE_APP_STACKS_PAYMENT_ADDRESS
let STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
let STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME
const network = new StacksTestnet()
const mac = JSON.parse(process.env.VUE_APP_WALLET_MAC || '')
const precision = 1000000

const STACKS_API = process.env.VUE_APP_API_STACKS
const MESH_API = process.env.VUE_APP_API_MESH

/**
const getStacksAccount = function (appPrivateKey) {
  const privateKey = createStacksPrivateKey(appPrivateKey)
  const publicKey = getPublicKey(privateKey)
  const address = addressFromPublicKeys(
    AddressVersion.TestnetSingleSig,
    AddressHashMode.SerializeP2PKH,
    1,
    [publicKey]
  )
  return { privateKey, address }
}
**/
const setAddresses = function () {
  const config = store.getters[APP_CONSTANTS.KEY_CONFIGURATION]
  if (config && config.addresses) {
    STX_PAYMENT_ADDRESS = config.addresses.stxPaymentAddress
    STX_CONTRACT_ADDRESS = config.addresses.stxContractAddress
    STX_CONTRACT_NAME = config.addresses.stxContractName
  }
}

function unwrapStrings (tuple) {
  const names = tuple.match(/0x\w+/g) || []
  const name = Buffer.from(names[0].substring(2), 'hex').toString()
  return name
}

const getAmountStx = function (amountMicroStx) {
  try {
    if (typeof amountMicroStx === 'string') {
      amountMicroStx = Number(amountMicroStx)
    }
    if (amountMicroStx === 0) return 0
    amountMicroStx = amountMicroStx / precision
    return Math.round(amountMicroStx * precision) / precision
  } catch {
    return 0
  }
}
const stacksStore = {
  namespaced: true,
  state: {
    provider: 'risidio',
    contracts: [],
    appName: 'Risidio Mesh',
    appLogo: '/img/logo/Risidio_logo_256x256.png',
    macsWallet: mac
  },
  getters: {
    getMacsWallet: state => {
      return state.wallet
    },
    getContractData: state => contractId => {
      const index = state.contracts.findIndex((o) => o.contract_id === contractId)
      if (index > -1) {
        return state.contracts[index]
      }
    }
  },
  mutations: {
    setMacsWallet (state, newMac) {
      state.macsWallet = newMac
    },
    addContractData (state, contract) {
      const index = state.contracts.findIndex((o) => o.contract_id === contract.contract_id)
      if (index > -1) {
        state.contracts.splice(index, 1, contract)
      } else {
        state.contracts.splice(0, 0, contract)
      }
    }
  },
  actions: {
    fetchMacsWalletInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        const macsWallet = state.macsWallet
        const data = {
          path: '/v2/accounts/' + macsWallet.keyInfo.address,
          httpMethod: 'get',
          postData: null
        }
        axios.post(MESH_API + '/v2/accounts', data).then(response => {
          macsWallet.nonce = response.data.nonce
          macsWallet.balance = getAmountStx(parseInt(response.data.balance, 16))
          commit('setMacsWallet', macsWallet)
          resolve(macsWallet)
        }).catch(() => {
          const macsWallet = state.macsWallet
          const useApi = STACKS_API + '/v2/accounts/' + macsWallet.keyInfo.address
          axios.get(useApi).then(response => {
            macsWallet.nonce = response.data.nonce
            macsWallet.balance = getAmountStx(parseInt(response.data.balance, 16))
            commit('setMacsWallet', macsWallet)
            resolve(macsWallet)
          }).catch((error) => {
            reject(error)
          })
        })
      })
    },
    callContractRisidio ({ state, commit }, data) {
      return new Promise((resolve, reject) => {
        setAddresses()
        const profile = store.getters['authStore/getMyProfile']
        if (!data.senderKey) {
          data.senderKey = profile.senderKey
        }
        let nonce = new BigNum(state.wallet.nonce)
        if (data && data.action === 'inc-nonce') {
          nonce = new BigNum(state.wallet.nonce + 1)
        }
        // 5000 000 000 000 000
        const txOptions = {
          contractAddress: STX_CONTRACT_ADDRESS,
          contractName: STX_CONTRACT_NAME,
          functionName: data.functionName,
          functionArgs: (data.functionArgs) ? data.functionArgs : [],
          fee: new BigNum(1800),
          senderKey: state.wallet.keyInfo.privateKey,
          nonce: new BigNum(nonce),
          validateWithAbi: false,
          network
        }
        makeContractCall(txOptions).then((transaction) => {
          if (state.provider !== 'risidio') {
            broadcastTransaction(transaction, network).then((result) => {
              resolve(result)
            }).catch((error) => {
              reject(error)
            })
          } else {
            const txdata = new Uint8Array(transaction.serialize())
            const headers = {
              'Content-Type': 'application/octet-stream'
            }
            axios.post(MESH_API + '/v2/broadcast', txdata, { headers: headers }).then(response => {
              const result = {
                txId: response.data,
                network: 15,
                tokenId: Math.floor(Math.random() * Math.floor(1000000000))
              }
              resolve(result)
            }).catch(() => {
              const macsWallet = state.macsWallet
              const useApi = STACKS_API + '/v2/accounts/' + macsWallet.keyInfo.address
              axios.get(useApi).then(response => {
                macsWallet.nonce = response.data.nonce
                macsWallet.balance = getAmountStx(parseInt(response.data.balance, 16))
                commit('setMacsWallet', macsWallet)
                resolve(macsWallet)
              }).catch((error) => {
                if (error.response) {
                  if (error.response.data.message.indexOf('NotEnoughFunds') > -1) {
                    reject(new Error('Not enough funds in the wallet to send this - try decreasing the amount?'))
                  } else if (error.response.data.message.indexOf('ConflictingNonceInMempool') > -1) {
                    reject(new Error('Conflicting Nonce In Mempool!'))
                  } else {
                    reject(new Error(error.response.data.message))
                  }
                } else {
                  reject(error.message)
                }
              })
            })
          }
        })
      })
    },
    callContractRisidioReadOnly ({ state }, data) {
      return new Promise((resolve, reject) => {
        setAddresses()
        const txoptions = {
          path: '/v2/contracts/call-read/' + STX_CONTRACT_ADDRESS + '/' + STX_CONTRACT_NAME + '/' + data.functionName,
          httpMethod: 'POST',
          postData: {
            arguments: (data.functionArgs) ? data.functionArgs : [],
            sender: STX_PAYMENT_ADDRESS
          }
        }
        axios.post(MESH_API + '/v2/accounts', txoptions).then(response => {
          if (!response.data.okay) {
            reject(new Error('not okay'))
          } else {
            data.senderKey = null
            if (data.functionName === 'get-mint-price') {
              const res = getAmountStx(parseInt(response.data.result, 16))
              // const res = unwrapStrings(response.data.result) // response.data.result.substring(0)
              data.result = res
            } else {
              const res = unwrapStrings(response.data.result) // response.data.result.substring(2)
              // data.result = Buffer.from(res, 'hex').toString()
              data.result = res
            }
            resolve(data)
          }
        }).catch((error) => {
          if (error.response && error.response.data) {
            reject(new Error(error.response.data.message))
          } else {
            reject(new Error(error.message))
          }
        })
      })
    },
    lookupContract ({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios.get(STACKS_API + '/extended/v1/contract/' + data.contractId).then(response => {
          commit('addContractData', response.data)
          resolve(response.data)
        }).catch(() => {
          reject(new Error('Contract does not appear to be deployed.'))
        })
      })
    },
    deployContractRisidio ({ state, dispatch }, data) {
      return new Promise((resolve, reject) => {
        network.coreApiUrl = 'http://localhost:20443'
        const sender = state.macsWallet
        if (!data.fee) {
          data.fee = 4000
        }
        const txOptions = {
          contractName: data.contractName,
          codeBody: data.codeBody,
          senderKey: sender.keyInfo.privateKey,
          nonce: new BigNum(sender.nonce++), // watch for nonce increments if this works - may need to restart mocknet!
          fee: new BigNum(data.fee), // set a tx fee if you don't want the builder to estimate
          network
        }
        makeContractDeploy(txOptions).then((transaction) => {
          const txdata = new Uint8Array(transaction.serialize())
          const headers = {
            'Content-Type': 'application/octet-stream'
          }
          axios.post(MESH_API + '/v2/broadcast', txdata, { headers: headers }).then(response => {
            txOptions.senderKey = null
            txOptions.fromAddress = data.address
            txOptions.result = response.data
            txOptions.provider = 'risidio'
            txOptions.txtype = 'deployment'
            dispatch('stacksStore/fetchMacsWalletInfo')
            resolve(txOptions)
          }).catch((error) => {
            reject(error)
          })
        }).catch((error) => {
          reject(error)
        })
      })
    }
  }
}
export default stacksStore
