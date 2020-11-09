<template>
<div class="row">
  <side-menu class="col-3 mr-0 pr-0 pt-5"/>
  <div class="col-9 pt-5 admin-app" v-if="loaded">
    <title-bar class="container" v-on="$listeners"/>
    <div class="container" @click="$emit('toggle-off-navbar')">
      <h1>Deploy Contract</h1>
      <p class="mb-4">Contract id: {{projectId}} <router-link class="mr-3" :to="'/connect-app/' + projectId"><b-icon icon="pencil"/></router-link></p>
      <div class="row">
        <div class="col-4">
          <b-form>
            <div class="">
              <div class="">
                <div class="mb-2 d-flex justify-content-between">
                  <div>Token Name</div>
                  <div><a href="#" class="mr-1" @click.prevent="useProject()">use project name</a></div>
                </div>
                <b-input v-model="params.token"></b-input>
                <div class="mb-2 d-flex justify-content-between">
                  <div>Contract Owner</div>
                  <div><a href="#" class="mr-1" @click.prevent="useMyAddress()">mine</a> <a class="text-info" href="#" @click.prevent="useMacsAddress()">macs</a></div>
                </div>
                <b-input v-model="params.contractOwner"></b-input>
                </div>
                <div class="mb-2">
                  <div class="mb-2">Mint Price (micro stacks)</div>
                  <b-input v-model="params.mintPrice"></b-input>
                </div>
                <div class="mb-2">
                  <div class="mb-2">Base URI</div>
                  <b-input v-model="params.callBack"></b-input>
                  <div class="mt-2 d-flex justify-content-end">
                    <a href="#" class="wallet-use text-white"><span class="text-light">
                      Provide your own callback or use our stateless open source search index
                      to store and retrieve asset meta data.
                      To add a record to our search index post an indexable model to:
                      http://api.risidio.local/index/addRecord see our <a href="https://github.com/radicleart/ms-search" target="_blank">github repo</a> for more details.
                      To retrieve a record (given the asset hash) get from
                      https://api.risidio.com/index/v1/asset/:asset-hash</span></a>
                  </div>
                </div>
                <p>Please check your contract carefully - click deploy when happy</p>
                <div class="my-3">
                  <b-button variant="info" class="btn-lg mr-3" style="text-transform: capitalize; font-size: 14px;" @click.prevent="deployContract()">Deploy Contract</b-button>
                  <b-button variant="danger" class="btn-lg" style="text-transform: capitalize; font-size: 14px;" to="/admin-app">Back</b-button>
                </div>
              </div>
          </b-form>
        </div>
          <div class="col-8">
            <h6>Template</h6>
            <standard-application-contract :contractSourceDisplay="contractSourceDisplay"/>
          </div>
        </div>
    </div>
  </div>
  <b-modal scrollable id="modal-1" title="Contract Deployed">
    <div class="row" v-if="deployedProject">
      <div class="col-12 my-1">
        <div class="mb-3">Deployed {{deployedProject.projectId}}</div>
        <div class="mb-3">Tx: {{deployedProject.txId}}</div>
      </div>
    </div>
  </b-modal>
  <b-modal id="modal-err" title="Contract Not Deployed">
    <div class="row">
      <div class="col-12 my-1">
        <div class="mb-3">Error: {{result}}</div>
      </div>
    </div>
  </b-modal>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import StandardApplicationContract from '@/components/admin/StandardApplicationContract'
import SideMenu from '@/components/admin/SideMenu'
import TitleBar from '@/components/admin/TitleBar'
import utils from '@/services/utils'

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
      project: null,
      showContract: false,
      loaded: false,
      nonce: 0,
      showStep2: false,
      tokenUrl: null,
      deployedProject: null,
      result: null,
      params: {
        mintPrice: '100000',
        token: null,
        contractName: null,
        contractOwner: 'stacks-address',
        callBack: 'https://loopbomb.risidio.com/nft/v1/assets/'
      },
      // contractSourceDisplay: null,
      contractSource: `
;; data structures
;; ---------------
(define-non-fungible-token params.token uint)
(define-map params.token-data ((index uint)) ((owner (buff 80)) (asset-hash (buff 32)) (date uint)))
(define-map params.token-lookup ((asset-hash (buff 32))) ((index uint)))

(define-data-var administrator principal 'params.contractOwner)
(define-data-var mint-price uint uparams.mintPrice)
(define-data-var base-token-uri (buff 100) params.callBack)
(define-data-var mint-counter uint u0) ;; tracks nft creation

;; public methods
;; --------------
(define-public (transfer-administrator (new-administrator principal))
    (begin
        (asserts! (is-eq (var-get administrator) tx-sender) (err 1))
        (var-set administrator new-administrator)
        (ok true)))

(define-public (update-base-token-uri (new-base-token-uri (buff 100)))
    (begin
        (asserts! (is-eq (var-get administrator) tx-sender) (err 1))
        (var-set base-token-uri new-base-token-uri)
        (ok true)))

(define-public (update-mint-price (new-mint-price uint))
    (begin
        (asserts! (is-eq (var-get administrator) tx-sender) (err 1))
        (var-set mint-price new-mint-price)
        (ok true)))

(define-public (mint-token (asset-hash (buff 32)) (owner (buff 80)))
    (begin
        (asserts! (> (stx-get-balance tx-sender) (var-get mint-price)) (err 2))
        (as-contract
            (stx-transfer? (var-get mint-price) tx-sender (var-get administrator))) ;; transfer stx if there is enough to pay for mint, otherwith throws an error
        (nft-mint? params.token (var-get mint-counter) tx-sender)
        (map-insert params.token-data ((index (var-get mint-counter))) ((owner owner) (asset-hash asset-hash) (date block-height)))
        (map-insert params.token-lookup ((asset-hash asset-hash)) ((index (var-get mint-counter))))
        (var-set mint-counter (+ (var-get mint-counter) u1))
        (ok (var-get mint-counter))))

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

(define-read-only (get-token-info (index uint))
    (map-get? params.token-data ((index index))))

(define-read-only (get-index (asset-hash (buff 32)))
    (map-get? params.token-lookup ((asset-hash asset-hash))))

;; private methods
;; ---------------
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
      this.params.token = this.project.projectId.split('.')[1]
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
      source = source.replaceAll('params.token', this.params.token)
      source = source.replaceAll('params.mintPrice', this.params.mintPrice)
      source = source.replaceAll('params.callBack', utils.stringToHex(this.params.callBack))
      projectPlus.codeBody = source
      this.$store.dispatch('stacksStore/deployProjectContract', projectPlus).then((project) => {
        this.deployedProject = project
        this.$bvModal.show('modal-1')
      }).catch((error) => {
        this.result = error
        this.$bvModal.show('modal-err')
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
      rep1 = '<span class="text-danger bg-white">' + this.params.token + '</span>'
      contractSourceDisplay = contractSourceDisplay.replaceAll('params.token', rep1)
      rep1 = '<span class="text-danger bg-white">' + this.params.mintPrice + '</span>'
      contractSourceDisplay = contractSourceDisplay.replaceAll('params.mintPrice', rep1)
      rep1 = '<span class="text-danger bg-white">' + utils.stringToHex(this.params.callBack) + '</span>'
      contractSourceDisplay = contractSourceDisplay.replaceAll('params.callBack', rep1)
      return contractSourceDisplay
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
