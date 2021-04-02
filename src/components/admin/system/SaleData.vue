<template>
<div>
  <div>
    <div class="d-flex justify-content-between"><div class="w-25">Sale Type:</div> <div class="w-75">{{saleData.saleType}}</div></div>
    <div class="d-flex justify-content-between"><div class="w-25">Price:</div> <div class="w-75">{{saleData.buyNowOrStartingPrice}}</div></div>
    <div class="d-flex justify-content-between"><div class="w-25">Increment:</div> <div class="w-75">{{saleData.incrementPrice}}</div></div>
    <div class="d-flex justify-content-between"><div class="w-25">Reserve:</div> <div class="w-75">{{saleData.reservePrice}}</div></div>
    <div class="d-flex justify-content-between"><div class="w-25">Ends:</div> <div class="w-75">{{saleData.biddingEndTime}}</div></div>
  </div>
</div>
</template>

<script>

export default {
  name: 'SaleData',
  components: {
  },
  props: ['saleData'],
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
