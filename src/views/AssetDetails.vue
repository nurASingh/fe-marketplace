<template>
<div class="container" v-if="asset">
  <div class="row">
    <div class="col-4">
      <div><img :src="asset.assetUrl" class="img-responsive" width="100%"/></div>
      <div><a :href="projectUrl" target="_blank">view on {{asset.projectId}}</a></div>
    </div>
    <div class="col-6">
      <h3>{{asset.title}}</h3>
      <h3>{{asset.description}}</h3>
      <b-button variant="info" class="mt-3 btn-lg" style="text-transform: capitalize; font-size: 14px;" @click.prevent="explore()">EXPLORE</b-button>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'AssetDetails',
  components: {
  },
  data () {
    return {
      assetHash: null
    }
  },
  mounted () {
    this.loading = false
    this.assetHash = this.$route.params.assetHash
    this.$store.dispatch('searchStore/findArtworkById', this.assetHash)
  },
  methods: {
  },
  computed: {
    asset () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      return asset
    },
    projectUrl () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      return decodeURI(asset.assetProjectUrl.replace('_minted', ''))
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/custom.scss";
.video-container {
  max-width: 768px;
  max-height: 432px;
  margin: 0 auto;
}
.tagline {
  font-size: 28px;
  font-weight: 300;
  position: relative;
  top: -35px;
}
.tagline1 {
  font-weight: 600;
  color: $yellow;
}
.level1 {
  font-size: 28px;
  font-weight: 600;
  color: #FFFFFF;
}
.level2 {
  font-size: 16px;
  font-weight: 300;
  margin-top: 20px;
}
.button1 {
  width: 158px;
  height: 40px;
  font-weight: 600;
  background: #50B1B5 0% 0% no-repeat padding-box;
  border-radius: 22px !important;
}
.button2 {
  width: 158px;
  height: 40px;
  background: #323131 0% 0% no-repeat padding-box !important;
  border: 0px solid #50B1B5 !important;
  border-radius: 22px !important;
  font-weight: 600;
}
.button2:hover {
  color: #fff !important;
}
</style>
