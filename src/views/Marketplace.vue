<template>
<div class="container-fluid px-0" style="margin-top: 128px">
  <div class="d-flex justify-content-start">
    <div class="mp-nav w-25 p-4 px-5">
      <marketplace-side-menu/>
    </div>
    <div class="w-75 p-2">
      <div class="d-flex justify-content-between border-bottom mx-5 mt-2 pb-3">
        <div>
          <span class="text-center-300 mr-4">View</span>
          <b-dropdown caret>
            <!-- Using 'button-content' slot -->
            <template class="bg-white" v-slot:button-content>
              <span>Popular</span>
            </template>
            <div class="dropdown__whitespace"></div>
            <div class="dropdown__filler"></div>
            <div class="dropdown__items">
              <b-dropdown-item></b-dropdown-item>
              <b-dropdown-item>Application</b-dropdown-item>
              <b-dropdown-item>Artist</b-dropdown-item>
              <b-dropdown-item>Collection</b-dropdown-item>
              <b-dropdown-item>On Auction</b-dropdown-item>
              <b-dropdown-item>On Sale</b-dropdown-item>
            </div>
          </b-dropdown>
        </div>
        <div>
          <b-dropdown caret>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <span>Sort by</span>
            </template>
            <div class="dropdown__whitespace"></div>
            <div class="dropdown__filler"></div>
            <div class="dropdown__items">
              <b-dropdown-item></b-dropdown-item>
              <b-dropdown-item>Application</b-dropdown-item>
              <b-dropdown-item>Artist</b-dropdown-item>
              <b-dropdown-item>Collection</b-dropdown-item>
              <b-dropdown-item>On Auction</b-dropdown-item>
              <b-dropdown-item>On Sale</b-dropdown-item>
            </div>
          </b-dropdown>
        </div>
        <div class="w-50">
          <b-input-group>
            <b-form-input type="number" v-model="query" class="input" placeholder="Looking for something in particular?"></b-form-input>
            <template class="position: absolute; left: -20px;" v-slot:append>
              <a href="#" @click.prevent="doSearch"><b-icon icon="search"/></a>
            </template>
          </b-input-group>
        </div>
        <div>
        </div>
      </div>
      <div class="p-5">
        <result-grid :resultSet="resultSet" />
      </div>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import { APP_CONSTANTS } from '@/app-constants'
import ResultGrid from '@/components/agora/ResultGrid'
import MarketplaceSideMenu from '@/components/agora/MarketplaceSideMenu'

export default {
  name: 'Marketplace',
  components: {
    ResultGrid,
    MarketplaceSideMenu
  },
  data () {
    return {
      results: null,
      query: null
    }
  },
  mounted () {
    this.loading = false
    this.findAssets()
  },
  methods: {
    findAssets () {
      this.$store.dispatch('searchStore/findBySearchTerm').then((results) => {
        this.results = results
      })
    },
    setProjectFilter (projectId) {
      this.$store.dispatch('searchStore/findByProjectId', projectId).then((results) => {
        this.results = results
      })
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
    created (created) {
      return moment(created).format('YYYY-MM-DD HH:mm:SS')
    }
  },
  computed: {
    resultSet () {
      return this.$store.getters[APP_CONSTANTS.KEY_SEARCH_RESULTS]
    }
  }
}
</script>
<style lang="scss">
.mp-nav {
  background: #F5F5F5;
}
</style>
