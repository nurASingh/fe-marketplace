<template>
<div class="row">
  <side-menu class="col-3 mr-0 pr-0 pt-5"/>
  <div class="col-9 pt-5 admin-app">
    <title-bar title="My Collectibles" class="container" v-on="$listeners"/>
    <div class="container" @click="$emit('toggle-off-navbar')">
      <result-grid :resultSet="resultSet" :gridClasses="gridClasses"/>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import ResultGrid from '@/components/agora/ResultGrid'
import SideMenu from '@/components/admin/SideMenu'
import TitleBar from '@/components/admin/TitleBar'

export default {
  name: 'MyAssets',
  components: {
    ResultGrid,
    SideMenu,
    TitleBar
  },
  data () {
    return {
      results: null,
      gridClasses: ['col-lg-3', 'col-md-4', 'col-sm-6', 'col-12']
    }
  },
  mounted () {
    this.loading = false
    this.findAssets()
  },
  methods: {
    findAssets () {
      this.$store.dispatch('searchStore/findByOwner').then((results) => {
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
</style>
