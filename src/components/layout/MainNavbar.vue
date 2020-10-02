<template>
<div class="d-flex justify-content-center">
<b-navbar type="dark" variant="dark" class="my-nav mx-0 px-5" style="width: 100%;">

  <b-navbar-brand href="#"><router-link to="/" class="navbar-brand">Risidio Auctions</router-link></b-navbar-brand>
  <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

  <b-collapse id="nav-collapse" is-nav class="bg-dark">
    <!-- Right aligned nav items -->
    <b-navbar-nav class="mx-auto">
      <b-nav-form>
        <b-form-input v-model="query"  size="sm" style="width: 500px" class="mr-sm-2" placeholder=""></b-form-input>
        <b-button @click.prevent="doSearch" variant="outline-primary" size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
      </b-nav-form>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown class="v-text ml-3" right v-if="loggedIn" no-caret>
        <!-- Using 'button-content' slot -->
        <template v-slot:button-content>
          <i class="fas fa-bars"></i>
        </template>
        <b-dropdown-item>{{ username }}</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item v-if="eligible"><a href="#" class="my-4 btn text-white btn-lg bg-danger " style="" @click.prevent="claimFreeCredits">Claim Free Credits</a></b-dropdown-item>
        <b-dropdown-item v-if="showAdmin || isDev"><router-link to="/my-sessions"><i class="far fa-play-circle"></i> My Sessions</router-link></b-dropdown-item>
        <b-dropdown-item><router-link :to="marketplaceUrl"><i class="far fa-play-circle"></i> Marketplace</router-link></b-dropdown-item>
        <b-dropdown-item><router-link to="/startLoop"><i class="far fa-play-circle"></i> Play</router-link></b-dropdown-item>
        <b-dropdown-item><router-link to="/buyCredits"><i class="far fa-play-circle"></i> Buy Credits</router-link></b-dropdown-item>
        <b-dropdown-item><router-link class="text-dark" to="/my-items"><i class="far fa-folder-open"></i> My Loops</router-link></b-dropdown-item>
        <b-dropdown-item><span @click="logout()"><i class="fas fa-sign-out-alt"></i> Logout</span></b-dropdown-item>
      </b-nav-item-dropdown>
      <b-nav-item @click.prevent="startLogin()" href="#" v-else>Login</b-nav-item>
    </b-navbar-nav>
  </b-collapse>
</b-navbar>
</div>
</template>

<script>
export default {
  name: 'MainNavbar',
  components: {
  },
  data () {
    return {
      query: null
    }
  },
  methods: {
    doSearch () {
      if (this.$route.name !== 'Marketplace') {
        this.$router.push('/marketplace')
      }
      this.$store.dispatch('searchStore/search', this.query + '*')
    },
    logout () {
      this.$store.dispatch('authStore/startLogout').then(() => {
        localStorage.clear()
        sessionStorage.clear()
        this.$router.push('/')
        this.$emit('closeMenu')
      })
    },
    startLogin () {
      this.$emit('showConnect', { connectCode: 'login' })
    }
  },
  computed: {
    showAdmin () {
      return this.$store.state.authStore.myProfile.showAdmin || location.origin.indexOf('local') > -1
    },
    username () {
      const profile = this.$store.state.authStore.myProfile
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
      const myProfile = this.$store.getters['authStore/getMyProfile']
      if (myProfile.loggedIn) {
        if (myProfile.avatarUrl) {
          return (
            '<img style="width: 30px; height: 30px; border-radius: 20px;" src="' +
            myProfile.avatarUrl +
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
      const myProfile = this.$store.getters['authStore/getMyProfile']
      return myProfile.loggedIn
    }
  }
}
</script>

<style scoped>
.my-nav {
  height: 55px;
  margin: 0 1rem 0 1rem;
}
.v-text {
  font-family: 'Roboto', sans-serif;
  font-weight: 200;
  font-size: 1.7rem;
}
.v-image {
  height: 30px;
}

</style>
