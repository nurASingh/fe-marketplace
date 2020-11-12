<template>
<div class="d-flex justify-content-center">
<b-navbar id="navbar" :style="bannerImage" toggleable="xl" class="my-nav mx-0">

  <b-navbar-brand><router-link class="navbar-brand" to="/"><img :src="logo" alt="risidio-logo"/></router-link></b-navbar-brand>
  <b-navbar-toggle target="nav-collapse" @click="mobileMenuExpandClass(); noScroll();">
    <span> </span>
    <span> </span>
    <span> </span>
  </b-navbar-toggle>
  <!--<b-navbar-nav class="navbar__login d-md-block d-xl-none">
  <div v-if="avatar" v-b-toggle.login-sidebar class="navbar__account"><span class="text-info" v-html="avatar"></span></div>
  <div v-else        v-b-toggle.login-sidebar class="navbar__account"><span><b-icon style="width: 30px; height: 30px;" class="text-info" icon="person-fill"/></span></div>
  </b-navbar-nav>-->

  <!-- Mobile Design for login menu -->
  <b-navbar-nav class="navbar__login d-xl-none">
    <b-nav-item v-if="loggedIn">
        <div v-if="avatar" v-b-toggle.login-sidebar class="navbar__account"><span v-html="avatar"></span><span class="text-info navbar__account--text">Account</span></div>
        <div v-else v-b-toggle.login-sidebar class="navbar__account"><span><b-icon icon="person-fill" class="navbar__default-account-icon"/></span><span class="text-info navbar__account--text">Account</span></div>
        <b-sidebar id="login-sidebar" right bg-variant="white" width="232px">
          <div class="">
            <div class="login-sidebar__username login-sidebar--border-bottom"><div>Hi, <span class="text-info">{{ username }}</span></div></div>
            <div class="login-sidebar__item-group login-sidebar--border-bottom">
              <div>Balance: {{ balance }}</div>
              <div>Addr: {{ stxAddress }}</div>
            </div>
            <div class="login-sidebar__item-group login-sidebar--border-bottom">
              <div><router-link to="/admin-app"><i class="far fa-play-circle"></i> Connect Project</router-link></div>
              <div><router-link to="/my-assets"><i class="far fa-folder-open"></i> My Collectibles</router-link></div>
            </div>
            <div class="login-sidebar__item-group"><span @click="logout()"><i class="fas fa-sign-out-alt"></i> Logout</span></div>
          </div>
        </b-sidebar>
      </b-nav-item>
  </b-navbar-nav>

  <b-collapse id="nav-collapse" is-nav>
    <!-- Right aligned nav items -->
    <b-navbar-nav class="align-items-xl-center">
      <b-nav-item-dropdown caret class="pl-xl-2 navbar__gallery-item">
        <!-- Using 'button-content' slot -->
        <template v-slot:button-content class="">
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
      <b-nav-item-dropdown caret class="dropdown-menu-wide navbar__applications-item">
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
      <b-nav-item class="text-info">Become a Contributer</b-nav-item>
    </b-navbar-nav>
    <b-navbar-nav class="ml-xl-auto align-items-xl-center">
      <b-nav-item>How It Works</b-nav-item>
      <b-nav-item>About Risidio</b-nav-item>
      <b-nav-item>Help</b-nav-item>
      <!-- <b-nav-item-dropdown class="text-white ml-3" right v-if="loggedIn" no-caret>
        <template v-slot:button-content class="v-nav-user">
          <b-avatar class="bg-info"></b-avatar>
        </template>
        <b-dropdown-item><span>{{ username }}</span></b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item><span>Balance: {{ balance }}</span></b-dropdown-item>
        <b-dropdown-item><span>Addr: {{ stxAddress }}</span></b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item><router-link to="/admin-app"><i class="far fa-play-circle"></i> Connect Project</router-link></b-dropdown-item>
        <b-dropdown-item><router-link to="/my-assets"><i class="far fa-folder-open"></i> My Collectibles</router-link></b-dropdown-item>
        <b-dropdown-item><span @click="logout()"><i class="fas fa-sign-out-alt"></i> Logout</span></b-dropdown-item>
      </b-nav-item-dropdown>-->
    </b-navbar-nav>

    <b-navbar-nav class="navbar__login d-flex">
      <b-nav-item class="navbar__login--loogedin" v-if="loggedIn">
        <div v-if="avatar" v-b-toggle.login-sidebar class="navbar__account d-flex align-items-center"><span v-html="avatar"></span><span class="text-info navbar__account--text">Account</span></div>
        <div v-else v-b-toggle.login-sidebar class="navbar__account d-flex align-items-center"><span><b-icon icon="person-fill" class="navbar__default-account-icon"/></span><span class="text-info navbar__account--text">Account</span></div>
        <b-sidebar id="login-sidebar" right bg-variant="white" width="232px">
          <div class="login-sidebar__username login-sidebar--border-bottom"><div>Hi, <span class="text-info">{{ username }}</span></div></div>
            <div class="login-sidebar__item-group login-sidebar--border-bottom">
              <div>Balance: {{ balance }}</div>
              <div>Addr: {{ stxAddress }}</div>
            </div>
            <div class="login-sidebar__item-group login-sidebar--border-bottom">
              <div><router-link to="/admin-app"><i class="far fa-play-circle"></i> Connect Project</router-link></div>
              <div><router-link to="/my-assets"><i class="far fa-folder-open"></i> My Collectibles</router-link></div>
            </div>
            <div class="login-sidebar__item-group"><span @click="logout()"><i class="fas fa-sign-out-alt"></i>Logout</span></div>
        </b-sidebar>
      </b-nav-item>
      <b-nav-item @click.prevent="startLogin()" href="#" v-else><button class="login-button button-secondary">Login</button></b-nav-item>
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
      // this.$emit('updateEventCode', { eventCode: 'connect-logout' })
      this.$store.dispatch('authStore/startLogout').then(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    },
    startLogin () {
      // this.$emit('updateEventCode', { eventCode: 'connect-login' })
      const myProfile = this.$store.getters['authStore/getMyProfile']
      if (myProfile.loggedIn) {
        this.$emit('connect-login', myProfile)
      } else {
        this.$store.dispatch('authStore/startLogin')
      }
    },
    mobileMenuExpandClass () {
      const element = document.getElementById('navbar')
      element.classList.toggle('navbar__mobile-design')
    },
    noScroll () {
      const element = document.getElementById('app')
      element.classList.toggle('no-scroll')
      document.body.classList.toggle('no-scroll')
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
        'background-size': 'cover'
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
      if (profile.wallet.keyInfo.address) {
        return profile.wallet.keyInfo.address.substring(0, 5) + '...' + profile.wallet.keyInfo.address.substring(profile.wallet.keyInfo.address.length - 5)
      }
      return 'n/a'
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
        }
      }
      return null
    },
    loggedIn () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return profile.loggedIn
    }
  }
}
</script>

