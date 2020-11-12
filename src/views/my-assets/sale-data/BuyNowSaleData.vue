<template>
<div class="row">
  <div class="col-12 mb-5">
    <div role="group">
      <label for="input-live"><span class="text2">Buy Now Price</span></label>
      <b-input-group>
        <b-form-input type="number" v-model="saleData.buyNowPrice" class="input" placeholder="STX"></b-form-input>
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
      saleData: {
        saleType: 'buy-now',
        buyNowPrice: null
      }
    }
  },
  methods: {
    submit: function () {
      if (!this.saleData.buyNowPrice || this.saleData.buyNowPrice <= 0) {
        this.$notify({ type: 'error', title: 'Price', text: 'Please enter the buy now price.' })
        return
      }
      this.$emit('setSaleData', this.saleData)
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
