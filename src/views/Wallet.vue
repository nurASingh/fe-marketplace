<template>
<div class="row">
  <side-menu class="col-3 mr-0 pr-0 pt-5"/>
  <div class="col-9 pt-5 admin-app">
    <title-bar title="My Wallet" class="container" v-on="$listeners"/>
    <div class="container" @click="$emit('toggle-off-navbar')">
      <p class="text-40-300">My Balance</p>
      <div class="row">
        <div class="col-md-9 col-sm-12">
          <div class="mb-4 wallet-balance bg-white d-flex justify-content-between">
            <div class="wallet-text1">
              <a href="#">Balance</a>
            </div>
            <div class="wallet-text2">
              <span class="">STX</span> <a class="text-info" href="#">{{balance}}</a>
              <br/>
              <span class="text2">&euro;</span>
            </div>
          </div>
          <div class="wallet-balance bg-white d-flex justify-content-between">
            <div class="wallet-text1">
              <a href="#">Address</a>
            </div>
            <div class="">
              <a class="text2" href="#">{{stxAddress()}}</a>
            </div>
          </div>
          <div class="mt-5">
            <span class="text-17-500 mr-4">Recent Activity</span>
          </div>
        </div>
        <div class="col-md-3">
          <div class="pt-2">
            <b-button variant="info" class="">Get Credit</b-button>
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
    balance () {
      const profile = this.$store.getters[APP_CONSTANTS.KEY_PROFILE]
      return (profile && profile.wallet) ? profile.wallet.balance : 0
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
    }
  }
}
</script>
<style lang="scss" scoped>

.wallet-balance {
  text-align: right;
  background: #fff;
  border-radius: 20px;
  font-size: 10px;
  border: 1px solid #E3E3E3;
  padding: 10px 30px;
}
.wallet-text1 {
  font-weight: 500;
  font-style: italic;
  font-size: 1.1rem;
  color: #707070;
  text-transform: capitalize;
  margin-top: 5px;
}
.wallet-text2 {
  font-weight: 300;
  font-size: 2rem;
  color: #777777;
  text-transform: uppercase;
}
.wallet-text2 a {
  font-weight: 700;
  font-size: 2rem;
  color: #777777;
  text-transform: uppercase;
}
</style>
