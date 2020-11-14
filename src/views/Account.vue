<template>
<div class="row">
  <side-menu class="col-3 mr-0 pr-0 pt-5"/>
  <div class="col-9 pt-5 admin-app">
    <title-bar title="My Account" class="container" v-on="$listeners"/>
    <div class="container" @click="$emit('toggle-off-navbar')">
      <p class="text-40-300">User Details</p>
      <div class="row">
        <div class="col-md-9 col-sm-12">
          <div class="mb-4">
            <b-input-group>
              <template v-slot:prepend>
                <a href="#">Username</a>
              </template>
              <template v-slot:append>
                <a href="#">{{username}}</a>
              </template>
            </b-input-group>
          </div>
          <div>
            <b-input-group>
              <template v-slot:append>
                <a href="#">{{stxAddress()}}</a>
              </template>
              <template v-slot:prepend>
                <a href="#">Address</a>
              </template>
            </b-input-group>
          </div>
          <div class="mt-5">
            <span class="text-17-500 mr-4">I'm a</span>
            <b-button @click="amCollector = !amCollector" :variant="(amCollector) ? 'info' : 'light'" class="mr-2">Collector</b-button>
            <b-button @click="amArtist = !amArtist" :variant="(amArtist) ? 'info' : 'light'" class="mr-2">Artist</b-button>
            <b-button @click="amDeveloper = !amDeveloper" :variant="(amDeveloper) ? 'info' : 'light'" class="mr-2">Developer</b-button>
          </div>
        </div>
        <div class="text-center col-md-2 d-md-block d-sm-none d-xs-none">
          <div class="pt-2 login-sidebar__username login-sidebar--border-bottom">
            <div>
              <div v-if="avatar"><span v-html="avatar"></span></div>
              <div v-else><span><b-icon class="avatar" font-scale="10" icon="person"/></span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import SideMenu from '@/components/admin/SideMenu'
import TitleBar from '@/components/admin/TitleBar'
import { APP_CONSTANTS } from '@/app-constants'

export default {
  name: 'Account',
  components: {
    SideMenu,
    TitleBar
  },
  data () {
    return {
      showNavbar: false,
      projectOption: 0,
      amCollector: true,
      amArtist: false,
      amDeveloper: false
    }
  },
  mounted () {
    this.loading = false
    this.$store.dispatch('projectStore/fetchMyProjects')
  },
  methods: {
    stxAddress () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      if (profile.wallet && profile.wallet.keyInfo.address) {
        return profile.wallet.keyInfo.address // .substring(0, 3) + '...' + profile.wallet.keyInfo.address.substring(profile.wallet.keyInfo.address.length - 3)
      }
      return 'n/a'
    }
  },
  computed: {
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
            '<img style="width: 150px; height: 150px; border-radius: 50%;" src="' +
            profile.avatarUrl +
            '"/>'
          )
        }
      }
      return null
    }
  }
}
</script>
<style lang="scss" scoped>
.avatar {
  border: 1pt solid #ccc;
  padding: 15px;
  border-radius: 50%;
}
.input-group-prepend {
  background: #fff;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  font-size: 12px;
  border: 1px solid #E3E3E3;
  padding: 6px;
  padding-left: 20px;
  padding-right: 5px;
  width: 20%;
  text-align: left;
  font-weight: 500;
  font-style: italic;
  font-size: 11px;
  letter-spacing: 0px;
  color: #707070;
  text-transform: capitalize;
  padding-top: 10px;
}
.input-group-append {
  background: #fff;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  font-size: 12px;
  border: 1px solid #E3E3E3;
  padding: 6px;
  padding-left: 20px;
  padding-right: 20px;
  width: 80%;
  text-align: left;
  font-weight: 500;
  font-style: italic;
  font-size: 11px;
  letter-spacing: 0px;
  color: #707070;
  text-transform: capitalize;
  padding-top: 10px;
}
</style>
