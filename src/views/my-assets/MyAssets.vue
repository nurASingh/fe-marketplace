<template>
<div class="container" style="margin: 150px 0;">
  <div class="row p-3">
    <div class="col-12 p-3 border">
      <h1>My Collectibles</h1>
      <result-grid :resultSet="resultSet"/>
    </div>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import ResultGrid from '@/components/agora/ResultGrid'

export default {
  name: 'MyAssets',
  components: {
    ResultGrid
  },
  data () {
    return {
      results: null
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
