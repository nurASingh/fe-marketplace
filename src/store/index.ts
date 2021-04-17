/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from 'vue'
import Vuex from 'vuex'
// import authStore from './authStore'
import contentStore from './contentStore'
import searchStore from './searchStore'
import stacksStore from './stacksStore'
import openNodeStore from './openNodeStore'
import projectStore from './projectStore'
import rates from 'risidio-rates'
import searchIndexService from '@/services/searchIndexService'

Vue.use(Vuex)

const RISIDIO_API_PATH = process.env.VUE_APP_RISIDIO_API
const APPLICATION_ID = process.env.VUE_APP_SQUARE_APPLICATION_ID
const LOCATION_ID = process.env.VUE_APP_SQUARE_LOCATION_ID
const SQUARE_URL = process.env.VUE_APP_VUE_APP_SQUARE_URL
const ETH_PAYMENT_ADDRESS = process.env.VUE_APP_ETH_PAYMENT_ADDRESS
const STX_PAYMENT_ADDRESS = process.env.VUE_APP_STACKS_PAYMENT_ADDRESS
const STX_CONTRACT_ADDRESS = process.env.VUE_APP_STACKS_CONTRACT_ADDRESS
const STX_CONTRACT_NAME = process.env.VUE_APP_STACKS_CONTRACT_NAME
const STX_MINT_FUNCTION = process.env.VUE_APP_STACKS_MINT_FUNCTION
const ETH_CONTRACT_ADDRESS = process.env.VUE_APP_NFT_CONTRACT_ADDRESS
const RISIDIO_STACKS_API = process.env.VUE_APP_API_STACKS
const RISIDIO_WALLET_MAC = process.env.VUE_APP_WALLET_MAC
const RISIDIO_WALLET_SKY = process.env.VUE_APP_WALLET_SKY

const selling = {
}
const marketConfig = {
  oneLayout: true,
  searchMenu: false,
  sideMenu: false,
  projectId: 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW.thisisnumberone'
}
const beneficiariesDefault = [
  {
    username: 'donation.id',
    role: 'Charitable Donation',
    email: 'donation@thisisnumberone.com',
    royalty: 10,
    chainAddress: 'STFJEDEQB1Y1CQ7F04CS62DCS5MXZVSNXXN413ZG'
  },
  {
    username: 'environment.id',
    role: 'Environment/Sustainabilty',
    email: 'environment@thisisnumberone.com',
    royalty: 5,
    chainAddress: 'STMYA5EANW6C0HNS1S57VX52M0B795HHFDBW2XBE'
  }
]
const payment = {
  forceNew: false,
  amountFiat: 0.5,
  currency: 'GBP',
  paymentCode: 'po-12324',
  allowMultiples: true,
  stxPaymentAddress: STX_PAYMENT_ADDRESS,
  ethPaymentAddress: ETH_PAYMENT_ADDRESS,
  paymentOption: 'ethereum',
  paymentOptions: [
    { allowFiat: true },
    { allowBitcoin: true },
    { allowLightning: true },
    { allowStacks: true },
    { allowLSAT: false },
    { allowEthereum: true }
  ],
  creditAttributes: {
    start: 4,
    step: 2,
    min: 2,
    max: 20
  },
  squarePay: {
    applicationId: APPLICATION_ID,
    locationId: LOCATION_ID,
    squareUrl: SQUARE_URL
  }
}
const minter = {
  preferredNetwork: 'stacks risidio',
  networks: [
    {
      network: 'stacks risidio',
      functionName: STX_MINT_FUNCTION,
      enabled: true,
      contractAddress: STX_CONTRACT_ADDRESS,
      contractName: STX_CONTRACT_NAME
    },
    {
      network: 'stacks connect',
      enabled: true,
      functionName: STX_MINT_FUNCTION,
      contractAddress: STX_CONTRACT_ADDRESS,
      contractName: STX_CONTRACT_NAME
    },
    {
      network: 'ethereum',
      enabled: true,
      functionName: 'mint-token',
      contractAddress: ETH_CONTRACT_ADDRESS
    }
  ],
  enableRoyalties: true,
  beneficiaries: beneficiariesDefault
}

const lookAndFeel = {
  variant0: 'danger',
  variant1: 'warning',
  variant2: 'info',
  variant3: 'light',
  labels: {
    title: 'Mint Your Item',
    numberUnits: 'How many spins?',
    quantityLabel: 'Tokens'
  }
}

const gaiaAsset = {
  saleData: {}
}

const setup = function (data) {
  if (!data.asset) data.asset = {}
  let risidioCardMode = 'config-flow'
  if (data.flow) {
    risidioCardMode = data.flow
  }
  const useNetwork = 'testnet'
  // let beneficiaries = []
  const risidioBaseApi = RISIDIO_API_PATH
  const configuration = {
    lookAndFeel: lookAndFeel,
    gaiaAsset: gaiaAsset,
    payment: payment,
    marketConfig: marketConfig,
    selling: selling,
    minter: minter,
    network: useNetwork,
    risidioBaseApi: risidioBaseApi,
    risidioStacksApi: RISIDIO_STACKS_API,
    risidioWalletMac: RISIDIO_WALLET_MAC,
    risidioWalletSky: RISIDIO_WALLET_SKY,
    risidioCardMode: risidioCardMode
  }
  // window.risidioPaymentConfig = JSON.stringify(configuration)
  return configuration
}

