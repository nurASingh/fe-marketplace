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
        tokenName: 'tokenName',
        tokenSymbol: 'tokenSymbol',
        mintPrice: '100000',
        contractName: null,
        contractOwner: 'stacks-address',
        callBack: 'https://loopbomb.risidio.com/index/v1/asset/'
      },
      // contractSourceDisplay: null,
      contractSource: `
;; Interface definitions
;; (impl-trait 'ST1ESYCGJB5Z5NBHS39XPC70PGC14WAQK5XXNQYDW.nft-interface.transferable-nft-trait)
(impl-trait 'params.platformAddress.nft-interface.tradable-nft-trait)

;; Non Fungible Token, modeled after ERC-721 via transferable-nft-trait
;; Note this is a basic implementation - no support yet for setting approvals for assets
;; NFT are identified by nft-index (uint) which is tied via a reverse lookup to a real world
;; asset hash - SHA 256 32 byte value. The Asset Hash is used to tie arbitrary real world
;; data to the NFT
(define-non-fungible-token my-nft uint)

;; data structures
(define-map my-nft-data ((nft-index uint)) ((asset-hash (buff 32)) (max-editions uint) (edition uint) (date uint) (series-original uint)))
(define-map my-nft-edition-pointer ((nft-index uint)) ((current-edition uint)))
(define-map sale-data ((nft-index uint)) ((sale-type uint) (increment-stx uint) (reserve-stx uint) (amount-stx uint) (bidding-end-time uint)))
(define-map beneficiaries ((nft-index uint)) ((royalties (list 10 { address: principal, amount: uint}))))
(define-map my-nft-lookup ((asset-hash (buff 32)) (edition uint)) ((nft-index uint)))
(define-map transfer-map ((nft-index uint)) ((transfer-count uint)))
(define-map transfer-history-map ((nft-index uint) (transfer-count uint)) ((from principal) (to principal) (sale-type uint) (when uint) (amount uint)))

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
(define-constant asset-not-registered (err u14))
(define-constant transfer-error (err u15))
(define-constant not-approved-to-sell (err u16))

(define-constant same-spender-err (err u17))
(define-constant failed-to-mint-err (err u18))

;; public methods
;; --------------
;; the contract administrator can change the contract administrator
(define-public (transfer-administrator (new-administrator principal))
    (begin
        (asserts! (is-eq (var-get administrator) tx-sender) not-allowed)
        (var-set administrator new-administrator)
        (ok true)
    )
)

;; the contract administrator can change the transfer fee charged by the contract on sale of tokens
(define-public (change-fee (new-fee uint))
    (begin
        (asserts! (is-eq (var-get administrator) tx-sender) not-allowed)
        (var-set platform-fee new-fee)
        (ok true)
    )
)

;; the contract administrator can change the base uri - where meta data for tokens in this contract
;; are located
(define-public (update-base-token-uri (new-base-token-uri (buff 100)))
    (begin
        (asserts! (is-eq (var-get administrator) tx-sender) not-allowed)
        (var-set base-token-uri new-base-token-uri)
        (ok true)
    )
)

;; the contract administrator can change the mint price
(define-public (update-mint-price (new-mint-price uint))
    (begin
        (asserts! (is-eq (var-get administrator) tx-sender) not-allowed)
        (var-set mint-price new-mint-price)
        (ok true)
    )
)

;; mint a new token
;; asset-hash: sha256 hash of asset file
;; max-editions: maximum number of editions allowed for this asset
;; royalties: a list of priciple/percentages to be be paid from sale price
;;
;; 1. transfer mint price to the administrator
;; 2. mint the token using built in mint function
;; 3. update the two maps - first contains the data indexed by the nft index, second
;; provides a reverse lookup based on the asset hash - this allows tokens to be located
;; from just a knowledge of the original asset.
;; Note series-original in the case of the original in series is just
;; mintCounter - for editions this provides a safety hook back to the original in cases
;; where the asset hash is unknown (ie cant be found from my-nft-lookup).
(define-public (mint-token (asset-hash (buff 32)) (max-editions uint) (royalties (list 10 {address: principal, amount: uint})))
    (let
        (
            (mintCounter (var-get mint-counter))
            (ahash (get asset-hash (map-get? my-nft-data {nft-index: (var-get mint-counter)})))
        )
        (asserts! (> (stx-get-balance tx-sender) (var-get mint-price)) failed-to-mint-err)
        (asserts! (is-none ahash) asset-not-registered)
        (as-contract
            (stx-transfer? (var-get mint-price) tx-sender (var-get administrator))) ;; transfer stx if there is enough to pay for mint, otherwith throws an error
        (map-insert my-nft-data ((nft-index mintCounter)) ((asset-hash asset-hash) (max-editions max-editions) (edition u0) (date block-height) (series-original mintCounter)))
        (map-insert my-nft-edition-pointer ((nft-index mintCounter)) ((current-edition u1)))
        (map-insert my-nft-lookup ((asset-hash asset-hash) (edition u0)) ((nft-index mintCounter)))
        (map-insert beneficiaries ((nft-index mintCounter)) ((royalties royalties)))
        ;; finally - mint the NFT and step the counter
        (nft-mint? my-nft mintCounter tx-sender)
        (var-set mint-counter (+ mintCounter u1))
        (ok mintCounter)
    )
)

;; Mint subsequent editions of the NFT
;; nft-index: the index of the original NFT in this series of editions.
;; The sale data must have been set on the asset before calling this.
;; The amount is split according to the royalties
(define-public (mint-edition (nft-index uint) (edition uint))
    (let
        (
            ;; before we start... check the hash corresponds to a minted asset
            (ahash (unwrap! (get asset-hash (map-get? my-nft-data {nft-index: nft-index})) failed-to-mint-err))
            (mintCounter (var-get mint-counter))
            (editionCounter (unwrap! (get current-edition (map-get? my-nft-edition-pointer {nft-index: nft-index})) failed-to-mint-err))
            (saleType (unwrap! (get sale-type (map-get? sale-data {nft-index: nft-index})) amount-not-set))
            (amount (unwrap! (get amount-stx (map-get? sale-data {nft-index: nft-index})) amount-not-set))
            (maxEditions (unwrap! (get max-editions (map-get? my-nft-data {nft-index: nft-index})) failed-to-mint-err))
        )
        (asserts! (or (is-eq saleType u1) (is-eq saleType u2)) not-approved-to-sell)
        (asserts! (is-none (get nft-index (map-get? my-nft-lookup ((asset-hash ahash) (edition edition))))) failed-to-mint-err)
        (asserts! (> edition u0) failed-to-mint-err)
        (asserts! (<= edition maxEditions) not-allowed)
        (asserts! (> (stx-get-balance tx-sender) amount) failed-to-mint-err)

        ;; set the current-edition pointer to next edition
        (map-set my-nft-edition-pointer ((nft-index nft-index)) ((current-edition (+ editionCounter u1))))

        ;; set max editions to zero and edition to current edition pointer to indicate this is an edition
        (map-insert my-nft-data ((nft-index mintCounter)) ((asset-hash ahash) (max-editions u0) (edition editionCounter) (date block-height) (series-original nft-index)))

        ;; put the nft index into the list of editions in the look up map
        (map-insert my-nft-lookup ((asset-hash ahash) (edition editionCounter)) ((nft-index mintCounter)))

        ;; mint the NFT and update the counter for the next..
        (nft-mint? my-nft mintCounter tx-sender)
        (var-set mint-counter (+ mintCounter u1))

        ;; finally send the payments - or roll everything back.
        (if (is-ok (payment-split nft-index))
            (ok mintCounter) not-allowed
        )
    )
)

;; set-sale-data updates the sale type and purchase info for a given NFT. Only the owner can call this method
;; and doing so make the asset transferable by the recipient - on condition of meeting the conditions of sale
;; This is equivalent to the setApprovalForAll method in ERC 721 contracts.
(define-public (set-sale-data (myIndex uint) (sale-type uint) (increment-stx uint) (reserve-stx uint) (amount-stx uint) (bidding-end-time uint))
    (begin
        (if
            (is-ok (is-nft-owner myIndex))
            (if (map-set sale-data {nft-index: myIndex} ((sale-type sale-type) (increment-stx increment-stx) (reserve-stx reserve-stx) (amount-stx amount-stx) (bidding-end-time bidding-end-time)))
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
(define-public (transfer-from (nft-index uint))
    (let
        (
            (saleType (unwrap! (get sale-type (map-get? sale-data {nft-index: nft-index})) amount-not-set))
            (amount (unwrap! (get amount-stx (map-get? sale-data {nft-index: nft-index})) amount-not-set))
            (owner (unwrap! (nft-get-owner? my-nft nft-index) seller-not-found))
            (ahash (get asset-hash (map-get? my-nft-data {nft-index: nft-index})))
            (platformFee (var-get platform-fee))
        )
        (asserts! (is-some ahash) asset-not-registered)
        (asserts! (is-eq saleType u1) not-approved-to-sell)
        (asserts! (> amount u0) amount-not-set)
        (let ((count (inc-transfer-count nft-index)))
            (add-transfer nft-index (- count u1) owner tx-sender saleType u0 amount)
        )
        ;; (map-set my-nft-data { nft-index: nft-index } { asset-hash: (unwrap! ahash not-found),  edition: edition, date: block-height, series-original: nft-index })
        (map-set sale-data { nft-index: nft-index } { amount-stx: u0, bidding-end-time: u0, increment-stx: u0, reserve-stx: u0, sale-type: u0 })
        (stx-transfer? (/ (* amount platformFee) u100) tx-sender (var-get administrator))
        (stx-transfer? (/ (* amount (- u100 platformFee)) u100) tx-sender owner)
        (nft-transfer? my-nft nft-index owner tx-sender)
    )
)

;; Transfers tokens to a specified principal.
(define-public (transfer (seller principal) (nft-index uint))
    (if (is-ok (transfer-from nft-index))
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

(define-read-only (get-token-info-full (nft-index uint))
    (let
        (
            (the-token-info (map-get? my-nft-data ((nft-index nft-index))))
            (the-sale-data (map-get? sale-data ((nft-index nft-index))))
            (the-owner (unwrap-panic (nft-get-owner? my-nft nft-index)))
            (the-tx-count (default-to u0 (get transfer-count (map-get? transfer-map (tuple (nft-index nft-index))))))
        )
        (ok (tuple (token-info the-token-info) (sale-data the-sale-data) (owner the-owner) (transfer-count the-tx-count)))
    )
)

(define-read-only (get-index (asset-hash (buff 32)))
    (match (map-get? my-nft-lookup ((asset-hash asset-hash) (edition u0)))
        indices
        (ok (get nft-index indices))
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

(define-read-only (get-transfer-count (nft-index uint))
    (let
        (
            (count (default-to u0 (get transfer-count (map-get? transfer-map (tuple (nft-index nft-index))))))
        )
        (ok count)
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
(define-private (payment-split (nft-index uint))
    (let
        (
            (royalties (unwrap! (get royalties (map-get? beneficiaries {nft-index: nft-index})) failed-to-mint-err))
            (numbRoyalties (len (unwrap! (get royalties (map-get? beneficiaries {nft-index: nft-index})) failed-to-mint-err)))
            (saleType (unwrap! (get sale-type (map-get? sale-data {nft-index: nft-index})) amount-not-set))
            (amount (unwrap! (get amount-stx (map-get? sale-data {nft-index: nft-index})) amount-not-set))
            (owner (unwrap! (nft-get-owner? my-nft nft-index) seller-not-found))
            (platformFee (var-get platform-fee))
        )
        (asserts! (or (is-eq saleType u1) (is-eq saleType u2)) not-approved-to-sell)
        (asserts! (> (stx-get-balance tx-sender) amount) failed-to-mint-err)

        (stx-transfer? (/ (* amount platformFee) u100) tx-sender (var-get administrator))
        (stx-transfer? (/ (* amount (- u100 platformFee)) u100) tx-sender owner)
        (ok true)
    )
)

(define-private (is-nft-owner (nft-index uint))
    (if (is-eq (some tx-sender) (nft-get-owner? my-nft nft-index))
        (ok true)
        not-allowed
    )
)

(define-private (inc-transfer-count (nft-index uint))
    (let
        (
            (count (default-to u0 (get transfer-count (map-get? transfer-map (tuple (nft-index nft-index))))))
        )
        (begin
            (map-insert transfer-map { nft-index: nft-index } { transfer-count: count})
            (+ count u1)
        )
    )
)

(define-private (add-transfer (nft-index uint) (transfer-count uint) (from principal) (to principal) (sale-type uint) (when uint) (amount uint))
  (if (is-eq to tx-sender)
    (ok (map-insert transfer-history-map {nft-index: nft-index, transfer-count: transfer-count} ((from from) (to to) (sale-type sale-type) (when when) (amount amount))))
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
      if (!this.params.tokenName || this.params.tokenName.indexOf('token') > -1) {
        this.$notify({ type: 'error', title: 'Token Name', text: 'Please enter a descriptive name.' })
        result = false
      }
      if (!this.params.tokenSymbol || this.params.tokenSymbol.indexOf('token') > -1) {
        this.$notify({ type: 'error', title: 'Token Symbol', text: 'Please enter a symbol for your token - convention is 3 or 4 uppercase letters or digits.' })
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
      this.project.projectId = this.params.contractOwner + '.' + this.params.tokenName
      const projectPlus = this.project
      let source = this.contractSource.replaceAll('params.contractOwner', this.params.contractOwner)
      source = source.replaceAll('params.tokenName', this.params.tokenName)
      source = source.replaceAll('params.tokenSymbol', this.params.tokenSymbol)
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
