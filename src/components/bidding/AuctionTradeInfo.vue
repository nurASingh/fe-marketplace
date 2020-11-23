<template>
<div class="row">
  <div class="col-6 mb-5">
    <div role="group">
      <label for="input-live"><span class="text2">Starting Price</span></label>
      <b-input-group>
        <b-form-input type="number" v-model="tradeInfo.buyNowOrStartingPrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>
    </div>
  </div>
  <div class="col-6 mb-5">
    <div role="group">
      <label for="input-live"><span class="text2">Reserve Price</span></label>
      <b-input-group>
        <b-form-input type="number" v-model="tradeInfo.reservePrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>

      <label for="input-live"><span class="text2">Increment</span></label>
      <b-input-group>
        <b-form-input type="number" v-model="tradeInfo.incrementPrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>

      <label for="input-live"><span class="text2">Bidding Ends</span></label>
      <datetime type="datetime" input-id="biddingEndTime" v-model="tradeInfo.biddingEndTime">
        <input id="biddingEndTime">
      </datetime>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import { Datetime } from 'vue-datetime'

export default {
  name: 'SellAuction',
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
      tradeInfo: {
        saleType: 2,
        incrementPrice: 1,
        buyNowOrStartingPrice: 0,
        reservePrice: 0,
        biddingEndTime: 0
      }
    }
  },
  mounted () {
    this.loading = false
    this.assetHash = this.$route.params.assetHash
    const asset = this.$store.dispatch('searchStore/findAssetByHash', this.assetHash)
    if (asset.tradeInfo && asset.tradeInfo.biddingEndTime) {
      this.biddingEndTime = moment(asset.tradeInfo.biddingEndTime).format()
    } else {
      const dd = moment({}).add(2, 'days')
      dd.hour(10)
      dd.minute(0)
      this.tradeInfo.biddingEndTime = dd.format()
    }
  },
  methods: {
    submit: function () {
      if (!this.tradeInfo.incrementPrice || this.tradeInfo.incrementPrice < 0) {
        this.$notify({ type: 'error', title: 'Increment', text: 'Please enter the increment for bidding.' })
        return
      } else if (!this.tradeInfo.buyNowOrStartingPrice || this.tradeInfo.buyNowOrStartingPrice < 0) {
        this.$notify({ type: 'error', title: 'Starting Price', text: 'Please enter the starting price for bidding.' })
        return
      } else if (!this.tradeInfo.reservePrice || this.tradeInfo.reservePrice < 0) {
        this.$notify({ type: 'error', title: 'Reserve Price', text: 'Please enter the reserve.' })
        return
      }
      if (!this.tradeInfo.reservePrice || this.tradeInfo.reservePrice < 0) {
        this.$notify({ type: 'error', title: 'Reserve Price', text: 'Please enter the reserve.' })
        return
      }
      this.$emit('setTradeInfo', this.tradeInfo)
    },
    checkEndTime () {
      const now = moment({}).valueOf()
      const diff = this.tradeInfo.biddingEndTime - now
      return diff > 0
    }
  },
  computed: {
  }
}
</script>
<style lang="scss">
</style>
