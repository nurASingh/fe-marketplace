<template>
<div class="container" v-if="asset" style="margin: 150px;">
  <div class="row">
    <div class="col-12 mb-4">
      <span><router-link class="text-info text-11-700" to="/marketplace"><b-icon class="mr-2" icon="caret-left-fill"/>Back</router-link></span>
    </div>
  </div>
  <div class="row">
    <div class="col-4">
      <div class="mb-4"><img :src="asset.assetUrl" class="img-responsive" width="100%"/></div>
      <div class="mb-4">
        <p class="mb-2 text-11-700">Description</p>
        <p class="mb-2 text-11-500">{{asset.description}}</p>
        <p class="mb-2 text-11-500">view on <a :href="projectUrl" target="_blank">{{projectName(asset.projectId)}} <b-icon icon="arrow-up-right-circle-fill"/></a></p>
      </div>
      <div class="mb-4">
        <p class="mb-2 text-11-500">Added By</p>
        <p class="mb-2 text-11-500 text-info">{{username()}}</p>
      </div>
    </div>
    <div class="col-6">
      <div class="mb-2 d-flex justify-content-between">
        <p class="text-40-300">{{asset.title}}</p>
        <p class="text-11-500 bg-secondary text-white text-center pt-3" style="text-transform: capitalize; width: 100px; height: 42px;">{{saleType()}}</p>
      </div>
      <div class="mb-2 d-flex justify-content-between">
        <p class="text1">From <strong>{{projectName(asset.projectId)}}</strong></p>
        <div v-if="isOwner">
          <p class="text1"><router-link :to="'/my-assets/' + asset.assetHash">manage your asset</router-link></p>
        </div>
      </div>
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
    this.$store.dispatch('searchStore/findAssetByHash', this.assetHash)
  },
  methods: {
    projectName (projectId) {
      return (projectId && projectId.indexOf('.') > -1) ? projectId.split('.')[1] : projectId
    },
    isOwner () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return asset.artist === profile.username
    },
    saleType () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      if (asset.saleData) {
        if (asset.saleData.saleType === 0) {
          return 'Pre Sale'
        } else if (asset.saleData.saleType === 1) {
          return 'Buy Now'
        } else if (asset.saleData.saleType === 2) {
          return 'On Auction'
        }
      }
      return 'pre-sale'
    },
    username () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      const un = (asset.artist) ? asset.artist : asset.owner
      return (un.indexOf('.') > -1) ? un.substring(0, (un.indexOf('.'))) : un
    }
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
</style>
