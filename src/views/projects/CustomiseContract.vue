<template>
<div class="row">
  <side-menu class="col-3 mr-0 pr-0 pt-5"/>
  <div class="col-9 pt-5 admin-app" v-if="loaded">
    <title-bar title="For Developers" class="container" v-on="$listeners"/>
    <div class="container" @click="$emit('toggle-off-navbar')">
      <b-form>
        <p class="text-40-300">Deploy Contract</p>
        <div class="mb-4 d-flex justify-content-between">
          <div class="mb-2 contract-id">{{projectId}}</div>
          <router-link class="mr-3 text-info" :to="'/connect-app/' + projectId"><b-icon icon="pencil"/></router-link>
        </div>
        <div class="row">
          <div class="col-md-6 col-xs-6">
            <div class="mb-4">
              <div class="d-flex justify-content-between">
                <div class="text2">Token Symbol</div>
              </div>
              <b-input v-model="params.tokenSymbol"></b-input>
            </div>
            <div class="mb-4">
              <div class="d-flex justify-content-between">
                <div class="text2">Token Name</div>
                <div class="text2"><a href="#" class="mr-1" @click.prevent="useProject()">use project name</a></div>
              </div>
              <b-input v-model="params.tokenName"></b-input>
            </div>
            <div class="mb-4">
              <div class="d-flex justify-content-between">
                <div class="text2">Contract Owner</div>
                <div class="text2"><a href="#" class="mr-1" @click.prevent="useMyAddress()">mine</a> <a class="text-info" href="#" @click.prevent="useMacsAddress()">macs</a></div>
              </div>
              <b-input v-model="params.contractOwner"></b-input>
            </div>
          </div>
          <div class="col-md-6 col-xs-6">
            <div class="mb-4 text2">
              <div class="">Platform Address</div>
              <div class="text2"><a class="text-info" href="#" @click.prevent="usePlatformAddress()">macs</a></div>
              <b-input v-model="params.platformAddress"></b-input>
            </div>
            <div class="mb-4 text2">
              <div class="">Mint Price (micro stacks)</div>
              <b-input v-model="params.mintPrice"></b-input>
            </div>
            <div class="text2">
              <div class="">Base URI</div>
              <b-input v-model="params.callBack"></b-input>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="mt-2 d-flex justify-content-end">
              <a href="#" class="wallet-use text-white"><span class="text-light">
                Note: Provide your own callback or use our stateless open source search index
                to store and retrieve asset meta data.
                To add a record to our search index post an indexable model to:
                http://api.risidio.local/index/addRecord see our <a href="https://github.com/radicleart/ms-search" target="_blank">github repo</a> for more details.
                To retrieve a record (given the asset hash) get from
                https://api.risidio.com/index/v1/asset/:asset-hash</span></a>
            </div>
            <div class="my-3">
              <b-button variant="info" class="mr-3" @click.prevent="deployContract()">Deploy Contract</b-button>
              <b-icon variant="info" icon="caret-left-fill"/><router-link class="text-info" to="/admin-app">back</router-link>
            </div>
          </div>
        </div>
      </b-form>
    </div>
    <div class="col-12">
      <h6>Template</h6>
      <standard-application-contract :contractSourceDisplay="contractSourceDisplay"/>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import StandardApplicationContract from '@/components/admin/StandardApplicationContract'
import SideMenu from '@/components/admin/SideMenu'
import TitleBar from '@/components/admin/TitleBar'
import utils from '@/services/utils'

const PLATFORM_ADDRESS = JSON.parse(process.env.VUE_APP_WALLET_MAC || '').keyInfo.address

