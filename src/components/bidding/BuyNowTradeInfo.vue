<template>
<div class="row">
  <div class="col-12 mb-5">
    <div role="group">
      <label for="input-live"><span class="text2">Buy Now Price (STX)</span></label>
      <b-input-group>
        <b-form-input type="number" v-model="tradeInfo.buyNowOrStartingPrice" class="input" placeholder="STX"></b-form-input>
      </b-input-group>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'SellBuyNow',
  components: {
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
        saleType: 1,
        buyNowOrStartingPrice: 0,
        incrementPrice: 0,
        reservePrice: 0,
        biddingEndTime: 0
      }
    }
  },
  mounted () {
    const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.$route.params.assetHash)
    if (asset && asset.tradeInfo) this.tradeInfo = asset.tradeInfo
    return asset
  },
  methods: {
    submit: function () {
      if (!this.tradeInfo.buyNowOrStartingPrice || this.tradeInfo.buyNowOrStartingPrice <= 0) {
        this.$notify({ type: 'error', title: 'Price', text: 'Please enter the buy now price.' })
        return
      }
      this.tradeInfo.saleType = 1
      this.tradeInfo.incrementPrice = 0
      this.tradeInfo.reservePrice = 0
      this.tradeInfo.biddingEndTime = 0
      this.$emit('setTradeInfo', this.tradeInfo)
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