<style lang="scss">
/* NAVBAR PADDING AND WIDTH */
nav.navbar {
  width: 100vw;
  padding-right: 50px;
  padding-left: 50px;
  position: absolute!important;
  top: 0;
  left: 0;
}

/* NAV ITEMS STYLE */
nav ul {
  font-size: 12px;
}
#nav-collapse ul.navbar-nav:first-child {
  font-weight: 600;
}
#nav-collapse ul.navbar-nav:last-child {
  font-weight: 300;
}
.navbar-nav .nav-item:not(:last-child) {
  margin-right: 30px;
}
#nav-collapse ul li a {
  padding: 0;
}
#nav-collapse ul:first-child li.text-info a {
  color: #50B1B5 !important;
  font-weight: 700;
}
.navbar__account--text {
  margin-left: 13px;
  font-weight: 700;
}
.navbar__account:focus {
  outline: none;
}
nav .nav-link {
  color: #fff !important;
}

/* NAV LOGIN */
nav .login-button {
  width: 97px;
  margin-left: 40px;
  font-size: 12px;
}

nav .navbar__default-account-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: $info;
}

nav .navbar__account {
  margin-left: 30px;
}

nav .navbar__login .nav-link {
  padding: 0;
}

.v-nav-user {
  height: 100vh;
  width: 232px;
  background: #fff;
}

/* NAV LOGO */
nav a.navbar-brand {
  height: 80px;
  width: auto;
}

/* DROPDOWN MENUS */
nav .dropdown-menu li:first-child a {
  font-weight: 300;
}
nav .navbar__gallery-item .dropdown-menu li:not(:last-child) {
  margin-bottom: 15px;
}
nav .navbar__applications-item .dropdown-menu li:first-child {
  margin-bottom: 30px;
}
nav .navbar__applications-item .dropdown-menu li:not(:last-child):not(:first-child) {
  margin-bottom: 15px;
}

