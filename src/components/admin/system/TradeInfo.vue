<template>
<div>
  <div>
    <div class="d-flex justify-content-between"><div class="w-25">Sale Type:</div> <div class="w-75">{{tradeInfo.saleType}}</div></div>
    <div class="d-flex justify-content-between"><div class="w-25">Price:</div> <div class="w-75">{{tradeInfo.buyNowOrStartingPrice}}</div></div>
    <div class="d-flex justify-content-between"><div class="w-25">Increment:</div> <div class="w-75">{{tradeInfo.incrementPrice}}</div></div>
    <div class="d-flex justify-content-between"><div class="w-25">Reserve:</div> <div class="w-75">{{tradeInfo.reservePrice}}</div></div>
    <div class="d-flex justify-content-between"><div class="w-25">Ends:</div> <div class="w-75">{{tradeInfo.biddingEndTime}}</div></div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'TradeInfo',
  components: {
  },
  props: ['tradeInfo'],
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
