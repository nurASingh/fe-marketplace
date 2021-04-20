<template>
  <b-modal id="buy-now-modal">
    <b-container class="" fluid v-if="clarityAsset">
      <div class="row mt-5">
        <div class="col-12">
          <div class="text-17-500 ">
            Transfering: {{asset.name}}
          </div>
          <div class="mt-3 text-11-500 text-left ">
            From: {{asset.owner}} [{{clarityAsset.owner}}]
          </div>
          <div class="mt-3 text-11-500 text-left">
            To {{profile.username}}
          </div>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-12">
          <div class="bb d-flex justify-content-between">
            <div>
              <p class="mt-2">Price</p>
            </div>
            <div>
              <span class="text-stx mr-3">STX</span><span class="text-price text-secondary">{{buyingPrice()}}</span>
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
          <div class="text1 ">
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
    <b-container class="" fluid v-else>
      <div class="w-100 text-center mt-5">
        <b-icon icon="circle-fill" animation="throb" variant="light" font-scale="6"></b-icon>
      </div>
      <div class="mt-5 w-100">
        <p class="footer-text  text-center">{{modalMessage}}</p>
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
  methods: {
    changeWalletMode () {
      if (this.useWallet === 'mac') {
        this.useWallet = 'sky'
      } else {
        this.useWallet = 'mac'
      }
    },
    buyingPrice () {
      const token = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      if (token.saleData) {
        return this.$store.getters[APP_CONSTANTS.KEY_STX_AMOUNT](token.saleData.buyNowOrStartingPrice)
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
      const token = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      if (token.saleData) {
        return this.$store.getters[APP_CONSTANTS.KEY_EXCHANGE_RATE](token.saleData.buyNowOrStartingPrice)
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
#buy-now-modal {
.modal-content {
  background-color: #fff !important;
  border-radius: 20px;
  min-height: 200px;
  color: #000;
}
.modal-header {
    border-bottom: 0px solid #fff;
  border-radius: 20px;
}
.modal-footer {
    border-top: 0px solid #fff;
  border-radius: 20px;
  padding: 0;
}
footer {
  height: 0px;
    background-color: #fff;
}
}
</style>
