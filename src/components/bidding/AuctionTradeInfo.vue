<template>
<div class="row mt-5">
  <div class="col-6 mb-5">
    <div role="group">
      <label for="input-live"><span class="text2">Starting Price</span></label>
      <b-input-group>
        <b-form-input v-model="saleData.buyNowOrStartingPrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>
    </div>
  </div>
  <div class="col-6 mb-5">
    <div role="group">
      <label for="input-live"><span class="text2">Reserve Price</span></label>
      <b-input-group class="mb-3">
        <b-form-input v-model="saleData.reservePrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>

      <label for="input-live"><span class="text2">Increment</span></label>
      <b-input-group class="mb-3">
        <b-form-input v-model="saleData.incrementPrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>

      <label for="input-live"><span class="text2">Bidding Ends</span></label>
      <datetime type="datetime" input-id="biddingEndTime" v-model="saleData.biddingEndTime">
        <input id="biddingEndTime">
      </datetime>
      <!-- {{getLongTime()}} -->
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import { Datetime } from 'vue-datetime'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'AuctionTradeInfo',
  components: {
    Datetime
  },
  props: ['submitData'],
  watch: {
    submitData: function () {
      this.submit()
    }
  },
  data () {
    return {
      saleData: {
        saleType: 2,
        incrementPrice: 1,
        buyNowOrStartingPrice: 0,
        reservePrice: 0,
        biddingEndTime: String(moment().unix())
      }
    }
  },
  mounted () {
    this.loading = false
    this.assetHash = this.$route.params.assetHash
    const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.$route.params.assetHash)
    if (asset && asset.contractAsset && asset.contractAsset.saleData) this.saleData = asset.contractAsset.saleData

    if (asset.contractAsset.saleData && asset.contractAsset.saleData.biddingEndTime > 0) {
      this.saleData.biddingEndTime = moment(asset.contractAsset.saleData.biddingEndTime).format()
    } else {
      const dd = moment({}).add(2, 'days')
      dd.hour(10)
      dd.minute(0)
      this.saleData.biddingEndTime = dd.format()
    }
  },
  methods: {
    submit: function () {
      if (!this.saleData.incrementPrice || this.saleData.incrementPrice < 0) {
        this.$notify({ type: 'error', title: 'Increment', text: 'Please enter the increment for bidding.' })
        return
      }
      if (!this.saleData.buyNowOrStartingPrice || this.saleData.buyNowOrStartingPrice < 0) {
        this.$notify({ type: 'error', title: 'Starting Price', text: 'Please enter the starting price for bidding.' })
        return
      }
      if (!this.saleData.reservePrice || this.saleData.reservePrice < 0) {
        this.$notify({ type: 'error', title: 'Reserve Price', text: 'Please enter the reserve.' })
        return
      }
      this.saleData.saleType = 2
      // const saleData = this.saleData
      // saleData.biddingEndTime = moment(this.saleData.biddingEndTime).valueOf()
      const chainTradeInfo = {
        saleType: this.saleData.saleType,
        incrementPrice: this.saleData.incrementPrice,
        buyNowOrStartingPrice: this.saleData.buyNowOrStartingPrice,
        reservePrice: this.saleData.reservePrice,
        biddingEndTime: moment(this.saleData.biddingEndTime).valueOf()
      }
      this.$emit('setTradeInfo', chainTradeInfo)
    },
    checkEndTime () {
      const now = moment().unix()
      const diff = this.saleData.biddingEndTime - now
      return diff > 0
    },
    getLongTime () {
      return moment(this.saleData.biddingEndTime).valueOf()
    }
  },
  computed: {
  }
}
</script>
<style lang="scss">
</style>
