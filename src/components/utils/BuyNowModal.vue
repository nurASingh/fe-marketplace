<template>
  <b-modal id="buy-now-modal">
    <b-container class="text-white" fluid v-if="clarityAsset">
      <div class="row mt-5">
        <div class="col-12">
          <div class="text-17-500 text-white">
            Transfering: {{asset.title}}
          </div>
          <div class="mt-3 text-11-500 text-left text-white">
            From: {{asset.owner}} [{{clarityAsset.owner}}]
          </div>
          <div class="mt-3 text-11-500 text-left text-white">
            To {{profile.username}}
          </div>
        </div>
      </div>
      <div class="row mt-5 mx-5">
        <div class="col-12">
          <div class="bb d-flex justify-content-between">
            <div>
              <span class="text-stx mt-2">Price</span>
            </div>
            <div>
              <span class="text-stx mr-3">STX</span><span class="text-price">{{buyingPrice()}}</span>
            </div>
          </div>
          <div class="d-flex justify-content-end">
            <div>
              <p class="mt-2">&asymp; {{rate}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-5" v-if="walletMode === 'risidio'">
        <div class="col-12">
          <div class="text1 text-white">
            <b-form-checkbox @change="changeWalletMode()" name="check-button" switch>
              <span v-if="useWallet === 'mac'">Wallet 1 ({{stxAddressMac}})</span>
              <span v-else>Wallet 2 ({{stxAddressSky}})</span>
            </b-form-checkbox>
          </div>
        </div>
      </div>
      <div class="row mt-5 mx-5">
        <div class="mt-5 col-12">
          <div class="mb-2 flex-fill d-flex justify-content-center">
            <b-button @click="buyNow()" style="min-width: 50%; min-height: 50px;" variant="info">Confirm Buy Now</b-button>
          </div>
        </div>
      </div>
    </b-container>
    <b-container class="text-white" fluid v-else>
      <div class="w-100 text-center mt-5">
        <b-icon icon="circle-fill" animation="throb" variant="light" font-scale="8"></b-icon>
      </div>
      <div class="mt-5 w-100">
        <p class="footer-text text-white text-center">{{modalMessage}}</p>
      </div>
    </b-container>
    <template #modal-footer class="text-center">
      <div class="w-100">
      </div>
    </template>
  </b-modal>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'WaitingModal',
  components: {
  },
  props: ['assetHash'],
  data () {
    return {
      loading: true,
      clarityAsset: null,
      useWallet: 'mac'
    }
  },
  mounted () {
    const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
    const appData = {
      application: {
        contractId: asset.projectId
      },
      index: asset.nftIndex
    }
    this.$store.dispatch('applicationStore/lookupMintedAssets', appData).then((clarityAsset) => {
      this.clarityAsset = clarityAsset
      this.loading = false
    })
  },
  methods: {
    changeWalletMode () {
      if (this.useWallet === 'mac') {
        this.useWallet = 'sky'
      } else {
        this.useWallet = 'mac'
      }
    },
    buyingPrice () {
      if (this.clarityAsset.tradeInfo) {
        return this.$store.getters[APP_CONSTANTS.KEY_STX_AMOUNT](this.clarityAsset.tradeInfo.buyNowOrStartingPrice)
      }
      return 0
    },
    isOwner () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return asset.owner === profile.username
    },
    buyNow () {
      this.$emit('confirm-buy-now', { useWallet: this.useWallet })
    }
  },
  computed: {
    walletMode () {
      const walletMode = this.$store.getters[APP_CONSTANTS.KEY_WALLET_MODE]
      return walletMode
    },
    stxAddressMac () {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_MACS_WALLET]
      if (wallet.keyInfo) {
        return wallet.keyInfo.address
      }
      if (wallet && wallet.keyInfo.address) {
        return wallet.keyInfo.address.substring(0, 5) + '...' + wallet.keyInfo.address.substring(wallet.keyInfo.address.length - 5)
      }
      return 'n/a'
    },
    stxAddressSky () {
      const wallet = this.$store.getters[APP_CONSTANTS.KEY_SKYS_WALLET]
      if (wallet.keyInfo) {
        return wallet.keyInfo.address
      }
      if (wallet && wallet.keyInfo.address) {
        return wallet.keyInfo.address.substring(0, 5) + '...' + wallet.keyInfo.address.substring(wallet.keyInfo.address.length - 5)
      }
      return 'n/a'
    },
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    rate () {
      if (this.clarityAsset.tradeInfo) {
        return this.$store.getters[APP_CONSTANTS.KEY_EXCHANGE_RATE](this.clarityAsset.tradeInfo.buyNowOrStartingPrice)
      }
      return 0
    },
    asset () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      return asset
    },
    modalMessage () {
      return 'Looking up asset on blockchain...'
    }
  }
}
</script>
<style lang="scss" >
</style>
