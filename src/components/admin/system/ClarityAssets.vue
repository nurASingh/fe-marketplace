<template>
<div>
  <a class="mx-2" href="#" @click.prevent="indexMintedAssets()">Lookup NFT Indexes</a>
  <div v-for="(appl, idx) in applications" :key="idx" class="mb-4 pb-4">
    <div class="d-flex justify-content-between">
      <a href="#" @click="appCounter = appl.appCounter">App {{appl.appCounter}}: {{appl.contractId}}</a>
      <a href="#" @click="appCounter = null">close</a>
    </div>
    <div :key="componentKey" v-if="clarityAssets">
      <div class="d-flex justify-content-between py-4 border-bottom">
        <div><a href="#" @click.prevent="showTradeInfo = !showTradeInfo">stacks</a></div>
        <div><a href="#" @click.prevent="showTradeInfoGaia = !showTradeInfoGaia">gaia</a></div>
        <div><a href="#" @click.prevent="showTradeInfoSearch = !showTradeInfoSearch">lucene</a></div>
      </div>
      <div v-for="(asset, idx1) in clarityAssets" :key="idx1">
        <div><a href="#" @click.prevent="lookupTradeInfo(asset.nftIndex)">Asset {{asset.nftIndex}}:</a> {{asset.assetHash}}</div>
        <trade-info-lucene :assetHash="asset.assetHash"/>
        <trade-info :tradeInfo="asset.tradeInfo" v-if="asset.tradeInfo"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import TradeInfo from './TradeInfo'
import TradeInfoLucene from './TradeInfoLucene'

export default {
  name: 'ClarityAssets',
  components: {
    TradeInfo,
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
    indexMintedAssets () {
      this.$store.dispatch('applicationStore/indexMintedAssets').then((result) => {
        this.result = result
        this.componentKey++
      })
    },
    lookupTradeInfo (nftIndex) {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_APPLICATION_BY_COUNTER](this.appCounter)
      this.$store.dispatch('applicationStore/lookupTradeInfo', { application: application, nftIndex: nftIndex }).then((tradeInfo) => {
        this.tradeInfo = tradeInfo
      })
    }
  },
  computed: {
    applications () {
      const appmap = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP]
      if (appmap && appmap.apps) {
        return appmap.apps
      }
      return []
    },
    clarityAssets () {
      const clarityAssets = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_CLARITY_ASSETS](this.appCounter)
      return clarityAssets
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
