<template>
<b-container v-if="loading">
  <b-row class="splash-screen vh-100 text-center" align-v="center">
    <b-col><b-button class="main-navigation-button" variant="primary">#1</b-button></b-col>
  </b-row>
</b-container>
<div v-else>
  <div v-if="!configured">
    <risidio-pay :configuration="configuration"/>
  </div>
  <div :key="componentKey" id="app" v-else :style="sectionDimensions">
    <div v-if="!adminPage">
      <router-view @set-filter="setFilter" @updateEventCode="updateEventCode" name="header" style="width: 100%; z-index: 200; position: relative; top: 0px;"/>
    </div>
    <div v-else>
      <router-view @set-filter="setFilter" v-if="showNavbar" @updateEventCode="updateEventCode" name="header" style="width: 100%; z-index: 200; position: absolute; top: 0;"/>
    </div>
    <router-view @updateEventCode="updateEventCode" @toggle-on-navbar="toggleOnNavbar" @set-filter="setFilter" @toggle-off-navbar="toggleOffNavbar" style="min-height: 100vh;"/>
    <router-view @set-filter="setFilter" name="footer" :class="(adminPage) ? 'app-footer' : ''"/>
    <notifications :duration="10000" classes="r-notifs" position="bottom right" width="30%"/>
    <waiting-modal/>
    <success-modal />
    <risidio-pay :configuration="configuration"/>
  </div>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
import SuccessModal from '@/components/utils/SuccessModal'
import WaitingModal from '@/components/utils/WaitingModal'
import RisidioPay from 'risidio-pay'

export default {
  name: 'App',
  components: {
    SuccessModal,
    WaitingModal,
    RisidioPay
  },
  data () {
    return {
      loading: true,
      configured: false,
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
      this.adminPage = this.isHeaderLess()
      if (this.adminPage) this.showNavbar = false
    }
  },
  mounted () {
    this.adminPage = this.$route.name.indexOf('-app') > -1
    this.adminPage = this.isHeaderLess()
    this.$store.commit(APP_CONSTANTS.SET_RPAY_FLOW, { flow: 'config-flow', asset: this.gaiaAsset })
    this.loading = false
    const $self = this
    if (window.eventBus && window.eventBus.$on) {
      window.eventBus.$on('rpayEvent', function (data) {
        if (data.opcode === 'configured') {
          /**
          $self.$store.dispatch('rpayStacksContractStore/indexGaiaData').then((result) => {
            $self.result = result
          }).catch((err) => {
            $self.result = err
          })
          **/
          $self.$store.dispatch('rpayAuthStore/fetchMyAccount').then((profile) => {
            $self.$store.dispatch('fetchRatesFromDb')
            if (profile.loggedIn) {
              $self.$store.dispatch('rpayAuthStore/fetchAccountInfo', { stxAddress: profile.stxAddress, force: true })
              $self.$store.dispatch('projectStore/initSchema', profile).then(() => {
                $self.configured = true
                $self.$store.dispatch('projectStore/fetchMyProjects', profile)
                if ($self.$route.query && $self.$route.query) {
                  $self.setFilter($self.$route.query)
                }
              })
            } else {
              $self.configured = true
            }
            $self.$store.dispatch('rpayStacksStore/fetchMacSkyWalletInfo')
          })
        }
      })
    }

    let resizeTimer
    /**
    const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
    if (window.eventBus && window.eventBus.$on) {
      window.eventBus.$on('rpayEvent', function (data) {
        if (data.opcode === 'configured') {
          $self.$store.dispatch('rpayStacksContractStore/fetchContractData', configuration)
        }
      })
    }
    **/
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
        this.$store.dispatch('rpaySearchStore/findByProjectId', data.contractId)
      } else if (data.filter === 'category') {
        this.$store.dispatch('rpaySearchStore/findByObject', data.category)
      } else if (data.filter === 'text-search') {
        this.$store.dispatch('rpaySearchStore/findBySearchTerm', data.query)
      } else if (data.filter === 'sale-type') {
        this.$store.dispatch('rpaySearchStore/findBySaleType', data.saleType)
      } else {
        this.$store.dispatch('rpaySearchStore/findBySearchTerm')
      }
      this.$store.commit(APP_CONSTANTS.SET_CURRENT_SEARCH, data)
      if (this.$route.name !== 'marketplace') {
        // this.$router.push('/marketplace?filter=' + data.filter)
      }
    },
    toggleOnNavbar () {
      this.showNavbar = true
    },
    isHeaderLess () {
      return this.$route.name.indexOf('-app') > -1 ||
      this.$route.name === 'account' ||
      this.$route.name === 'wallet' ||
      this.$route.name === 'my-assets' ||
      this.$route.name === 'favourites'
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
    configuration () {
      const configuration = this.$store.getters[APP_CONSTANTS.KEY_RPAY_CONFIGURATION]
      return configuration
    },
    sectionDimensions () {
      return 'min-height: 100vh; width: auto;'
    }
  }
}
</script>

<style lang="scss">
</style>
