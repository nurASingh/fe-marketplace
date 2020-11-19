<template>
<div class="row">
  <div class="col-12 mb-5">
    <div role="group">
      <p>Coming Soon!</p>
    </div>
  </div>
</div>
</template>

<script>

export default {
  name: 'SellOffers',
  components: {
  },
  data () {
    return {
      buyNowPrice: null
    }
  },
  methods: {
    isValid () {
      const validSP = this.buyNowPrice && this.buyNowPrice > 0
      return validSP
    }
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
</style>
