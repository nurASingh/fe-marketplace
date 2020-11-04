<template>
  <div :key="componentKey" id="app" v-if="loaded" :style="sectionDimensions">
    <div v-if="!adminPage">
      <router-view @updateEventCode="updateEventCode" name="header" style="width: 100%; z-index: 200; position: relative; top: 0px;"/>
    </div>
    <div v-else>
      <router-view v-if="showNavbar" @updateEventCode="updateEventCode" name="header" style="width: 100%; z-index: 200; position: absolute; top: 0;"/>
    </div>
    <router-view @updateEventCode="updateEventCode" @toggle-on-navbar="toggleOnNavbar" @toggle-off-navbar="toggleOffNavbar"/>
    <router-view name="footer" :class="(adminPage) ? 'app-footer' : ''"/>
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
    this.$store.dispatch('authStore/fetchMyAccount').then((profile) => {
      this.$store.dispatch('stacksStore/fetchMacsWalletInfo')
      this.$store.dispatch('projectStore/fetchMyProjects', profile).catch((err) => {
        console.log(err)
      })
    })
    this.$store.dispatch('applicationStore/lookupApplications')
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
