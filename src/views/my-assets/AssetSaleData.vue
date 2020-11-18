<template>
<div class="container-fluid bg-secondary" v-if="asset" style="padding: 150px 50px; height: 100vh;">
  <div class="text-right"><router-link class="p-3" :to="'/my-assets/' + assetHash" ><b-icon icon="x-circle" scale="1" variant="white"></b-icon></router-link></div>
  <b-card-group deck>
    <b-card :img-src="asset.assetUrl" img-alt="Card image" img-left class="p-5" style="max-height: 363px; width: 976px;">
      <b-card-text>
        <div class="row">
          <div class="col-4">
            <p class="text2">Collectible name</p>
            <p class="text1">{{asset.title}}</p>
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
        <buy-now-sale-data :submitData="submitDataBuyNow" @setSaleData="setSaleData" class="row" v-if="saleType === 'buy-now'" />
        <auction-sale-data :submitData="submitDataAuction" @setSaleData="setSaleData" class="row" v-else-if="saleType === 'auction'" />
        <offer-sale-data :submitData="submitDataOffer" @setSaleData="setSaleData" class="row" v-else-if="saleType === 'offers'"/>
        <div class="row" style="position: absolute; bottom: 50px;">
          <div class="col-12">
            <p class="text1">Available for</p>
            <div class="mt-auto">
              <b-button class="mb-2 mr-3" :variant="(saleType === 'buy-now') ? 'info' : 'light'" @click="saleType = 'buy-now'">Buy Now</b-button>
              <b-button class="mb-2 mr-3" :variant="(saleType === 'auction') ? 'info' : 'light'" @click="saleType = 'auction'">Auction</b-button>
              <b-button class="mb-2 mr-3" :variant="(saleType === 'offers') ? 'info' : 'light'" @click="saleType = 'offers'">Offers</b-button>
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
import AuctionSaleData from './sale-data/AuctionSaleData'
import BuyNowSaleData from './sale-data/BuyNowSaleData'
import OfferSaleData from './sale-data/OfferSaleData'
import { intCV, bufferCV } from '@stacks/transactions'

export default {
  name: 'AssetSaleData',
  components: {
    OfferSaleData,
    AuctionSaleData,
    BuyNowSaleData
  },
  data () {
    return {
      assetHash: null,
      amountStx: null,
      saleType: 'buy-now',
      submitDataBuyNow: 0,
      submitDataAuction: 0,
      submitDataOffer: 0
    }
  },
  mounted () {
    this.loading = false
    this.assetHash = this.$route.params.assetHash
    this.$store.dispatch('searchStore/findAssetByHash', this.assetHash)
  },
  methods: {
    submitSell () {
      if (this.saleType === 'buy-now') {
        this.submitDataBuyNow++
      } else if (this.saleType === 'auction') {
        this.submitDataAuction++
      }
    },
    setSaleData (saleData) {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      if (!asset.nftIndex || asset.projectId.indexOf('.') < 0) {
        this.$notify({ type: 'error', title: 'Not Registered', text: 'This item isn\'t registered on-chain.' })
        return
      }
      asset.saleData = saleData
      const owner = this.$store.getters[APP_CONSTANTS.KEY_PROFILE].username
      const functionArgs = [bufferCV(Buffer.from(owner)), bufferCV(Buffer.from(asset.projectId)), intCV(0)]
      const data = {
        contractAddress: asset.projectId.split('.')[0],
        contractName: asset.projectId.split('.')[1],
        functionName: 'set-sale-data',
        functionArgs: functionArgs
      }
      this.$store.dispatch('stacksStore/callContractRisidio', data).then((result) => {
        this.result = result
        this.$bvModal.show('app-modal')
      }).catch((error) => {
        this.result = error
        this.$bvModal.show('app-modal')
      })
    },
    isValid (warn) {
      let valid = false
      if (this.saleType === 'buy-now' && this.amountStx > 0 && this.amountStx < 100) {
        valid = true
      } else if (this.saleType === 'auction') {
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
