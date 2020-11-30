<template>
<div>
  <div v-if="asset">
    <div class="d-flex justify-content-between"><div class="w-25">Title:</div> <div class="w-75">{{asset.title}}</div></div>
    <div class="d-flex justify-content-between"><div class="w-25">Owner:</div> <div class="w-75">{{asset.owner}}</div></div>
    <div class="d-flex justify-content-between"><div class="w-25">Artist:</div> <div class="w-75">{{asset.artist }}</div></div>
    <div v-if="asset.tradeInfo">
      <div class="d-flex justify-content-between"><div class="w-25">Price:</div> <div class="w-75">{{asset.tradeInfo.buyNowOrStartingPrice}}</div></div>
      <div class="d-flex justify-content-between"><div class="w-25">Increment:</div> <div class="w-75">{{asset.tradeInfo.incrementPrice}}</div></div>
      <div class="d-flex justify-content-between"><div class="w-25">Reserve:</div> <div class="w-75">{{asset.tradeInfo.reservePrice}}</div></div>
      <div class="d-flex justify-content-between"><div class="w-25">Ends:</div> <div class="w-75">{{asset.tradeInfo.biddingEndTime}}</div></div>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'TradeInfoLucene',
  components: {
  },
  props: ['assetHash'],
  data () {
    return {
    }
  },
  mounted () {
    const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
    if (!asset) {
      this.$store.dispatch('searchStore/findAssetByHash', this.assetHash)
    }
  },
  methods: {
  },
  computed: {
    asset () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      return asset
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
