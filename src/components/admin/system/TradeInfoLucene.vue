<template>
<div>
  <div v-if="asset">
    <div class="d-flex justify-content-between"><div class="w-25">Title:</div> <div class="w-75">{{asset.name}}</div></div>
    <div class="d-flex justify-content-between"><div class="w-25">Owner:</div> <div class="w-75">{{asset.owner}}</div></div>
    <div class="d-flex justify-content-between"><div class="w-25">Artist:</div> <div class="w-75">{{asset.artist }}</div></div>
  </div>
</div>
</template>

<script>
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
      this.$store.dispatch('rpaySearchStore/findAssetByHash', this.assetHash)
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
