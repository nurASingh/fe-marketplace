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
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'SellOffers',
  components: {
  },
  props: ['submitData'],
  data () {
    return {
      saleData: this.saleData
    }
  },
  mounted () {
    const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.$route.params.assetHash)
    if (asset && asset.contractAsset.saleData) this.saleData = asset.contractAsset.saleData
    return asset
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
