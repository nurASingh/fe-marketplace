<template>
  <div :key="componentKey" id="app" v-if="loaded" :style="sectionDimensions">
    <div v-if="!adminPage">
      <router-view @updateEventCode="updateEventCode" name="header" style="width: 100%; z-index: 200; position: absolute; top: 0;"/>
    </div>
    <div v-else>
      <router-view v-if="showNavbar" @updateEventCode="updateEventCode" name="header" style="width: 100%; z-index: 200; position: absolute; top: 0;"/>
    </div>
    <router-view @updateEventCode="updateEventCode" @toggle-on-navbar="toggleOnNavbar" @toggle-off-navbar="toggleOffNavbar"/>
    <router-view name="footer" :class="(adminPage) ? 'app-footer' : ''"/>
    <lsat-entry :paymentConfig="configuration" @paymentEvent="paymentEvent"></lsat-entry>
    <notifications :duration="10000" classes="r-notifs" position="bottom right" width="30%"/>
  </div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'
// import LsatEntry from 'LsatEntry'

export default {
  name: 'App',
  components: {
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
      this.adminPage = this.$route.name.indexOf('-app') > -1
    }
  },
  mounted () {
    this.adminPage = this.$route.name.indexOf('-app') > -1
    const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
    this.$store.dispatch('projectStore/fetchProjects', profile)
    this.$store.dispatch('searchStore/findProjects')
    if (profile.loggedIn && profile.environment !== 'localhost') {
      this.loaded = true
    } else {
      this.loaded = true
    }
    const $self = this
    let resizeTimer
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(function () {
        $self.$store.commit('setWinDims')
        $self.componentKey += 1
      }, 200)
    })
    this.$prismic.client.getSingle('homepage').then(document => {
      if (document) {
        this.$store.commit('contentStore/addHomeContent', document.data)
      }
    })
  },
  methods: {
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
    },
    paymentEvent: function (eventData) {
      const data = eventData.detail[0]
      if (data.returnCode === 'connect-login-session' ||
          data.returnCode === 'connect-login-start' ||
          data.returnCode === 'connect-logout-success') {
        this.$store.commit('myProfile', data.profile)
      } else if (data.returnCode === 'stx-deploy-confirmed') {
        this.$store.dispatch('projectStore/saveContractToGaia', data)
        this.$notify({ type: 'success', title: 'Deploy Details', text: 'Sent your contract to the Stacks 2.0 blockchain - should be deployed shortly.' })
      } else if (data.returnCode === 'stx-deploy-error') {
        this.$notify({ type: 'error', title: 'Deploy Details', text: 'We encountered an error deploying your contract.' })
      }
      this.$store.dispatch('projectStore/fetchProjects', data.profile)
    }
  },
  computed: {
    configuration () {
      const eventCode = this.$store.getters[APP_CONSTANTS.KEY_EVENT_CODE]
      const configuration = { provider: 'risidio', opcode: eventCode, data: this.data }
      window.risidioPaymentConfig = JSON.stringify(configuration)
      return configuration || {}
    },
    sectionDimensions () {
      // const height = this.$store.getters['searchStore/getResultSet']
      return 'min-height: 100vh; width: auto;'
    }
  }
}
</script>

<style lang="scss">
</style>