/* SIDEBAR */
#login-sidebar {
  height: 101vh;
}
#login-sidebar:hover {
  cursor: default;
}
#login-sidebar header {
  padding: 11.5px;
}
#login-sidebar header button {
  margin: 0 0 0 auto;
  font-size: 1px;
}
#login-sidebar header button svg {
  font-size: 15px;
}
.login-sidebar--border-bottom {
  border-bottom: 1px solid #E3E3E3;
}
.login-sidebar__username {
  height: 82px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-sidebar__username span {
  font-weight: 700;
}
.login-sidebar__username div {
  margin-bottom: 38px;
}
.login-sidebar__item-group {
  padding: 30px 40px;
}
.login-sidebar__item-group div:not(:last-child) {
  margin-bottom: 20px;
}

/* MOBILE DESIGN */
nav .navbar-toggler {
  border: none;
  margin-left: auto;
  width: auto;
}

@media only screen and (max-width: 1199px) {

  /* MOBILE NAVBAR LOGIN */
  nav .login-button {
    width: 100%;
    margin-left: 0px;
    font-size: 14px;
  }
  nav .navbar-collapse .navbar__login {
    margin: auto 0 0;
  }

  nav .navbar__account {
    margin-left: 20px;
  }

  nav .navbar__login--loogedin {
    display: none;
  }

  nav .navbar__login .navbar__account--text {
    display: none;
  }

  /* MOBILE COLLAPSE MENU */
  .navbar__mobile-design {
    background-color: #2C0D99;
    position: fixed !important;
    right: 0;
    left: 0;
    top: 0;
  }

  .navbar-collapse {
    background-color: #2C0D99;
    z-index: -1;
    height: 100vh;
    width: 100%;
    display: flex;
    flex-flow: column;
    -webkit-transition: height 0.5s ease-out;
    -moz-transition: height 0.5s ease-out;
    -ms-transition: height 0.5s ease-out;
    -o-transition: height 0.5s ease-out;
    transition: height 0.5s ease-out;
  }

  .navbar-collapse.collapse {
    position: absolute;
    top: 0;
    left: 0;
    overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
  }
  .navbar-collapse.collapse::-webkit-scrollbar { /* WebKit */
    width: 0;
    height: 0;
  }

  #nav-collapse .navbar-nav {
    width: 100%;
    padding: 0 50px;
  }

  #nav-collapse .navbar-nav:first-child {
    margin-top: 115px;
  }

  #nav-collapse .navbar-nav .nav-item {
    margin: 0 0 20px;
    font-size: 14px;
  }

  #nav-collapse .navbar-nav:first-child .nav-item:last-child {
    padding-bottom: 20px;
    border-bottom: 1px solid #E5E5E5;
  }

  /* MOBILE DROPDOWN MENU */
  #nav-collapse .navbar-nav .dropdown-menu {
    padding: 0;
    margin: 0;
    font-size: 14px;
    background: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }

  #nav-collapse .navbar-nav .dropdown-menu .dropdown-item {
    color: #fff !important;
    margin-left: 20px;
  }

  #nav-collapse .navbar-nav .dropdown-menu .dropdown-item:first-child {
    margin-top: 20px;
  }

  #nav-collapse .navbar-nav .dropdown-menu .dropdown-item:hover, .navbar-nav .dropdown-menu .dropdown-item:focus  {
    background-color: transparent;
  }

}

/* MOBILE NAVBAR PADDING & MARGIN */
@media only screen and (max-width: 576px) {

  nav.navbar {
    padding-right: 20px;
    padding-left: 20px;
  }

  #nav-collapse .navbar-nav {
    padding: 0 20px;
  }
}

/*  TOGGLER ANIMATION */
nav .navbar-toggler span {
   display: block;
   background-color: #fff;
   height: 2px;
   width: 25px;
   margin-top: 6px;
   margin-bottom: 6px;
   -webkit-transform: rotate(0deg);
   -moz-transform: rotate(0deg);
   -o-transform: rotate(0deg);
   transform: rotate(0deg);
   position: relative;
   left: 0;
   opacity: 1;
}

nav .navbar-toggler span:nth-child(1),
nav .navbar-toggler span:nth-child(3) {
   -webkit-transition: transform .35s ease-in-out;
   -moz-transition: transform .35s ease-in-out;
   -o-transition: transform .35s ease-in-out;
   transition: transform .35s ease-in-out;
}

nav .navbar-toggler:not(.collapsed) span:nth-child(1) {
    position: relative;
    left: 0px;
    top: 11px;
    -webkit-transform: rotate(135deg);
    -moz-transform: rotate(135deg);
    -o-transform: rotate(135deg);
    transform: rotate(135deg);
}

nav .navbar-toggler:not(.collapsed) span:nth-child(2) {
    height: 12px;
    visibility: hidden;
    background-color: transparent;
}

nav .navbar-toggler:not(.collapsed) span:nth-child(3) {
    position: relative;
    left: 0px;
    top: -15px;
    -webkit-transform: rotate(-135deg);
    -moz-transform: rotate(-135deg);
    -o-transform: rotate(-135deg);
    transform: rotate(-135deg);
}

</style>