export default {
  name: 'CustomiseContract',
  components: {
    StandardApplicationContract,
    SideMenu,
    TitleBar
  },
  data () {
    return {
      feeAmount: 3000,
      projectId: null,
      project: '',
      showContract: false,
      loaded: false,
      nonce: 0,
      showStep2: false,
      tokenUrl: null,
      deployedProject: null,
      result: null,
      params: {
        platformAddress: PLATFORM_ADDRESS,
        tokenName: 'token-name',
        tokenSymbol: 'token-symbol',
        mintPrice: '100000',
        token: 'token_name',
        contractName: null,
        contractOwner: 'stacks-address',
        callBack: 'https://loopbomb.risidio.com/index/v1/asset/'
      },
      // contractSourceDisplay: null,
      contractSource: `
;; Interface definitions
(impl-trait 'params.platformAddress.nft-interface.transferable-nft-trait)
(impl-trait 'params.platformAddress.nft-interface.tradable-nft-trait)

;; data structures
(define-non-fungible-token my-nft uint)
(define-map my-nft-data ((nft-index uint)) ((asset-hash (buff 32)) (date uint)))
(define-map sale-data ((nft-index uint)) ((sale-type uint) (increment-stx uint) (reserve-stx uint) (amount-stx uint) (bidding-end-time uint)))
(define-map my-nft-lookup ((asset-hash (buff 32))) ((nft-index uint)))

;; variables
(define-data-var administrator principal 'params.contractOwner)
(define-data-var mint-price uint uparams.mintPrice)
(define-data-var base-token-uri (buff 100) params.callBack)
(define-data-var mint-counter uint u0)
(define-data-var platform-fee uint u5)

;; constants
(define-constant token-name "params.tokenName")
(define-constant token-symbol "params.tokenSymbol")

(define-constant not-allowed (err u10))
(define-constant not-found (err u11))
(define-constant amount-not-set (err u12))
(define-constant seller-not-found (err u13))

(define-constant same-spender-err (err u1))
(define-constant failed-to-mint-err (err u5))

;;(define-constant not-approved-spender-err (err u2))
;;(define-constant failed-to-move-token-err (err u3))
;;(define-constant unauthorized-transfer-err (err u4))

;; public methods
;; --------------
(define-public (transfer-administrator (new-administrator principal))
    (begin
        (asserts! (is-eq (var-get administrator) tx-sender) not-allowed)
        (var-set administrator new-administrator)
        (ok true)
    )
)

(define-public (change-fee (new-fee uint))
    (begin
        (asserts! (is-eq (var-get administrator) tx-sender) not-allowed)
        (var-set platform-fee new-fee)
        (ok true)
    )
)

(define-public (update-base-token-uri (new-base-token-uri (buff 100)))
    (begin
        (asserts! (is-eq (var-get administrator) tx-sender) not-allowed)
        (var-set base-token-uri new-base-token-uri)
        (ok true)
    )
)

(define-public (update-mint-price (new-mint-price uint))
    (begin
        (asserts! (is-eq (var-get administrator) tx-sender) not-allowed)
        (var-set mint-price new-mint-price)
        (ok true)
    )
)

(define-public (mint-token (asset-hash (buff 32)))
    (begin
        (asserts! (> (stx-get-balance tx-sender) (var-get mint-price)) failed-to-mint-err)
        (as-contract
            (stx-transfer? (var-get mint-price) tx-sender (var-get administrator))) ;; transfer stx if there is enough to pay for mint, otherwith throws an error
        (nft-mint? my-nft (var-get mint-counter) tx-sender)
        (map-insert my-nft-data ((nft-index (var-get mint-counter))) ((asset-hash asset-hash) (date block-height)))
        (map-insert my-nft-lookup ((asset-hash asset-hash)) ((nft-index (var-get mint-counter))))
        (var-set mint-counter (+ (var-get mint-counter) u1))
        (ok (var-get mint-counter))
    )
)

;; (define-public (set-sale-data1 (asset-hash (buff 32)) (sale-type uint) (increment-stx uint) (reserve-stx uint) (amount-stx uint) (bidding-end-time uint))
;;     (match (map-get? my-nft-lookup ((asset-hash asset-hash)))
;;         myIndex
;;         (if
;;             (try! (is-nft-owner (get nft-index myIndex)))
;;             (ok (map-insert sale-data {nft-index: (get nft-index myIndex)} ((sale-type sale-type) (increment-stx increment-stx) (reserve-stx reserve-stx) (amount-stx amount-stx) (bidding-end-time bidding-end-time))))
;;             not-allowed
;;         )
;;         not-found
;;     )
;; )

(define-public (set-sale-data (asset-hash (buff 32)) (sale-type uint) (increment-stx uint) (reserve-stx uint) (amount-stx uint) (bidding-end-time uint))
    (let
        (
            (myIndex (unwrap! (get nft-index (map-get? my-nft-lookup ((asset-hash asset-hash)))) not-found))
        )
        (if
            (is-ok (is-nft-owner myIndex))
            (if (map-insert sale-data {nft-index: myIndex} ((sale-type sale-type) (increment-stx increment-stx) (reserve-stx reserve-stx) (amount-stx amount-stx) (bidding-end-time bidding-end-time)))
                (ok myIndex) not-allowed
            )
            not-allowed
        )
    )
)

;; transfer - differs from blockstack nft contract in that the tx-sender is the recipient
;; of the asset rather than the owner.
;; tx-sender / buyer transfers 'platform-fee'% of the buy now amount to the
;; contract miner-address remainder to the seller address. Reset the
;; map data in sale-data and my-nft data to indicate not for sale and BNS
;; name of new owner.
;; Errors
;;   - amount-not-set (u4) if the nft has no price set in sale data
;;   - same-spender-err (u5) if seller tries to buy their own asset
;;   - seller-not-found (u5) if the NFT has no owner
(define-public (transfer-from (seller principal) (buyer principal) (nft-index uint))
    (let
        (
            (amount (get amount-stx (map-get? sale-data {nft-index: nft-index})))
            (seller1 (nft-get-owner? my-nft nft-index))
            (ahash (get asset-hash (map-get? my-nft-data {nft-index: nft-index})))
        )
        (asserts! (is-some amount) amount-not-set)
        (asserts! (is-eq seller1 (some tx-sender)) same-spender-err)
        (asserts! (not (is-eq (unwrap! seller1 seller-not-found) seller)) seller-not-found)
        (map-set my-nft-data { nft-index: nft-index } { asset-hash: (unwrap! ahash not-found), date: block-height })
        (map-set sale-data { nft-index: nft-index } { amount-stx: u0, bidding-end-time: u0, increment-stx: u0, reserve-stx: u0, sale-type: u0 })
        (stx-transfer? (/ (* (unwrap! amount amount-not-set) (var-get platform-fee)) u100) tx-sender (as-contract tx-sender))
        (stx-transfer? (/ (* (unwrap! amount amount-not-set) (- u100 (var-get platform-fee))) u100) tx-sender (unwrap! seller1 seller-not-found))
        (if
            (is-ok (nft-transfer? my-nft nft-index (unwrap! seller1 seller-not-found) tx-sender))
            (ok u0) (err u1)
        )
    )
)

;; Transfers tokens to a specified principal.
(define-public (transfer (seller principal) (nft-index uint))
    (if (is-ok (transfer-from seller tx-sender nft-index))
        (ok u0) (err u1)
    )
)

;; not yet implemented
(define-public (balance-of (recipient principal))
  (if (is-eq tx-sender recipient)
      (ok u0)
      (err u1)
  )
)

;; read only methods
;; ---------------
(define-read-only (get-administrator)
    (var-get administrator))

(define-read-only (is-administrator)
    (ok (is-eq (var-get administrator) tx-sender)))

(define-read-only (get-base-token-uri)
    (var-get base-token-uri))

(define-read-only (get-mint-counter)
  (ok (var-get mint-counter))
)

(define-read-only (get-mint-price)
    (var-get mint-price))

(define-read-only (get-token-info (nft-index uint))
    (map-get? my-nft-data ((nft-index nft-index)))
)

(define-read-only (get-index (asset-hash (buff 32)))
    (match (map-get? my-nft-lookup ((asset-hash asset-hash)))
        myIndex
        (ok (get nft-index myIndex))
        not-found
    )
)

(define-read-only (get-sale-data (nft-index uint))
    (match (map-get? sale-data ((nft-index nft-index)))
        mySaleData
        (ok mySaleData)
        not-found
    )
)

(define-read-only (get-token-name)
    (ok token-name)
)

(define-read-only (get-token-symbol)
    (ok token-symbol)
)

;; private methods
;; ---------------
(define-private (is-nft-owner (nft-index uint))
    (if (is-eq (some tx-sender) (nft-get-owner? my-nft nft-index))
        (ok true)
        not-allowed
    )
)
`
    }
  },
  watch: {
    /**
    params: {
      handler () {
        this.showStep2 = this.params.contractName && this.params.contractAddress
      },
      deep: true
    }
    **/
  },
  mounted () {
    this.projectId = this.$route.params.projectId
    this.$store.dispatch('stacksStore/fetchMacsWalletInfo')
    this.$store.dispatch('applicationStore/lookupApplications')
    this.$store.dispatch('projectStore/findProjectByProjectId', this.projectId).then((project) => {
      if (!project) {
        this.$router.push('/404')
        return
      }
      this.project = project
      this.loaded = true
    })
  },
  methods: {
    useProject: function () {
      this.params.tokenName = this.project.projectId.split('.')[1]
    },
    usePlatformAddress: function () {
      const mac = this.$store.getters[APP_CONSTANTS.KEY_MACS_WALLET]
      this.params.platformAddress = (mac && mac.keyInfo && mac.keyInfo.address) ? mac.keyInfo.address : ''
    },
    useMyAddress: function () {
      this.params.contractOwner = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
    },
    useMacsAddress: function () {
      const mac = this.$store.getters[APP_CONSTANTS.KEY_MACS_WALLET]
      this.params.contractOwner = (mac && mac.keyInfo && mac.keyInfo.address) ? mac.keyInfo.address : ''
    },
    validate: function () {
      let result = true
      const mp = Number(this.params.mintPrice)
      if (!this.params.mintPrice || isNaN(mp) || mp < 10000 || mp > 100000000) {
        this.$notify({ type: 'error', title: 'Project Details', text: 'Please enter the mint price of your tokens (in micro stacks) between 0.001 and 100 stx' })
        result = false
      }
      if (!this.params.callBack || !this.params.callBack.startsWith('https://')) {
        this.$notify({ type: 'error', title: 'Project Details', text: 'Please enter a secure (https) callback url for your tokens - we append the asset hash to retrieve meta data.' })
        result = false
      }
      let tokenUrl
      try {
        tokenUrl = new URL(this.params.callBack)
        this.tokenUrl = tokenUrl
      } catch (e) {
        tokenUrl = ''
        result = false
      }
      return result
    },
    /**
    verifyContract: function () {
      if (!this.validate()) return
      let rep1 = '<span class="text-danger bg-white">' + this.params.contractOwner + '</span>'
      this.contractSourceDisplay = this.contractSource.replaceAll('params.contractOwner', rep1)
      rep1 = '<span class="text-danger bg-white">' + this.params.mintPrice + '</span>'
      this.contractSourceDisplay = this.contractSourceDisplay.replaceAll('params.mintPrice', rep1)
      rep1 = '<span class="text-danger bg-white">' + this.params.callBack + '</span>'
      this.contractSourceDisplay = this.contractSourceDisplay.replaceAll('params.callBack', rep1)
      // this.showContract = !this.showContract
    },
    **/
    deployContract: function () {
      if (!this.validate()) {
        return
      }
      // contractName = this.this.files[0].name.split(/\./)[1]
      const projectPlus = this.project
      let source = this.contractSource.replaceAll('params.contractOwner', this.params.contractOwner)
      source = source.replaceAll('params.token-name', this.params.tokenName)
      source = source.replaceAll('params.token-symbol', this.params.tokenSymbol)
      source = source.replaceAll('params.mintPrice', this.params.mintPrice)
      source = source.replaceAll('params.platformAddress', this.params.platformAddress)
      source = source.replaceAll('params.callBack', utils.stringToHex(this.params.callBack))
      projectPlus.codeBody = source
      this.$store.commit('setModalMessage', 'Processing request..')
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.showWaitingModal = true
      this.$store.dispatch('stacksStore/deployProjectContract', projectPlus).then((project) => {
        this.deployedProject = project
        this.$root.$emit('bv::hide::modal', 'waiting-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
        this.$store.commit('setModalMessage', 'Contract has been deployed to Stacks blockchain.')
      }).catch((error) => {
        this.result = error
        this.$store.commit('setModalMessage', 'There was an error deploying the contract.')
        // this.showWaitingModal = false
      })
    }
  },
  computed: {
    contractAddressUser () {
      return this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
    },
    contractSourceDisplay () {
      let rep1 = '<span class="text-danger bg-white">' + this.params.contractOwner + '</span>'
      let contractSourceDisplay = this.contractSource.replaceAll('params.contractOwner', rep1)
      rep1 = '<span class="text-danger bg-white">' + this.params.tokenName + '</span>'
      contractSourceDisplay = contractSourceDisplay.replaceAll('params.tokenName', rep1)
      rep1 = '<span class="text-danger bg-white">' + this.params.tokenSymbol + '</span>'
      contractSourceDisplay = contractSourceDisplay.replaceAll('params.tokenSymbol', rep1)
      rep1 = '<span class="text-danger bg-white">' + this.params.mintPrice + '</span>'
      contractSourceDisplay = contractSourceDisplay.replaceAll('params.mintPrice', rep1)
      rep1 = '<span class="text-danger bg-white">' + this.params.platformAddress + '</span>'
      contractSourceDisplay = contractSourceDisplay.replaceAll('params.platformAddress', rep1)
      rep1 = '<span class="text-danger bg-white">' + utils.stringToHex(this.params.callBack) + '</span>'
      contractSourceDisplay = contractSourceDisplay.replaceAll('params.callBack', rep1)
      return contractSourceDisplay
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
