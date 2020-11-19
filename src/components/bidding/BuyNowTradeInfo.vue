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
        buyNowOrStartingPrice: null
      }
    }
  },
  methods: {
    submit: function () {
      if (!this.tradeInfo.buyNowOrStartingPrice || this.tradeInfo.buyNowOrStartingPrice <= 0) {
        this.$notify({ type: 'error', title: 'Price', text: 'Please enter the buy now price.' })
        return
      }
      this.$emit('setTradeInfo', this.tradeInfo)
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
