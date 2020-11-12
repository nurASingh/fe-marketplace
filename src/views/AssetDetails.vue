<template>
<div class="container" v-if="asset" style="margin: 150px 0;">
  <div class="row">
    <div class="col-4">
      <div><img :src="asset.assetUrl" class="img-responsive" width="100%"/></div>
      <div>view on <a :href="projectUrl" target="_blank">{{projectName(asset.projectId)}} <b-icon icon="arrow-up-right-circle-fill"/></a></div>
    </div>
    <div class="col-6">
      <h3>{{asset.title}}</h3>
      <h3>{{asset.description}}</h3>
      <!--
      <div v-if="isOwner">
        <h3>Owner: {{asset.artist}}</h3>
        <b-button class="mt-3 btn-lg" v-b-toggle.collapse-1 variant="info" style="text-transform: capitalize; font-size: 14px;">Set Price</b-button>
        <b-collapse id="collapse-1" class="mt-2">
          <b-card>
            <p class="card-text">Collapse contents Here</p>
            <b-button v-b-toggle.collapse-1-inner size="sm">Toggle Inner Collapse</b-button>
            <b-collapse id="collapse-1-inner" class="mt-2">
              <b-card>Hello!</b-card>
            </b-collapse>
          </b-card>
        </b-collapse>
      </div>
      -->
      <div>
        <h3>{{asset.owner}}</h3>
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
    this.$store.dispatch('searchStore/findArtworkById', this.assetHash)
  },
  methods: {
    projectName (projectId) {
      return projectId.split('.')[1]
    },
    isOwner () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return asset.artist === profile.username
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
