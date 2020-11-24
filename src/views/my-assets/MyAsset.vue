<template>
<div class="container-fluid bg-secondary" v-if="asset" style="padding: 50px 50px; height: 100vh;">
  <div class="mx-auto mt-5" v-if="asset" style="">
    <div class="mb-4 row">
      <div class="col-8 offset-2">
        <div class="d-flex justify-content-between">
          <span><router-link class="text-info text-11-700" to="/my-assets"><b-icon class="mr-2" icon="caret-left-fill"/>Back</router-link></span>
          <!-- <div class="text-right"><router-link class="p-3" to="/my-assets" ><b-icon icon="x-circle" scale="1" variant="white"></b-icon></router-link></div> -->
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-4 offset-2 text-left">
        <div id="img1"><img :src="asset.assetUrl" class="img-responsive" width="100%"/></div>
      </div>
      <div class="col-6">
        <div class="text-white d-flex flex-column align-items-start" :style="calcHeight">
          <div>
            <p class="text1 text-white">Collectible name</p>
            <p class="text2">#{{asset.nftIndex}} {{asset.title}}</p>
            <p class="text1 text-white">Created with</p>
            <p class="text2">{{projectName(asset.projectId)}}</p>
            <p class="text1 text-white">Created on</p>
            <p class="text2">{{created(asset.created)}}</p>
            <p class="text1 text-white" v-if="asset.saleType === 1">Buy Now</p>
            <p class="text1 text-white" v-if="asset.saleType === 2">On Auction</p>
            <p class="text2">{{biddingEndsDisplay()}}</p>
            <p class="text1 text-white" v-if="biddingEndsDisplay">Bidding Ends</p>
            <p class="text2">{{biddingEndsDisplay()}}</p>

          </div>
          <!--
          <div class="mt-auto">
            <button @click.prevent="download()" class="button-secondary"><span>Download</span></button>
          </div>
          -->
          <div class="mt-auto" v-if="asset.nftIndex >= 0">
            <button class="mb-3 button-primary"><router-link :to="'/asset-sale-data/' + assetHash">Sell Collectible</router-link></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'

export default {
  name: 'MyAsset',
  components: {
  },
  data () {
    return {
      assetHash: null,
      loading: true
    }
  },
  mounted () {
    this.assetHash = this.$route.params.assetHash
    this.$store.dispatch('searchStore/findAssetByHash', this.assetHash).then(() => {
      this.loading = false
    })
  },
  methods: {
    projectName (projectId) {
      if (projectId.indexOf('.') === -1) {
        return projectId
      }
      return projectId.split('.')[1]
    },
    biddingEndsDisplay () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      let bd
      if (asset.tradeInfo && asset.tradeInfo.biddingEndTime) {
        bd = moment(asset.tradeInfo.biddingEndTime).format('LLLL')
      }
      return bd
    },
    created (created) {
      return moment(created).format('YYYY-MM-DD HH:mm:SS')
    },
    /**
    download () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      const extUrl = asset.imageUrl.replace('.png', '_minted.png')
      imageDataURI.encodeFromURL(extUrl).then(dataUrl => {
        const image = dataUrl.replace('image/png', 'image/octet-stream')
        const link = document.createElement('a')
        link.download = asset.name + '.png'
        link.href = image
        link.click()
      }).catch(() => {
        imageDataURI.encodeFromURL(asset.imageUrl).then(dataUrl => {
          const image = dataUrl.replace('image/png', 'image/octet-stream')
          const link = document.createElement('a')
          link.download = asset.name + '.png'
          link.href = image
          link.click()
        })
      })
    },
    **/
    isOwner () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return asset.artist === profile.username
    }
  },
  computed: {
    calcHeight () {
      const img1 = document.getElementById('img1')
      if (img1) {
        return img1.height + 'px'
      }
      return 'min-height: 50vh;'
    },
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
.text1 {
  font-weight: 300;
  font-size: 1.2rem;
}
.text2 {
  font-weight: 500;
  font-size: 1.4rem;
}
</style>
