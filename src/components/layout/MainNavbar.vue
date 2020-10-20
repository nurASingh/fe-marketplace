<template>
<div class="d-flex justify-content-center">
<b-navbar :style="bannerImage" toggleable="lg" variant="transparent" class="my-nav mx-0 px-5" style="width: 100%;">

  <b-navbar-brand href="/"><img :src="logo" alt="risidio-logo"/></b-navbar-brand>
  <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

  <b-collapse id="nav-collapse" is-nav>
    <!-- Right aligned nav items -->
    <b-navbar-nav class="align-items-center">
      <b-nav-item-dropdown caret>
        <!-- Using 'button-content' slot -->
        <template v-slot:button-content class="text-danger">
          <span>Gallery</span>
        </template>
        <b-dropdown-item>Type of Collectables</b-dropdown-item>
        <b-dropdown-item>All</b-dropdown-item>
        <b-dropdown-item>Popular</b-dropdown-item>
        <b-dropdown-item>On Sale</b-dropdown-item>
        <b-dropdown-item>On Auction</b-dropdown-item>
        <b-dropdown-item>On Offer</b-dropdown-item>
        <b-dropdown-item>Recently Added</b-dropdown-item>
      </b-nav-item-dropdown>
      <b-nav-item>Collections</b-nav-item>
      <b-nav-item>Artists</b-nav-item>
      <b-nav-item-dropdown caret class="dropdown-menu-wide">
        <!-- Using 'button-content' slot -->
        <template v-slot:button-content>
          <span class="text-white">Applications</span>
        </template>
        <div class="row">
          <div class="col-6">
            <b-dropdown-item>Type of Collectables</b-dropdown-item>
            <b-dropdown-item>All</b-dropdown-item>
            <b-dropdown-item>Popular</b-dropdown-item>
            <b-dropdown-item>On Sale</b-dropdown-item>
            <b-dropdown-item>On Auction</b-dropdown-item>
            <b-dropdown-item>On Offer</b-dropdown-item>
            <b-dropdown-item>Recently Added</b-dropdown-item>
          </div>
          <div class="col-6">
            <b-dropdown-item>Type of Collectables</b-dropdown-item>
            <b-dropdown-item>All</b-dropdown-item>
            <b-dropdown-item>Popular</b-dropdown-item>
            <b-dropdown-item>On Sale</b-dropdown-item>
            <b-dropdown-item>On Auction</b-dropdown-item>
            <b-dropdown-item>On Offer</b-dropdown-item>
            <b-dropdown-item>Recently Added</b-dropdown-item>
          </div>
        </div>
      </b-nav-item-dropdown>
      <b-nav-item class="text-success">Become a Contributer</b-nav-item>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto align-items-center">
      <b-nav-item>How It Works</b-nav-item>
      <b-nav-item>About Risidio</b-nav-item>
      <b-nav-item>Help</b-nav-item>
      <b-nav-item-dropdown class="text-white ml-3" right v-if="loggedIn" no-caret>
        <!-- Using 'button-content' slot -->
        <template v-slot:button-content class="v-nav-user">
          <b-avatar class="bg-info"></b-avatar>
        </template>
        <b-dropdown-item><span>{{ username }}</span></b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item><span>Balance: {{ balance }}</span></b-dropdown-item>
        <b-dropdown-item><span>Addr: {{ stxAddress }}</span></b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item><router-link to="/app-admin"><i class="far fa-play-circle"></i> Connect Project</router-link></b-dropdown-item>
        <b-dropdown-item><router-link to="/my-items"><i class="far fa-folder-open"></i> My Collectibles</router-link></b-dropdown-item>
        <b-dropdown-item><span @click="logout()"><i class="fas fa-sign-out-alt"></i> Logout</span></b-dropdown-item>
      </b-nav-item-dropdown>
      <b-nav-item @click.prevent="startLogin()" href="#" v-else>Login</b-nav-item>
    </b-navbar-nav>
  </b-collapse>
</b-navbar>
</div>
</template>

<script>
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'MainNavbar',
  components: {
  },
  data () {
    return {
      query: null,
      logo: require('@/assets/img/Group 15980.svg')
    }
  },
  methods: {
    logout () {
      this.$emit('updateEventCode', { eventCode: 'connect-logout' })
    },
    startLogin () {
      this.$emit('updateEventCode', { eventCode: 'connect-login' })
    }
  },
  computed: {
    content () {
      const content = this.$store.getters['contentStore/getHomepage']
      return content
    },
    bannerImage () {
      if (this.$route.name === 'homepage') {
        return ''
      }
      const content = this.$store.getters['contentStore/getHomepage']
      if (!content) {
        return
      }
      return {
        padding: '0 0 0 0',
        height: '128px',
        width: '100%',
        'background-repeat': 'no-repeat',
        'background-image': `url(${content.marketplace_image.url})`,
        'background-position': 'center center',
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'cover',
        'background-size': 'cover',
        opacity: 1
      }
    },
    showAdmin () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.showAdmin || location.origin.indexOf('local') > -1
    },
    balance () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return (profile && profile.wallet) ? profile.wallet.balance : 0
    },
    stxAddress () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return (profile && profile.wallet) ? profile.wallet.keyInfo.address : 'n/a'
    },
    username () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (!profile) {
        return 'unknown'
      } else if (profile.name && profile.name.length > 0) {
        return profile.name
      } else if (profile.username && profile.username.length > 0) {
        return profile.username
      } else {
        return profile.identityAddress
      }
    },
    avatar () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (profile.loggedIn) {
        if (profile.avatarUrl) {
          return (
            '<img style="width: 30px; height: 30px; border-radius: 20px;" src="' +
            profile.avatarUrl +
            '"/>'
          )
        } else {
          return '<img style="width: 30px; height: 30px; border-radius: 20px;" src="/img/default-avatar.png"/>'
        }
      } else {
        return '<img style="width: 30px; height: 30px; border-radius: 20px;" src="/img/default-avatar.png"/>'
      }
    },
    loggedIn () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.loggedIn
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/custom.scss";
.dropdown-item:hover, .dropdown-item:focus {
    text-decoration: none;
    background-color: $info !important;
}
.dropdown-toggle::after {
  color: $success;
}
.v-nav-user {
  height: 100vh;
  width: 232px;
  background: #fff;
}
a.navbar-brand {
  height: 80px;
  width: auto;
}
nav .dropdown-menu {
  background: #FFFFFF 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 17px;
  padding: 20px;
  font-size: 12px;
}
</style>
