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
        <div id="img1"><img :src="coverImageSrc" class="img-responsive" width="100%"/></div>
      </div>
      <div class="col-6">
        <div class="text-white d-flex flex-column align-items-start" :style="calcHeight">
          <div>
            <p class="text1 text-white">Item name</p>
            <p class="text2" v-if="contractAsset">#{{contractAsset.nftIndex}} {{asset.name}}</p>
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
          <div class="mt-auto" v-if="asset.contractAsset">
            <button class="mb-3 button-primary" @click.prevent="openSaleDataDialog()">Sell Item</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <b-modal size="md" id="rpay-modal">
    <risidio-pay v-if="showRpay" :configuration="configuration"/>
  </b-modal>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import moment from 'moment'
import RisidioPay from 'risidio-pay'

export default {
  name: 'MyAsset',
  components: {
    RisidioPay
  },
  data () {
    return {
      missingCoverImage: require('@/assets/img/main-navbar-bg.svg'),
      assetHash: null,
      showRpay: false,
      mintResult: null,
      trackingMessage: 'Blockchain called - answer will be back shortly. You can <a href="____" target="_blank">track the transaction here</a> and the data on this page should refresh automatically.',
      loading: true
    }
  },
  mounted () {
    this.assetHash = this.$route.params.assetHash
    this.$store.dispatch('rpaySearchStore/findAssetByHash', this.assetHash).then(() => {
      this.loading = false
    })
  },
  methods: {
    openSaleDataDialog: function () {
      const item = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      item.saleData = item.contractAsset.saleData
      this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'selling-flow', asset: item })
      this.showRpay = true
      this.$bvModal.show('rpay-modal')
    },
    projectName (projectId) {
      if (projectId.indexOf('.') === -1) {
        return projectId
      }
      return projectId.split('.')[1]
    },
    biddingEndsDisplay () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      let bd
      if (asset.contractAsset.saleData && asset.contractAsset.saleData.biddingEndTime) {
        bd = moment(asset.contractAsset.saleData.biddingEndTime).format('LLLL')
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
    configuration () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      return configuration
    },
    coverImageSrc () {
      const gaiaAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      if (gaiaAsset && gaiaAsset.nftMedia && gaiaAsset.nftMedia.coverImage && gaiaAsset.nftMedia.coverImage.fileUrl) {
        return gaiaAsset.nftMedia.coverImage.fileUrl
      }
      return this.missingCoverImage
    },
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
    contractAsset () {
      const contractAsset = this.$store.getters[APP_CONSTANTS.KEY_ASSET_FROM_CONTRACT_BY_HASH](this.assetHash)
      return contractAsset
    },
    projectUrl () {
      const asset = this.$store.getters[APP_CONSTANTS.KEY_ASSET](this.assetHash)
      if (asset.assetProjectUrl) {
        return decodeURI(asset.assetProjectUrl.replace('_minted', ''))
      } else {
        return asset.assetProjectUrl
      }
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
