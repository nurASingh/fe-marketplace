<template>
<div>
  <a class="mx-2" href="#">Lookup NFT Indexes</a>
  <div v-for="(appl, idx) in applications" :key="idx" class="mb-4 pb-4">
    <div class="d-flex justify-content-between">
      <a href="#" @click="appCounter = appl.appCounter">App {{appl.appCounter}}: {{appl.contractId}}</a>
      <a href="#" @click="appCounter = null">close</a>
    </div>
    <div :key="componentKey" v-if="registry">
      <div class="d-flex justify-content-between py-4 border-bottom">
        <div><a href="#" @click.prevent="showTradeInfo = !showTradeInfo">stacks</a></div>
        <div><a href="#" @click.prevent="showTradeInfoGaia = !showTradeInfoGaia">gaia</a></div>
        <div><a href="#" @click.prevent="showTradeInfoSearch = !showTradeInfoSearch">lucene</a></div>
      </div>
      <div v-for="(application, idx1) in registry.applications" :key="idx1">
        <div><a href="#">Application {{application.projectId}}</a></div>
        <div v-for="(token, idx2) in application.tokens" :key="idx2">
          <div><a href="#">Asset {{token.nftIndex}}:</a> {{token.assetHash}}</div>
          <trade-info-lucene :assetHash="token.assetHash"/>
          <sale-data :saleData="token.saleData" v-if="token.saleData"/>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import SaleData from './SaleData'
import TradeInfoLucene from './TradeInfoLucene'

export default {
  name: 'ClarityAssets',
  components: {
    SaleData,
    TradeInfoLucene
  },
  data () {
    return {
      componentKey: 0,
      appCounter: null,
      showTradeInfo: false,
      showTradeInfoSearch: false,
      showTradeInfoGaia: false
    }
  },
  methods: {
  },
  computed: {
    applications () {
      const registry = this.$store.getters[APP_CONSTANTS.KEY_REGISTRY]
      if (registry && registry.applications) {
        return registry.applications
      }
      return []
    },
    registry () {
      const registry = this.$store.getters[APP_CONSTANTS.KEY_REGISTRY]
      return registry
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
