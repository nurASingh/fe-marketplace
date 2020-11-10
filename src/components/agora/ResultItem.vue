<template>
<div id="result-item" class="mb-4 homepage__items" :style="resultImage()">
  <router-link :to="'/assets/' + result.assetHash"><img width="100%" :src="result.assetUrl"/></router-link>
  <!--<div class="homepage__items--description" v-if="dHover[index]" v-html="item.b1_text1[0].text"></div>-->
  <div class="homepage__items--overlay">
    <a href="#" class="homepage__items--like-btn"><b-icon icon="heart"></b-icon></a>
    <div class="homepage__items--description">
      <div class="d-flex justify-content-between">
        <div class="homepage__items--title">{{result.title}}</div>
        <div class="homepage__items--amount" v-if="result.amountStx">Σ {{result.amountStx}}</div>
      </div>
      <div class="d-flex justify-content-between">
        <div class="homepage__items--by">By <span class="homepage__items--artist">{{owner(result.artist)}}</span></div>
        <div class="homepage__items--price" v-if="result.amountStx">£1.50</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
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
      return id.split('.')[0]
    },
    resultImage () {
      return {
        'z-index': -1,
        padding: '0 0 0 0',
        width: '100%',
        'background-repeat': 'no-repeat',
        'background-image': `url(${this.result.assetUrl})`,
        'background-position': 'center center',
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'cover',
        'background-size': 'cover',
        opacity: 1
      }
    },
    created (created) {
      return moment(created).format('YYYY-MM-DD HH:mm:SS')
    }
  },
  computed: {
    application () {
      const application = this.$store.getters[APP_CONSTANTS.KEY_APP_MAP_PROJECT](this.contractId)
      return (application && application.gaiaProject) ? application : null
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/custom.scss";

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
    background: $info;
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
    background-color: $info;
    padding: 10px 13px;
    border-radius: 50%;
    z-index: 3;
  }
}
</style>
