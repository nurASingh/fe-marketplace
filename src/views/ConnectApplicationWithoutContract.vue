<template>
<div>
  <h1>Connect Your DC Application</h1>
  <b-form>
    <p>Step 1: Enter Contract Address</p>
    <div class="row">
      <div class="col-md-6 col-sm-12">
        <div class="mb-2">
          <div class="mb-2">Contract Address <a href="#" @click.prevent="useMyAddress()">(use my address)</a></div>
          <b-input v-model="params.contractAddress"></b-input>
        </div>
      </div>
      <div class="col-md-6 col-sm-12">
        <div class="mb-2">
          <div class="mb-2">Contract Name</div>
          <b-input v-model="params.contractName"></b-input>
        </div>
      </div>
    </div>
    <div class="mt-5" v-if="showStep2">
      <p>Step 2: Set Contract Parameters</p>
      <div class="row mt-4">
        <div class="col-md-6 col-sm-12">
          <div class="mb-2">
            <div class="mb-2">Contract Owner <a href="#" @click.prevent="useMyAddress()">(use my address)</a></div>
            <b-input v-model="params.contractOwner"></b-input>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="mb-2">
            <div class="mb-2">Mint Price (micro stacks)</div>
            <b-input v-model="params.mintPrice"></b-input>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
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
        </div>
      </div>
      <div>
        <p>Please check your contract carefully - click deploy when happy</p>
        <div class="my-3">
          <b-button variant="info" class="btn-lg mr-3" style="text-transform: capitalize; font-size: 14px;" @click.prevent="deployContract()">Deploy Contract</b-button>
          <b-button variant="danger" class="btn-lg" style="text-transform: capitalize; font-size: 14px;" to="/connect-app">Back</b-button>
        </div>
        <standard-application-contract :contractSourceDisplay="contractSourceDisplay"/>
      </div>
    </div>
  </b-form>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import StandardApplicationContract from '@/components/admin/StandardApplicationContract'

export default {
  name: 'ConnectApplicationWithoutContract',
  components: {
    StandardApplicationContract
  },
  data () {
    return {
      feeAmount: 3000,
      showContract: false,
      loading: true,
      nonce: 0,
      showStep2: false,
      params: {
        mintPrice: '100000',
        contractName: null,
        contractOwner: 'STGPPTWJEZ2YAA7XMPVZ7EGKH0WX9F2DBNHTG5EY',
        contractAddress: 'STGPPTWJEZ2YAA7XMPVZ7EGKH0WX9F2DBNHTG5EY',
        callBack: 'https://api.risidio.com/index/v1/asset/'
      },
      // contractSourceDisplay: null,
      contractSource: `
(define-data-var owner principal 'params.contractOwner)

(define-read-only (get-owner)
    (var-get owner))

(define-read-only (is-owner)
    (ok (is-eq (var-get owner) tx-sender)))

(define-read-only (only-owner)
    (if (is-eq (var-get owner) tx-sender) (ok none) (err 1)))

(define-public (transfer-ownership (new-owner principal))
    (begin
        (asserts! (is-eq (var-get owner) tx-sender) (err 1))
        (var-set owner new-owner)
        (ok true)))

;; data structures
(define-non-fungible-token tokens (buff 32)) ;; identifier is 256-bit hash of image
(define-data-var mint-price uint uparams.mintPrice)
(define-data-var base-token-uri (buff 100) params.callBack)
(define-map token-author-map ((token-id (buff 32))) ((author principal) (date uint))) ;; extra info about token related to the nft-token

(define-public (update-base-token-uri (new-base-token-uri (buff 100)))
    (begin
        (asserts! (is-eq (var-get owner) tx-sender) (err 1))
        (var-set base-token-uri new-base-token-uri)
        (ok true)))

(define-public (update-mint-price (new-mint-price uint))
    (begin
        (asserts! (is-eq (var-get owner) tx-sender) (err 1))
        (var-set mint-price new-mint-price)
        (ok true)))

(define-read-only (get-base-token-uri)
    (var-get base-token-uri))

(define-read-only (get-mint-price)
    (var-get mint-price))

(define-read-only (get-token-uri (token-id (buff 32)))
    (concat (var-get base-token-uri) token-id))

(define-read-only (get-token-info (token-id (buff 32)))
    (map-get? token-author-map ((token-id token-id))))

(define-public (create (token-id (buff 32)))
    (begin
        (as-contract
            (stx-transfer? (var-get mint-price) tx-sender (var-get owner))) ;; transfer stx if there is enough to pay for mint, otherwith throws an error
        (nft-mint? tokens token-id tx-sender) ;; fails if token has been minted before
        (map-insert token-author-map ((token-id token-id)) ((author tx-sender) (date block-height)))
        (ok true)))
`
    }
  },
  watch: {
    params: {
      handler () {
        this.showStep2 = this.params.contractName && this.params.contractAddress
      },
      deep: true
    }
  },
  mounted () {
    // this.params.contractOwner = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
    // this.params.contractAddress = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
  },
  methods: {
    useMyAddress: function () {
      this.params.contractAddress = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
    },
    validate: function () {
      let result = true
      if (!this.params.contractAddress) {
        this.$notify({ type: 'error', title: 'Project Details', text: 'Please enter the contract address of your contract' })
        result = false
      }
      if (!this.params.contractName) {
        this.$notify({ type: 'error', title: 'Project Details', text: 'Please enter the contract name of your contract' })
        result = false
      }
      if (!this.params.mintPrice) {
        this.$notify({ type: 'error', title: 'Project Details', text: 'Please enter the mint price of your tokens (in micro stacks)' })
        result = false
      }
      if (!this.params.callBack) {
        this.$notify({ type: 'error', title: 'Project Details', text: 'Please enter the callback url for your tokens - we append the asset hash to retrieve meta data.' })
        result = false
      }
      return result
    },
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
    deployContract: function () {
      let source = this.contractSource.replaceAll('params.contractOwner', this.params.contractOwner)
      source = source.replaceAll('params.mintPrice', this.params.mintPrice)
      source = source.replaceAll('params.callBack', this.params.callBack)
      const data = {
        contractName: this.params.contractName,
        codeBody: source
      }

      if (!this.validate()) {
        return
      }

      data.fee = this.feeAmount
      data.eventCode = 'connect-deploy-contract'
      // this.$emit('updateEventCode', data)
      // this.$store.dispatch('authStore/deployContractBlockstack', data)
    }
  },
  computed: {
    contractAddressUser () {
      return this.$store.getters[APP_CONSTANTS.KEY_PROFILE].stxAddress
    },
    contractSourceDisplay () {
      if (!this.validate()) return
      let rep1 = '<span class="text-danger bg-white">' + this.params.contractOwner + '</span>'
      let contractSourceDisplay = this.contractSource.replaceAll('params.contractOwner', rep1)
      rep1 = '<span class="text-danger bg-white">' + this.params.mintPrice + '</span>'
      contractSourceDisplay = contractSourceDisplay.replaceAll('params.mintPrice', rep1)
      rep1 = '<span class="text-danger bg-white">' + this.params.callBack + '</span>'
      contractSourceDisplay = contractSourceDisplay.replaceAll('params.callBack', rep1)
      return contractSourceDisplay
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
