<template>
<div class="container-fluid bg-secondary" v-if="asset" style="padding: 150px 50px; height: 100vh;">
  <div class="text-right"><router-link class="p-3" :to="'/my-assets/' + assetHash" ><b-icon icon="x-circle" scale="1" variant="white"></b-icon></router-link></div>
  <b-card-group deck v-if="!loading">
    <b-card :img-src="asset.assetUrl" img-alt="Card image" img-left class="p-5" style="max-height: 363px; width: 976px;">
      <b-card-text>
        <div class="row">
          <div class="col-4">
            <p class="text2">Collectible name</p>
            <p class="text1">#{{asset.nftIndex}} {{asset.title}}</p>
          </div>
          <div class="col-6">
            <div class="d-flex flex-column align-items-start">
              <div>
                <p class="text2">Created with</p>
                <p class="text1">{{projectName(asset.projectId)}}</p>
              </div>
            </div>
          </div>
        </div>
        <buy-now-trade-info :submitData="submitDataBuyNow" @setTradeInfo="setTradeInfo" class="row" v-if="saleType === 1" />
        <auction-trade-info :submitData="submitDataAuction" @setTradeInfo="setTradeInfo" class="row" v-else-if="saleType === 2" />
        <offer-trade-info :submitData="submitDataOffer" @setTradeInfo="setTradeInfo" class="row" v-else-if="saleType === 3"/>
        <div class="row" style="position: absolute; bottom: 50px;">
          <div class="col-12">
            <p class="text1">Available for</p>
            <div class="mt-auto">
              <b-button class="mb-2 mr-3" :variant="(saleType === 1) ? 'info' : 'light'" @click="saleType = 1">Buy Now</b-button>
              <b-button class="mb-2 mr-3" :variant="(saleType === 2) ? 'info' : 'light'" @click="saleType = 2">Auction</b-button>
              <b-button class="mb-2 mr-3" :variant="(saleType === 3) ? 'info' : 'light'" @click="saleType = 3">Offers</b-button>
            </div>
          </div>
        </div>
        <div class="row" style="position: absolute; bottom: -30px; right: 50px;">
          <div class="col-12">
            <div class="mt-auto">
              <b-button style="min-width: 141px; position: relative: top: -20px;" size="lg" class="mb-3" variant="info" @click="submitSell">Submit</b-button>
            </div>
          </div>
        </div>
      </b-card-text>
    </b-card>
  </b-card-group>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import AuctionTradeInfo from '@/components/bidding/AuctionTradeInfo'
import BuyNowTradeInfo from '@/components/bidding/BuyNowTradeInfo'
import OfferTradeInfo from '@/components/bidding/OfferTradeInfo'

export default {
  name: 'AssetTradeInfo',
  components: {
    OfferTradeInfo,
    AuctionTradeInfo,
    BuyNowTradeInfo
  },
  data () {
    return {
      loading: true,
      assetHash: null,
      amountStx: null,
      saleType: 1,
      submitDataBuyNow: 0,
      submitDataAuction: 0,
      submitDataOffer: 0
    }
  },
  mounted () {
    this.assetHash = this.$route.params.assetHash
    this.$store.dispatch('searchStore/findAssetByHash', this.assetHash).then((asset) => {
      if (asset.tradeInfo) this.saleType = asset.tradeInfo.saleType
      this.loading = false
    })
  },
  methods: {
    submitSell () {
      if (this.saleType === 1) {
        this.submitDataBuyNow++
      } else if (this.saleType === 2) {
        this.submitDataAuction++
      }
    },
    setTradeInfo (tradeInfo) {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      if (typeof asset.nftIndex === 'undefined' || asset.projectId.indexOf('.') < 0) {
        this.$notify({ type: 'error', title: 'Not Registered', text: 'This item isn\'t registered on-chain.' })
        return
      }
      asset.tradeInfo = tradeInfo
      this.$root.$emit('bv::show::modal', 'waiting-modal')
      this.$store.dispatch('stacksStore/setTradeInfo', asset).then((result) => {
        this.result = result
        this.$root.$emit('bv::hide::modal', 'waiting-modal')
        this.$store.commit('setModalMessage', 'That worked! Others are now able to buy this item.')
        this.$root.$emit('bv::show::modal', 'success-modal')
      }).catch((error) => {
        this.result = error
        this.$store.commit('setModalMessage', 'There was an error setting trade info.')
      })
    },
    isValid (warn) {
      let valid = false
      if (this.saleType === 1 && this.amountStx > 0 && this.amountStx < 100) {
        valid = true
      } else if (this.saleType === 2) {
        if (this.startingPrice && this.startingPrice > 0) {
          if (warn) {
            this.$notify({ type: 'error', title: 'Contract Error', text: 'The contract name must be present and at least 2 characters long.' })
          }
        }
      }
      return valid
    },
    projectName (projectId) {
      if (projectId.indexOf('.') === -1) {
        return projectId
      }
      return projectId.split('.')[1]
    },
    isOwner () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return asset.artist === profile.username
    }
  },
  computed: {
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
<style lang="scss" scoped>
.card-img-left {
  width: 25%;
}
.card {
  background: #F5F5F5 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 25px;
}
</style>
