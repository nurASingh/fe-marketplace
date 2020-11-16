<template>
<div id="marketplace" class="container-fluid px-0" style="margin-top: 128px;">
  <div class="d-flex justify-content-start">
    <div class="mp-nav w-25 p-4 px-5">
      <marketplace-side-menu v-on="$listeners" style="min-height: 100vh;"/>
    </div>
    <div class="w-75 p-2">
      <marketplace-filter-bar v-on="$listeners"/>
      <div class="p-5">
        <result-grid :resultSet="resultSet" v-if="resultSet && resultSet.length > 0"/>
        <div v-else v-html="currentSearch">No results: {{currentSearch}}</div>
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
import MarketplaceFilterBar from '@/components/agora/MarketplaceFilterBar'

export default {
  name: 'Marketplace',
  components: {
    ResultGrid,
    MarketplaceSideMenu,
    MarketplaceFilterBar
  },
  data () {
    return {
      results: null,
      query: null
    }
  },
  mounted () {
    this.loading = false
    if (this.$route.query && !this.$route.query.filter) {
      this.findAssets()
    }
    const query = Object.assign({}, this.$route.query)
    delete query.filter
    this.$router.replace({ query }).catch(() => {
      console.log('avoided duplicate navigation..')
    })
  },
  methods: {
    findAssets () {
      this.$store.dispatch('searchStore/findBySearchTerm').then((results) => {
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
    },
    currentSearch () {
      const currentSearch = this.$store.getters[APP_CONSTANTS.KEY_CURRENT_SEARCH]
      if (!currentSearch) return ''
      if (currentSearch.filter === 'category') {
        return 'No results: for ' + currentSearch.filter + ' <span class="text-info">' + currentSearch.category.displayName + '</span>'
      } else if (currentSearch.filter === 'application') {
        return 'No results: for ' + currentSearch.filter + ' <span class="text-info">' + currentSearch.contractId + '</span>'
      } else if (currentSearch.filter === 'sale-type') {
        return 'No results: for <span class="text-info">' + currentSearch.saleType + '</span>'
      } else {
        return 'No results: for <span class="text-info">' + currentSearch.filter + '</span>'
      }
    }
  }
}
</script>
<style lang="scss">
.mp-nav {
  background: #F5F5F5;
}
#marketplace {
  /* MAIN SEARCH BAR */
  & .main-search {
    margin-top: -5.5px;
    z-index: 2;
  }
  & .main-search--border {
    width: 100%;
    max-width: 1000px;
  }

  /* MAIN SEARCH BAR -- INPUT */
  & .input-group {
    background: #FFFFFF;
    border: 1px solid #F5F5F5;
    align-items: center;
    height: 47px;
  }
  & .input-group input {
    font-size: 14px;
    font-weight: 500;
    color: #000;
    height: 26px;
    padding: 0.25rem 25px;
    border: none;
    z-index: 2;
  }
  & .input-group input:focus {
    box-shadow: none;
  }

  /* MAIN SEARCH BAR -- BTN */
  & .main-search .btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 600;
    color: #000;
    text-transform: none;
    background: transparent;
    border: none;
    padding-left: 30px;
    padding-right: 30px;
    z-index: 2;
  }
  & .main-search .btn:focus {
    box-shadow: none;
  }
  & .main-search .btn.dropdown-toggle::after {
    font-size: 16px;
  }

  /* MAIN SEARCH BAR -- LOOP ICON */
  & .input-group-append svg {
    font-size: 20px;
    font-weight: bold;
    color: #50B1B5;
    margin-right: 22px;
    margin-left: 1px;
  }

}
</style>
