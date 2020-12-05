<template>
<div class="container" v-if="asset" style="margin: 150px 0;">
  <div class="row">
    <div class="offset-md-2 col-md-4 col-sm-12 mb-4">
      <span><router-link class="text-info text-11-700" to="/marketplace"><b-icon class="mr-2" icon="caret-left-fill"/>Back</router-link></span>
    </div>
  </div>
  <div class="row">
    <div class="offset-md-2 col-md-4 col-sm-12">
      <div class="mb-4"><img :src="asset.assetUrl" class="img-responsive" width="100%"/></div>
      <div class="mb-4">
        <p class="mb-2 text-11-700">Description</p>
        <p class="mb-2 text-11-500">{{asset.description}}</p>
        <p class="mb-2 text-11-500">view on <a :href="projectUrl" target="_blank">{{projectName(asset.projectId)}} <b-icon icon="arrow-up-right-circle-fill"/></a></p>
      </div>
      <div class="mb-4">
        <p class="mb-2 text-11-500">Owned By</p>
        <p class="mb-2 text-11-500 text-info">{{asset.owner}}</p>
      </div>
    </div>

    <div class="col-md-6 col-sm-12">
      <div class="d-flex justify-content-between">
        <p class="text-40-300">{{asset.title}}</p>
        <p class="text-11-500 bg-secondary text-white text-center pt-2 mt-3" style="text-transform: capitalize; width: 80px; height: 32px;">{{saleType()}}</p>
      </div>
      <div class="mb-3" style="margin-top: -15px;">
        <p class="text1">By <span class="text2" @click="showStxAddress = ! showStxAddress">{{projectName(asset.projectId)}}</span></p>
        <p class="text1" v-if="showStxAddress">{{profile.stxAddress}}</p>
      </div>
      <div class="row" v-if="isOwner()">
        <div class="col-12 d-flex justify-content-end">
          <div>
            <p class="text2"><router-link :to="'/my-assets/' + asset.assetHash">manage your asset</router-link></p>
          </div>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-6">
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
        <div class="col-6" v-if="!isOwner() && isBuyNow()">
          <div class="mb-2 d-flex justify-content-center">
            <div class="flex-fill"><b-button @click="buyNow('mac')" style="min-width: 100%; min-height: 30px;" variant="info">Buy Now</b-button></div>
          </div>
        </div>
        <div class="col-6" v-if="isOwner()">
          <div class="mb-2 d-flex justify-content-center">
            <div v-if="isOwner()" class="flex-fill"><b-button :href="'/my-assets/' + asset.assetHash" style="min-width: 100%; min-height: 30px;" variant="info">manage your asset</b-button></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <buy-now-modal :assetHash="assetHash" @confirm-buy-now="confirmBuyNow"/>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import BuyNowModal from '@/components/utils/BuyNowModal'

export default {
  name: 'AssetDetails',
  components: {
    BuyNowModal
  },
  data () {
    return {
      assetHash: null,
      showStxAddress: false
    }
  },
  mounted () {
    this.loading = false
    this.assetHash = this.$route.params.assetHash
    this.$store.dispatch('searchStore/findAssetByHash', this.assetHash)
  },
  methods: {
    projectName (projectId) {
      return (projectId && projectId.indexOf('.') > -1) ? projectId.split('.')[1] : projectId
    },
    buyingPrice () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      const rate = this.$store.getters[APP_CONSTANTS.KEY_STX_AMOUNT](asset.tradeInfo.buyNowOrStartingPrice)
      return rate
    },
    isOwner () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return asset.owner === profile.username
    },
    isBuyNow () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      if (!asset.tradeInfo || !asset.tradeInfo.saleType === 1) return false
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.loggedIn && asset.tradeInfo.saleType === 1 && asset.tradeInfo.buyNowOrStartingPrice > 0
    },
    confirmBuyNow () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      this.$store.commit('setModalMessage', 'Thank You! <br/>Transferring asset now...')
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.$root.$emit('bv::hide::modal', 'buy-now-modal')
      const purchaseInfo = {
        buyer: profile.username,
        asset: asset
      }
      this.$store.dispatch('stacksStore/buyNow', purchaseInfo).then((result) => {
        this.result = result
        this.$store.commit('setModalMessage', 'Thank You! <br/>Transferring asset now...')
        this.$root.$emit('bv::hide::modal', 'waiting-modal')
        this.$root.$emit('bv::show::modal', 'success-modal')
      }).catch((error) => {
        this.$store.commit('setModalMessage', 'Something went wrong... ' + error)
        this.$root.$emit('bv::show::modal', 'waiting-modal')
      })
    },
    buyNow () {
      this.$root.$emit('bv::show::modal', 'buy-now-modal')
    },
    isPlaceBid () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      if (!asset.tradeInfo || !asset.tradeInfo.saleType === 2) return false
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.loggedIn && asset.tradeInfo.saleType === 2
    },
    saleType () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      if (asset.tradeInfo) {
        if (asset.tradeInfo.saleType === 0) {
          return 'Pre Sale'
        } else if (asset.tradeInfo.saleType === 1) {
          return 'On Sale'
        } else if (asset.tradeInfo.saleType === 2) {
          return 'On Auction'
        }
      }
      return 'pre-sale'
    },
    username () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      const un = (asset.artist) ? asset.artist : asset.owner
      return (un.indexOf('.') > -1) ? un.substring(0, (un.indexOf('.'))) : un
    }
  },
  computed: {
    profile () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile
    },
    rate () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      const rate = this.$store.getters[APP_CONSTANTS.KEY_EXCHANGE_RATE](asset.tradeInfo.buyNowOrStartingPrice)
      return rate
    },
    clarityAsset () {
      const clarityAsset = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_CLARITY_ASSET](this.assetHash)
      return clarityAsset
    },
    asset () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      return asset
    },
    projectUrl () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      return decodeURI(asset.assetProjectUrl.replace('_minted', ''))
    }
  }
}
</script>
<style lang="scss">
.text-price {
  font-weight: 800;
  font-size: 24px;
}
.text-stx {
  font-weight: 300;
  font-size: 20px;
  color: #777777;
}
.bb {
  border-bottom: 1pt solid #50B1B5;
}
 </style>
