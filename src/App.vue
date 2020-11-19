<template>
  <div :key="componentKey" id="app" v-if="loaded" :style="sectionDimensions">
    <div v-if="!adminPage">
      <router-view @set-filter="setFilter" @updateEventCode="updateEventCode" name="header" style="width: 100%; z-index: 200; position: relative; top: 0px;"/>
    </div>
    <div v-else>
      <router-view @set-filter="setFilter" v-if="showNavbar" @updateEventCode="updateEventCode" name="header" style="width: 100%; z-index: 200; position: absolute; top: 0;"/>
    </div>
    <router-view @updateEventCode="updateEventCode" @toggle-on-navbar="toggleOnNavbar" @set-filter="setFilter" @toggle-off-navbar="toggleOffNavbar" style="min-height: 100vh;"/>
    <router-view @set-filter="setFilter" name="footer" :class="(adminPage) ? 'app-footer' : ''"/>
    <notifications :duration="10000" classes="r-notifs" position="bottom right" width="30%"/>
    <waiting-modal />
    <success-modal />
  </div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import SuccessModal from '@/components/utils/SuccessModal'
import WaitingModal from '@/components/utils/WaitingModal'

export default {
  name: 'App',
  components: {
    SuccessModal,
    WaitingModal
  },
  data () {
    return {
      results: null,
      adminPage: false,
      showNavbar: false,
      loaded: false,
      componentKey: 0,
      data: null
    }
  },
  watch: {
    '$route' () {
      this.adminPage = this.$route.name.indexOf('-app') > -1 ||
        this.$route.name === 'account' ||
        this.$route.name === 'wallet' ||
        this.$route.name === 'my-assets'
      if (this.adminPage) this.showNavbar = false
    }
  },
  mounted () {
    this.adminPage = this.$route.name.indexOf('-app') > -1
    this.adminPage = this.$route.name.indexOf('-app') > -1 ||
      this.$route.name === 'account' ||
      this.$route.name === 'wallet' ||
      this.$route.name === 'my-assets'
    this.$store.dispatch('applicationStore/lookupApplications')
    this.$store.dispatch('authStore/fetchMyAccount').then((profile) => {
      this.loaded = true
      this.$store.dispatch('stacksStore/fetchMacsWalletInfo')
      this.$store.dispatch('projectStore/fetchMyProjects', profile).catch((err) => {
        console.log(err)
      })
    })
    const $self = this
    let resizeTimer
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(function () {
        $self.$store.commit('setWinDims')
        // $self.componentKey += 1
      }, 200)
    })
    this.$prismic.client.getSingle('homepage').then(document => {
      if (document) {
        this.$store.commit('contentStore/addHomeContent', document.data)
      }
    })
  },
  methods: {
    setFilter (data) {
      if (data.filter === 'application') {
        this.$store.dispatch('searchStore/findByProjectId', data.contractId)
      } else if (data.filter === 'category') {
        this.$store.dispatch('searchStore/findByObject', data.category)
      } else if (data.filter === 'text-search') {
        this.$store.dispatch('searchStore/findBySearchTerm', data.query)
      } else if (data.filter === 'sale-type') {
        this.$store.dispatch('searchStore/findBySaleType', data.saleType)
      } else {
        this.$store.dispatch('searchStore/findBySearchTerm')
      }
      this.$store.commit(APP_CONSTANTS.SET_CURRENT_SEARCH, data)
      if (this.$route.name !== 'marketplace') {
        this.$router.push('/marketplace?filter=' + data.filter)
      }
    },
    toggleOnNavbar () {
      this.showNavbar = true
    },
    toggleOffNavbar () {
      this.showNavbar = false
    },
    updateEventCode (data) {
      this.$store.commit(APP_CONSTANTS.SET_EVENT_CODE, data)
      this.data = data
      this.componentKey += 1
    }
  },
  computed: {
    sectionDimensions () {
      return 'min-height: 100vh; width: auto;'
    }
  }
}
</script>

<style lang="scss">
</style>