export default new Vuex.Store({
  modules: {
    contentStore,
    searchStore,
    projectStore,
    stacksStore,
    openNodeStore
  },
  state: {
    apiKey: null,
    paymentOptions: null,
    eventCode: 'connect-session',
    creditAttributes: {},
    configuration: setup({}),
    windims: {
      innerHeight: 0,
      innerWidth: 0
    },
    modalMessage: 'Your request is being processed',
    myProfile: {
      loggedIn: false
    },
    categories: [
      {
        icon: 'easel',
        displayName: 'Artwork',
        name: 'artwork'
      },
      {
        icon: 'file-music',
        displayName: 'Music & Sounds',
        name: 'music'
      },
      {
        icon: 'card-list',
        displayName: 'Trading Cards',
        name: 'trading_cards'
      },
      {
        icon: 'file-earmark',
        displayName: 'Certificates',
        name: 'certificates'
      },
      {
        icon: 'globe',
        displayName: 'Digital Property',
        name: 'digital_property'
      },
      {
        icon: 'file-earmark-richtext',
        displayName: 'Written Word',
        name: 'written_word'
      },
      {
        icon: 'newspaper',
        displayName: 'News and Media',
        name: 'news_media'
      }
    ],
    xgeRates: null
  },
  getters: {
    getRpayConfiguration: state => {
      return state.configuration
    },
    getGalleryImageHeight: state => width => {
      const snapHeight = (width * 1024) / 716
      console.log(state.configuration)
      return snapHeight
    },
    getExchangeRates: state => {
      return state.xgeRates
    },
    getExchangeRate: state => amountStx => {
      if (!state.xgeRates) {
        return null
      }
      const rate = state.xgeRates.find(item => item.fiatCurrency === 'EUR')
      const priceInEuro = (1 / rate.amountStx) * amountStx
      return Math.round(priceInEuro * 100) / 100
    },
    getExchangeRateFormatted: state => amountStx => {
      if (!state.xgeRates) {
        return null
      }
      const rate = state.xgeRates.find(item => item.fiatCurrency === 'EUR')
      const priceInEuro = (1 / rate.amountStx) * amountStx
      return rate.symbol + ' ' + (Math.round(priceInEuro * 100) / 100)
    },
    getStxAmountFormatted: () => amountStx => {
      if (!amountStx) {
        return 0
      }
      return (Math.round(amountStx * 10000) / 10000)
    },
    getEventCode: state => {
      return state.eventCode
    },
    getModalMessage: state => {
      return state.modalMessage
    },
    getCategories: state => {
      return state.categories
    },
    getLoginConfiguration: () => {
      return {
        opcode: 'connect-login'
      }
    },
    getSectionHeight: state => {
      return (state.windims.innerHeight)
    },
    getSectionWidth: state => {
      return (state.windims.innerWidth)
    }
  },
  mutations: {
    setRpayFlow (state, data) {
      state.configuration = setup(data)
    },
    setXgeRates (state, rates) {
      state.xgeRates = rates
    },
    setWinDims (state) {
      state.windims = {
        innerWidth: window.innerWidth, innerHeight: window.innerHeight
      }
    },
    myProfile (state, myProfile) {
      state.myProfile = myProfile
    },
    setEventCode (state, data) {
      state.eventCode = data.eventCode
    },
    setModalMessage (state, modalMessage) {
      state.modalMessage = modalMessage
    }
  },
  actions: {
    fetchRatesFromBinance ({ commit }) {
      return new Promise(() => {
        /**
        rates.fetchSTXRates().then((rates) => {
          commit('setXgeRates', rates)
          searchIndexService.addExchangeRates({ binanceRates: rates })
        })
        **/
        searchIndexService.getExchangeRates().then((rates: any) => {
          commit('setXgeRates', rates.binanceRates)
        })
      })
    },
    /**
    fetchRates ({ state, commit }, configuration) {
      return new Promise((resolve, reject) => {
        MESH_API = configuration.risidioBaseApi + '/mesh'
        axios.get(MESH_API + '/v1/rates/ticker').then(response => {
          commit('setTickerRates', response.data)
        })
      })
    },
    **/
    fetchRatesFromDb ({ commit }) {
      return new Promise(() => {
        searchIndexService.getExchangeRates().then((rates: any) => {
          commit('setXgeRates', rates.binanceRates)
        })
        setInterval(function () {
          rates.fetchSTXRates().then((rates) => {
            commit('setXgeRates', rates)
          })
        }, 60000) // fetch from db every 10 minutes
      })
    }
  }
})
