<template>
<div>
<router-link :to="assetUrl">
  <div id="result-item" class="mb-4 ">
    <img width="100%" :src="result.assetUrl"/>
    <!-- <div style="position: absolute; top: -20px; left: 15px; font-size: 2rem;"><b-badge variant="light">{{result.nftIndex}} <span class="sr-only">NFT</span></b-badge></div> -->
    <div style="position: absolute; top: 0px; right: 15px;"><a href="#" class="homepage__items--like-btn"><b-icon icon="heart"></b-icon></a></div>
    <!--<div class="homepage__items--description" v-if="dHover[index]" v-html="item.b1_text1[0].text"></div>-->
    <div class="homepage__items--overlay" style="position: absolute; top: -20px; right: 0px; left: 0px;">
      <div class="homepage__items--description">
        <div class="d-flex justify-content-between">
          <div class="homepage__items--title">#{{result.nftIndex}} {{result.title}}</div>
          <div class="homepage__items--amount">Σ {{buyingPrice()}}</div>
        </div>
        <div class="d-flex justify-content-between">
          <div class="homepage__items--by">By <span class="homepage__items--artist">{{owner(result.artist)}}</span></div>
          <div class="homepage__items--price" v-if="result.buyNowOrStartingPrice">{{amountFiat}}</div>
        </div>
      </div>
    </div>
  </div>
</router-link>
<!-- {{created(result.created)}} / {{created(result.updated)}} -->
</div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ResultGrid',
  components: {
  },
  props: ['result'],
  data () {
    return {
    }
  },
  methods: {
    hoverIn (index) {
      this.dHover[index] = true
      this.componentKey += 1
    },
    hoverOut () {
      this.dHover = [false, false, false, false, false, false, false, false, false, false, false, false]
      this.componentKey += 1
    },
    truncateProjectId (projectId) {
      if (projectId.indexOf('.') > -1) {
        let addr = projectId.split('.')[0]
        addr = addr.substring(addr.length - 5)
        return addr + '.' + projectId.split('.')[1]
      }
      return projectId
    },
    truncateAssetHash (assetHash) {
      const addr = assetHash.substring(0, 4)
      return addr + '...' + assetHash.substring(assetHash.length - 4)
    },
    // 91208c24998e8e264f5a8be992d80538b5e8bab9874863f816d603c6df0dca0d
    // b696f04cb51e99953f792703bfabd353b197643f024e7309b27074099ef69eab
    owner (id) {
      return (id && id.indexOf('.') > -1) ? id.split('.')[0] : '?'
    },
    buyingPrice () {
      return (this.result.tradeInfo && this.result.tradeInfo.buyNowOrStartingPrice) ? this.result.tradeInfo.buyNowOrStartingPrice : 0
    },
    created (created) {
      return moment(created).format('YYYY-MM-DD HH:mm:SS')
    }
  },
  computed: {
    assetUrl () {
      let assetUrl = '/assets/' + this.result.assetHash
      if (this.$route.name === 'my-assets') {
        assetUrl = '/my-assets/' + this.result.assetHash
      }
      return assetUrl
    }
  }
}
</script>
<style lang="scss" scoped>
#result-item {
  /* ITEMS STYLE */
  & .homepage__items {
    position: relative;
    width: 100%;
  }

  & .homepage__items--overlay {
    display: flex;
    align-items: flex-end;
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    cursor: pointer;
  }

  & .homepage__items--description {
    width: 100%;
    padding: 11px 18px;
    color: #fff;
    text-shadow: 0px 3px 6px #00000029;
    background: #50B1B5;
    opacity: 0;
    transition: opacity ease 0.3s;
  }

  & .homepage__items--overlay:hover .homepage__items--description {
    opacity: 0.95;
  }

  & .homepage__items--title {
    font-size: 14px;
    font-weight: 400;
  }

  & .homepage__items--amount {
    font-size: 12px;
    font-weight: 600;
  }

  & .homepage__items--by {
    font-size: 10px;
    font-weight: 300;
  }

  & .homepage__items--artist {
    font-size: 10px;
    font-weight: 700;
  }

  & .homepage__items--price {
    font-size: 9px;
    font-weight: 400;
  }

  & .homepage__items--like-btn {
    position: absolute;
    top: 0;
    right: 0;
    color: #FFFFFF;
    font-size: 13px;
    background-color: #50B1B5;
    padding: 10px 13px;
    border-radius: 50%;
    z-index: 3;
  }
}
</style>
